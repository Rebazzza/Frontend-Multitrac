import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Column } from "../../shared/components/data-table";
import { DataTable } from "../../shared/components/data-table";
import { Pagination } from "../../shared/components/pagination";
import { SearchBar } from "../../shared/components/search-bar";
import { Alert } from "../../shared/components/alert";
import { ConfirmDialog } from "../../shared/components/confirm-dialog";
import { suenoService } from "../../core/services/sueno.service";
import { useLookupMaps } from "../../core/hooks/use-lookup-maps";
import { SuenoFormModal } from "./SuenoFormModal";
import "./SuenoPage.css";

interface ApiError {
  status?: number;
  message?: string;
}

function getDescansoBadge(horas?: number | null) {
  if (horas === null || horas === undefined) return { cls: "badge", text: "-" };
  if (horas >= 8) return { cls: "badge badge--verde", text: "Suficiente" };
  return { cls: "badge badge--rojo", text: "Insuficiente" };
}

export function SuenoPage() {
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | undefined>();
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ visible: boolean; item: any }>({ visible: false, item: null });
  const [fechaFiltro, setFechaFiltro] = useState("");

  const lookup = useLookupMaps([
    { key: "personal", resource: "Personal", idField: "idPersonal" },
  ]) as any;
  const personalMap = lookup.personalMap ?? lookup.maps?.personal ?? new Map();

  const cargarDatos = async () => {
    setError(null);
    try {
      const response = await suenoService.getPaged({ page, pageSize, search: search.trim() || undefined, sortBy, sortDirection });
      setItems((response as any).items ?? (response as any).data?.items ?? []);
      setTotalPages((response as any).totalPages ?? (response as any).data?.totalPages ?? 1);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al cargar registros de sueno");
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
      await suenoService.remove(confirmDelete.item.idSueno);
      setConfirmDelete({ visible: false, item: null });
      if (page === 1) { void cargarDatos(); } else { setPage(1); }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al eliminar registro");
    }
  };

  const handleModalClose = () => { setShowModal(false); setEditing(null); };
  const handleSaved = () => { setShowModal(false); setEditing(null); setPage(1); void cargarDatos(); };

  const handleFiltrarFecha = (e: FormEvent) => { e.preventDefault(); setPage(1); void cargarDatos(); };

  // Cada columna tiene un `id` unico. `key` apunta a la propiedad real del
  // DTO que devuelve el API (PersonalSuenoDto). El backend expone `sueno`
  // (texto "H:MM") y `horasDescanso` (decimal calculado).
  const columns: Column<any>[] = [
    { id: "idSueno", key: "idSueno", header: "ID", sortable: true, width: 80 },
    {
      id: "trabajador",
      key: "idPersonal",
      header: "Trabajador",
      width: 200,
      render: (item: any) => {
        const p = personalMap.get(item.idPersonal ?? -1);
        if (p) return ((p.nomPersonal || "") + " " + (p.apPersonal || "")).trim();
        return item.idPersonal != null ? String(item.idPersonal) : "-";
      },
    },
    {
      id: "fecha",
      key: "fecha",
      header: "Fecha",
      sortable: true,
      width: 120,
      render: (item: any) => (item.fecha ? String(item.fecha).slice(0, 10) : "-"),
    },
    {
      id: "sueno",
      key: "sueno",
      header: "Descanso (HH:MM)",
      width: 140,
      render: (item: any) => item.sueno || "-",
    },
    {
      id: "horasDescanso",
      key: "horasDescanso",
      header: "Horas Totales",
      sortable: true,
      width: 120,
      render: (item: any) => (item.horasDescanso != null ? Number(item.horasDescanso).toFixed(2) : "-"),
    },
    {
      id: "estadoDescanso",
      key: "estadoDescanso",
      header: "Estado Descanso",
      width: 140,
      render: (item: any) => {
        const b = getDescansoBadge(item.horasDescanso);
        return <span className={b.cls}>{b.text}</span>;
      },
    },
    { id: "observaciones", key: "observaciones", header: "Observaciones" },
  ];

  const itemsFiltrados = fechaFiltro
    ? items.filter((it: any) => String(it.fecha ?? "").slice(0, 10) === fechaFiltro)
    : items;

  return (
    <div className="operaciones-page">
      <div className="operaciones-page__header">
        <h1>Control de Sueno / Fatiga</h1>
        <button className="btn btn--primary" onClick={handleNuevo}>Nuevo Registro</button>
      </div>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <form className="operaciones-filtros" onSubmit={handleFiltrarFecha}>
        <div className="operaciones-filtros__grid">
          <div>
            <label>Fecha</label>
            <input type="date" value={fechaFiltro} onChange={(e: ChangeEvent<HTMLInputElement>) => setFechaFiltro(e.target.value)} />
          </div>
        </div>
        <button type="submit" className="btn btn--secondary">Filtrar</button>
      </form>
      <SearchBar onSearch={setSearch} placeholder="Buscar..." />
      <DataTable columns={columns as any} data={itemsFiltrados} onSort={handleSort} sortBy={sortBy} sortDirection={sortDirection} onEdit={handleEditar} onDelete={handleEliminar} emptyMessage="No hay registros de sueno" getRowKey={(item: any) => item.idSueno} />
      <Pagination page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} hasPrevious={page > 1} hasNext={page < totalPages} />
      <SuenoFormModal isOpen={showModal} registro={editing} onClose={handleModalClose} onSaved={handleSaved} />
      <ConfirmDialog isOpen={confirmDelete.visible} title="Eliminar registro" message={"¿Eliminar registro #" + (confirmDelete.item?.idSueno ?? "") + "?"} onConfirm={confirmarEliminar} onCancel={() => setConfirmDelete({ visible: false, item: null })} />
    </div>
  );
}

