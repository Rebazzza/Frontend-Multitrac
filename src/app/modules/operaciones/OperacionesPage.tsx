import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Column } from "../../shared/components/data-table";
import { DataTable } from "../../shared/components/data-table";
import { Pagination } from "../../shared/components/pagination";
import { SearchBar } from "../../shared/components/search-bar";
import { Alert } from "../../shared/components/alert";
import { ConfirmDialog } from "../../shared/components/confirm-dialog";
import { operacionService } from "../../core/services/operacion.service";
import { useLookupMaps } from "../../core/hooks/use-lookup-maps";
import { OperacionFormModal } from "./OperacionFormModal";
import { AsignacionFlotaModal } from "../../components/operaciones/AsignacionFlotaModal";
import { ESTADO_BADGE_CLASS } from "./operaciones-estado";
import "./operaciones-page.css";

interface ApiError {
  status?: number;
  message?: string;
}

const ESTADOS_OPERACION = ["Planificado", "En Planificacion", "En Ruta", "Completado"];

export function OperacionesPage() {
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
  const [showAsignar, setShowAsignar] = useState(false);
  const [asignando, setAsignando] = useState<any>(null);
  const [filtros, setFiltros] = useState({ idCliente: "", fechaDesde: "", fechaHasta: "", estado: "" });

  const lookup = useLookupMaps([
    { key: "cliente", resource: "Cliente", idField: "idCliente" },
  ]) as any;
  const clienteMap = lookup.clienteMap ?? lookup.maps?.cliente ?? new Map();

  const cargarDatos = async () => {
    setError(null);
    try {
      const response = await operacionService.getPaged({ page, pageSize, search: search.trim() || undefined, sortBy, sortDirection });
      setItems((response as any).items ?? []);
      setTotalPages((response as any).totalPages ?? 1);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al cargar operaciones");
    }
  };

  useEffect(() => { void cargarDatos(); }, [page, pageSize, search, sortBy, sortDirection]);

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
      await operacionService.remove(confirmDelete.item.idOperacion);
      setConfirmDelete({ visible: false, item: null });
      setPage(1);
      void cargarDatos();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al eliminar operacion");
    }
  };

  const handleAsignar = (item: any) => { setAsignando(item); setShowAsignar(true); };

  const handleFiltroChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltrar = (e: FormEvent) => { e.preventDefault(); setPage(1); void cargarDatos(); };

  const columns: Column<any>[] = [
    { key: "idOperacion", header: "ID", sortable: true },
    { key: "descOperacion", header: "Descripcion", sortable: true },
    { key: "idCliente", header: "Cliente", render: (item: any) => clienteMap.get(item.idCliente ?? -1)?.nombre ?? "" },
    { key: "origen", header: "Origen", sortable: true },
    { key: "destino", header: "Destino", sortable: true },
    { key: "estado", header: "Estado", sortable: true, render: (item: any) => { const e = item.estado ?? ""; const cls = ESTADO_BADGE_CLASS[e] ?? "operaciones-badge"; return <span className={"operaciones-badge " + cls}>{e}</span>; } },
  ];

  return (
    <div className="operaciones-page">
      <div className="operaciones-page__header">
        <h1>Operaciones</h1>
        <button className="btn btn--primary" onClick={handleNuevo}>Nueva Operacion</button>
      </div>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <form className="operaciones-filtros" onSubmit={handleFiltrar}>
        <div className="operaciones-filtros__grid">
          <div><label>Cliente</label><select name="idCliente" value={filtros.idCliente} onChange={handleFiltroChange}><option value="">Todos</option>{Array.from(clienteMap.values()).map((c: any) => (<option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>))}</select></div>
          <div><label>Fecha Desde</label><input type="date" name="fechaDesde" value={filtros.fechaDesde} onChange={handleFiltroChange} /></div>
          <div><label>Fecha Hasta</label><input type="date" name="fechaHasta" value={filtros.fechaHasta} onChange={handleFiltroChange} /></div>
          <div><label>Estado</label><select name="estado" value={filtros.estado} onChange={handleFiltroChange}><option value="">Todos</option>{ESTADOS_OPERACION.map((e) => (<option key={e} value={e}>{e}</option>))}</select></div>
        </div>
        <button type="submit" className="btn btn--secondary">Filtrar</button>
      </form>
      <SearchBar onSearch={setSearch} placeholder="Buscar operaciones..." />
      <DataTable columns={columns as any} data={items} onSort={handleSort} sortBy={sortBy} sortDirection={sortDirection} onEdit={handleEditar} onDelete={handleEliminar} onView={handleAsignar} emptyMessage="No hay operaciones" />
      <Pagination page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} hasPrevious={page>1} hasNext={page<totalPages} />
      <OperacionFormModal isOpen={showModal} operacion={editing} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); setPage(1); void cargarDatos(); }} />
      <AsignacionFlotaModal isOpen={showAsignar} convoy={asignando?.convoy ?? undefined} onClose={() => setShowAsignar(false)} onSaved={() => { setShowAsignar(false); void cargarDatos(); }} />
      <ConfirmDialog isOpen={confirmDelete.visible} title="Eliminar operacion" message={"¿Eliminar operacion #" + confirmDelete.item?.idOperacion + "?"} onConfirm={confirmarEliminar} onCancel={() => setConfirmDelete({ visible: false, item: null })} />
    </div>
  );
}

