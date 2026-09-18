import { useEffect, useState } from 'react';
import httpService from '../services/http.service';

export interface LookupSpec {
  key: string;
  resource: string;
  idField: string;
}

export interface LookupMapsResult {
  maps: Record<string, Map<number, Record<string, unknown>>>;
  loading: boolean;
}

function toList(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data as Record<string, unknown>[];
  if (data && typeof data === 'object' && Array.isArray((data as { value?: unknown }).value)) {
    return (data as { value: Record<string, unknown>[] }).value;
  }
  return [];
}

export function useLookupMaps(specs: LookupSpec[]): LookupMapsResult {
  const signatures = specs.map((s) => `${s.key}|${s.resource}|${s.idField}`).join(',');

  const [maps, setMaps] = useState<Record<string, Map<number, Record<string, unknown>>>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const loadAll = async () => {
      setLoading(true);
      const entries = await Promise.all(
        specs.map(async (spec) => {
          const map = new Map<number, Record<string, unknown>>();
          try {
            const { data } = await httpService.get(spec.resource);
            for (const item of toList(data)) {
              const id = Number(item[spec.idField]);
              if (!Number.isNaN(id)) map.set(id, item);
            }
          } catch {
            map.clear();
          }
          return [spec.key, map] as const;
        }),
      );
      if (!cancelled) {
        setMaps(Object.fromEntries(entries));
        setLoading(false);
      }
    };
    loadAll();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signatures]);

  return { maps, loading };
}

export function pickName(record: Record<string, unknown> | undefined, nameFields: string[]): string | null {
  if (!record) return null;
  for (const field of nameFields) {
    const raw = record[field];
    if (raw == null) continue;
    const value = String(raw).trim();
    if (!value) continue;
    if (/^[-–—.\\s]+$/.test(value)) continue;
    if (/^seleccione/i.test(value)) continue;
    return value;
  }
  return null;
}