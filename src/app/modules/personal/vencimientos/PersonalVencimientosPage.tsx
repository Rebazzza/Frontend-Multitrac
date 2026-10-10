import { useEffect, useState } from "react";
import type { Column } from "../../../shared/components/data-table";
import { DataTable } from "../../../shared/components/data-table";
import { Alert } from "../../../shared/components/alert";
import type { PersonalVencimientoDto } from "../../../models/personal.model";
import { personalService } from "../../../core/services/personal.service";
import "./vencimientos.css";

interface ApiError {
  status?: number;
  message?: string;
}

export function PersonalVencimientosPage() {
  const [items, setItems] = useState<PersonalVencimientoDto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filtroTipo, setFiltroTipo] = useState("");

  const cargarDatos = async () => {
    setError(null);
    try {
      const data = await personalService.getVencimientos();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al cargar vencimientos");
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, []);

  const getSemaforoClass = (dias?: number | null) => {
    if (dias === null || dias === undefined) return "badge";
    if (dias <= 0) return "badge badge--rojo";
    if (dias <= 30) return "badge badge--amarillo";
    return "badge badge--verde";
  };

  const getSemaforoText = (dias?: number | null) => {
    if (dias === null || dias === undefined) return "-";
    if (dias <= 0) return "Vencido";
    if (dias <= 30) return "Por vencer";
    return "Vigente";
  };

  const columns: Column<PersonalVencimientoDto>[] = [
    { key: "idPersonal", header: "ID Personal" },
    { key: "nombreCompleto", header: "Personal" },
    { key: "dniPersonal", header: "DNI" },
    { key: "nombreDocumento", header: "Tipo Documento" },
    { key: "nroDocumento", header: "Numero Documento" },
    { key: "fechaExped", header: "Fecha Expedicion" },
    { key: "fechaVencimiento", header: "Fecha Vencimiento" },
    { id: "diasParaVencer", key: "diasParaVencer", header: "Dias para Vencer", render: (item: any) => <span className={getSemaforoClass(item.diasParaVencer)}>{item.diasParaVencer ?? "-"}</span> },
    { id: "estadoVencimiento", key: "diasParaVencer", header: "Estado", render: (item: any) => <span className={getSemaforoClass(item.diasParaVencer)}>{getSemaforoText(item.diasParaVencer)}</span> },
  ];

  const itemsFiltrados = filtroTipo ? items.filter((i) => i.nombreDocumento?.toLowerCase().includes(filtroTipo.toLowerCase())) : items;

  return (
    <div className="vencimientos-page">
      <div className="vencimientos-page__header">
        <h1>Vencimientos de Documentacion</h1>
      </div>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <div className="vencimientos-filtros">
        <label>Tipo de Documento</label>
        <input type="text" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} placeholder="Filtrar por tipo..." />
      </div>
      <DataTable columns={columns as any} data={itemsFiltrados as any} emptyMessage="No hay vencimientos" getRowKey={(item: any) => item.idPersonalDocumento} />
    </div>
  );
}
