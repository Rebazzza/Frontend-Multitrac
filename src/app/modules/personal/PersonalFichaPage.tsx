import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert } from "../../shared/components/alert";
import type { Personal } from "../../models/personal.model";
import { personalService } from "../../core/services/personal.service";
import "./PersonalFichaPage.css";

interface ApiError {
  status?: number;
  message?: string;
}

export function PersonalFichaPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const personalId = id ? Number(id) : null;
  const isEdit = personalId !== null;

  const [form, setForm] = useState<Partial<Personal>>({});
  const [cargos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"datos" | "cargo">("datos");

  const cargarDatos = async () => {
    if (!isEdit || personalId === null) return;
    setLoading(true);
    setError(null);
    try {
      const data = await personalService.getById(personalId);
      setForm(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al cargar ficha");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void cargarDatos();
  }, [personalId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isEdit && personalId !== null) {
        await personalService.update(personalId, form);
      } else {
        await personalService.create(form);
        navigate("/personal");
      }
      await cargarDatos();
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError?.message ?? "Error al guardar ficha");
    } finally {
      setLoading(false);
    }
  };

  const renderDatosGenerales = () => (
    <form onSubmit={handleSubmit} className="ficha-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Nombres</label>
          <input name="nomPersonal" value={form.nomPersonal ?? ""} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Apellido Paterno</label>
          <input name="apPersonal" value={form.apPersonal ?? ""} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Apellido Materno</label>
          <input name="amPersonal" value={form.amPersonal ?? ""} onChange={handleChange} />
        </div>
      </div>
      <div className="form-actions">
        <button type="button" className="btn btn--secondary" onClick={() => navigate("/personal")}>Volver</button>
        <button type="submit" className="btn btn--primary" disabled={loading}>{loading ? "Guardando..." : "Guardar"}</button>
      </div>
    </form>
  );

  const renderCargo = () => (
    <div className="ficha-section">
      <button type="button" className="btn btn--primary">Agregar Cargo</button>
      <table className="ficha-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cargo</th>
          </tr>
        </thead>
        <tbody>
          {cargos.map((c: any) => (
            <tr key={c.idPersonalCargo}>
              <td>{c.idPersonalCargo}</td>
              <td>{c.cargo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="ficha-page">
      <div className="ficha-page__header">
        <h1>Ficha de Personal</h1>
      </div>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      <div className="ficha-page__tabs">
        {["datos", "cargo"].map((t) => (
          <button key={t} className={"tab " + (tab === t ? "tab--active" : "")} onClick={() => setTab(t as any)}>{t.toUpperCase()}</button>
        ))}
      </div>
      <div className="ficha-page__content">
        {tab === "datos" && renderDatosGenerales()}
        {tab === "cargo" && renderCargo()}
      </div>
    </div>
  );
}

