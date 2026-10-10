import { useEffect, useState, type FormEvent } from "react";
import type { Column } from "../../shared/components/data-table";
import { DataTable } from "../../shared/components/data-table";
import { Pagination } from "../../shared/components/pagination";
import { SearchBar } from "../../shared/components/search-bar";
import { Alert } from "../../shared/components/alert";
import { ConfirmDialog } from "../../shared/components/confirm-dialog";
import { personalService } from "../../core/services/personal.service";
import { useLookupMaps } from "../../core/hooks/use-lookup-maps";
import "./PersonalPage.css";

interface ApiError {
  status?: number;
  message?: string;
}

export function PersonalPage() {
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [, setShowModal] = useState(false);
  const [, setEditing] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ visible: boolean; item: any }>({ visible: false, item: null });
  const [estadoFiltro, setEstadoFiltro] = useState("");

  const lookup = useLookupMaps([
    { key: "contratista", resource: "Contratista", idField: "idContratista" },
  ]) as any;
  const contratistaMap = lookup.contratistaMap ?? lookup.maps?.contratista ?? new Map();

  const cargarDatos = async () => {
    setError(null);
    try {
      const response = await personalService.getPaged({ page, pageSize, search: search.trim() || undefined, sortBy, sortDirection });
      setItems((response as any).items ?? (response as any).data?.items ?? []);
      setTotalPages((response as any).totalPages ?? (response as any).data?.totalPages ?? 1);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al cargar personal");
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, [page, pageSize, search, sortBy, sortDirection]);

  const handleSort = (columnKey: string) => {
    if (sortBy === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnKey);
      setSortDirection("asc");
    }
  };

  const handleNuevo = () => { setEditing(null); setShowModal(true); };
  const handleEditar = (item: any) => { setEditing(item); setShowModal(true); };
  const handleEliminar = (item: any) => { setConfirmDelete({ visible: true, item }); };

  const confirmarEliminar = async () => {
    if (!confirmDelete.item) return;
    try {
      await personalService.remove(confirmDelete.item.idPersonal);
      setConfirmDelete({ visible: false, item: null });
      if (page === 1) { void cargarDatos(); } else { setPage(1); }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al eliminar personal");
    }
  };

  const handleFiltrarEstado = (e: FormEvent) => { e.preventDefault(); setPage(1); void cargarDatos(); };

  const columns: Column<any>[] = [
    { key: "idPersonal", header: "ID", sortable: true },
    { key: "nomPersonal", header: "Nombres", sortable: true },
    { key: "apPersonal", header: "Apellido Paterno", sortable: true },
    { key: "amPersonal", header: "Apellido Materno" },
    { key: "dniPersonal", header: "DNI/Documento" },
    { key: "cargo", header: "Cargo" },
    { key: "idContratista", header: "Contratista", render: (item: any) => contratistaMap.get(item.idContratista ?? -1)?.razonSocial ?? String(item.idContratista ?? "-") },
    { key: "estado", header: "Estado", render: (item: any) => <span className={"badge " + (item.estado === "Activo" ? "badge--verde" : "badge--rojo")}>{item.estado ?? "-"}</span> },
  ];

  const itemsFiltrados = estadoFiltro ? items.filter((i: any) => (i.estado ?? "").toLowerCase() === estadoFiltro.toLowerCase()) : items;

  return (
    <div className="operaciones-page">
      <div className="operaciones-page__header">
        <h1>Personal</h1>
        <button className="btn btn--primary" onClick={handleNuevo}>Nuevo Personal</button>
      </div>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <form className="operaciones-filtros" onSubmit={handleFiltrarEstado}>
        <div className="operaciones-filtros__grid">
          <div>
            <label>Estado</label>
            <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)}>
              <option value="">Todos</option>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn--secondary">Filtrar</button>
      </form>
      <SearchBar onSearch={setSearch} placeholder="Buscar personal..." />
      <DataTable columns={columns as any} data={itemsFiltrados} onSort={handleSort} sortBy={sortBy} sortDirection={sortDirection} onEdit={handleEditar} onDelete={handleEliminar} emptyMessage="No hay personal" />
      <Pagination page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} hasPrevious={page > 1} hasNext={page < totalPages} />
      <ConfirmDialog isOpen={confirmDelete.visible} title="Eliminar personal" message={"¿Eliminar a " + (confirmDelete.item?.nomPersonal ?? "") + "?"} onConfirm={confirmarEliminar} onCancel={() => setConfirmDelete({ visible: false, item: null })} />
    </div>
  );
}

