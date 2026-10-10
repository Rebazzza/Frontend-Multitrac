import { useEffect, useState, type ChangeEvent } from "react";
import { personalService } from "../../../core/services/personal.service";

export interface PersonalListItem {
  idPersonal: number;
  nomPersonal?: string | null;
  apPersonal?: string | null;
  amPersonal?: string | null;
  dniPersonal?: string | null;
  cargo?: string | null;
}

interface PersonalRecordTabProps {
  value?: number | null;
  onChange?: (id: number | null) => void;
  label?: string;
  showLabel?: boolean;
}

export function PersonalRecordTab({ value, onChange, label = "Trabajador", showLabel = true }: PersonalRecordTabProps) {
  const [items, setItems] = useState<PersonalListItem[]>([]);
  const [search, setSearch] = useState("");

  const cargar = async (s?: string) => {
    const res = await personalService.getPaged({ page: 1, pageSize: 50, search: s || undefined });
    const list = (res as any).items ?? (res as any).data?.items ?? [];
    setItems(list as PersonalListItem[]);
  };

  useEffect(() => {
    void cargar();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleBuscar = () => {
    void cargar(search.trim());
  };

  return (
    <div className="form-group">
      {showLabel && <label>{label}</label>}
      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <input value={search} onChange={handleSearch} placeholder="Buscar..." />
        <button type="button" onClick={handleBuscar}>Buscar</button>
      </div>
      <select value={value ?? ""} onChange={(e) => onChange?.(e.target.value === "" ? null : Number(e.target.value))}>
        <option value="">Seleccione...</option>
        {items.map((p) => (
          <option key={p.idPersonal} value={p.idPersonal}>{p.nomPersonal} {p.apPersonal}</option>
        ))}
      </select>
    </div>
  );
}

