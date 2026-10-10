import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import type { Column } from "../../shared/components/data-table";
import { DataTable } from "../../shared/components/data-table";
import { Pagination } from "../../shared/components/pagination";
import { SearchBar } from "../../shared/components/search-bar";
import { Alert } from "../../shared/components/alert";
import { ConfirmDialog } from "../../shared/components/confirm-dialog";
import { operacionFleteService } from "../../core/services/operacion-flete.service";
import { useLookupMaps } from "../../core/hooks/use-lookup-maps";
import { FleteFormModal } from "./FleteFormModal";
import "./operaciones-page.css";

interface ApiError {
  status?: number;
  message?: string;
}

export function FletesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | undefined>();
  const [, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ visible: boolean; item: any }>({ visible: false, item: null });
  const [filtros, setFiltros] = useState({ idOperacion: "", idRemitente: "", idTransportista: "", fechaDesde: "", fechaHasta: "", estado: "" });

  const lookup = useLookupMaps([
    { key: "operacion", resource: "Operacion", idField: "idOperacion" },
    { key: "cliente", resource: "Cliente", idField: "idCliente" },
  ]) as any;
  const operacionMap = lookup.operacionMap ?? lookup.maps?.operacion ?? new Map();
  const clienteMap = lookup.clienteMap ?? lookup.maps?.cliente ?? new Map();

  const cargarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await operacionFleteService.getPaged({ page, pageSize, search: search.trim() || undefined, sortBy, sortDirection });
      setItems((response as any).items ?? []);
      setTotalPages((response as any).totalPages ?? 1);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al cargar fletes");
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      await operacionFleteService.remove(confirmDelete.item.idOperacionFlete);
      setConfirmDelete({ visible: false, item: null });
      setPage(1);
      void cargarDatos();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al eliminar flete");
    } finally {
      setLoading(false);
    }
  };

  const handleFiltroChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleFiltrar = (e: FormEvent) => { e.preventDefault(); setPage(1); void cargarDatos(); };

  const columns: Column<any>[] = [
    { key: "idOperacionFlete", header: "ID", sortable: true },
    { key: "idOperacion", header: "Operacion", render: (item: any) => operacionMap.get(item.idOperacion ?? -1)?.descOperacion ?? String(item.idOperacion) },
    { key: "idRemitente", header: "Remitente", render: (item: any) => clienteMap.get(item.idRemitente ?? -1)?.nombre ?? String(item.idRemitente) },
    { key: "idTransportista", header: "Transportista", render: (item: any) => clienteMap.get(item.idTransportista ?? -1)?.nombre ?? String(item.idTransportista) },
    { key: "numeroGuia", header: "Numero Guia", sortable: true },
    { key: "peso", header: "Peso" },
    { key: "tarifaFlete", header: "Tarifa Flete" },
  ];

  return (
    <div className="operaciones-page">
      <div className="operaciones-page__header">
        <h1>Fletes</h1>
        <button className="btn btn--primary" onClick={handleNuevo}>Nuevo Flete</button>
      </div>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <form className="operaciones-filtros" onSubmit={handleFiltrar}>
        <div className="operaciones-filtros__grid">
          <div><label>Operacion</label><select name="idOperacion" value={filtros.idOperacion} onChange={handleFiltroChange}><option value="">Todos</option>{Array.from(operacionMap.values()).map((o: any) => (<option key={o.idOperacion} value={o.idOperacion}>{o.descOperacion}</option>))}</select></div>
          <div><label>Remitente</label><select name="idRemitente" value={filtros.idRemitente} onChange={handleFiltroChange}><option value="">Todos</option>{Array.from(clienteMap.values()).map((c: any) => (<option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>))}</select></div>
          <div><label>Transportista</label><select name="idTransportista" value={filtros.idTransportista} onChange={handleFiltroChange}><option value="">Todos</option>{Array.from(clienteMap.values()).map((c: any) => (<option key={c.idCliente} value={c.idCliente}>{c.nombre}</option>))}</select></div>
          <div><label>Fecha Desde</label><input type="date" name="fechaDesde" value={filtros.fechaDesde} onChange={handleFiltroChange} /></div>
          <div><label>Fecha Hasta</label><input type="date" name="fechaHasta" value={filtros.fechaHasta} onChange={handleFiltroChange} /></div>
        </div>
        <button type="submit" className="btn btn--secondary">Filtrar</button>
      </form>
      <SearchBar onSearch={setSearch} placeholder="Buscar fletes..." />
      <DataTable columns={columns as any} data={items} onSort={handleSort} sortBy={sortBy} sortDirection={sortDirection} onEdit={handleEditar} onDelete={handleEliminar} emptyMessage="No hay fletes" />
      <Pagination page={page} totalPages={totalPages} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(s) => { setPageSize(s); setPage(1); }} hasPrevious={page>1} hasNext={page<totalPages} />
      <FleteFormModal isOpen={showModal} flete={editing} onClose={() => setShowModal(false)} onSaved={() => { setShowModal(false); setPage(1); void cargarDatos(); }} />
      <ConfirmDialog isOpen={confirmDelete.visible} title="Eliminar flete" message={"¿Eliminar flete #" + confirmDelete.item?.idOperacionFlete + "?"} onConfirm={confirmarEliminar} onCancel={() => setConfirmDelete({ visible: false, item: null })} />
    </div>
  );
}

