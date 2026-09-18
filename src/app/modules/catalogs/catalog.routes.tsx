import { Routes, Route } from 'react-router-dom';
import { CatalogPage } from './catalog-page';
import { catalogConfigs, type CatalogKey } from './catalog-config';

const CATALOG_KEYS: CatalogKey[] = [
  'monedas', 'bancos', 'cargos', 'nivelesEducativos', 'afps',
  'flotas', 'actividades', 'turnos', 'tiposPago', 'tiposOcurrencia',
];

const ROUTE_PATHS: Record<CatalogKey, string> = {
  monedas: 'monedas',
  bancos: 'bancos',
  cargos: 'cargos',
  nivelesEducativos: 'niveles-educativos',
  afps: 'afps',
  flotas: 'flotas',
  actividades: 'actividades',
  turnos: 'turnos',
  tiposPago: 'tipos-pago',
  tiposOcurrencia: 'tipos-ocurrencia',
};

function CatalogRoute({ configKey }: { configKey: CatalogKey }) {
  const config = catalogConfigs[configKey];
  const idKey = `id${config.resource.charAt(0).toUpperCase()}${config.resource.slice(1)}`;

  return (
    <CatalogPage
      key={configKey}
      title={config.title}
      columns={config.columns}
      fields={config.fields}
      defaultSort={config.defaultSort}
      lookups={config.lookups}
      getPaged={config.service.getPaged}
      create={config.service.create}
      update={config.service.update}
      remove={config.service.remove}
      idKey={idKey}
    />
  );
}

export function CatalogRoutes() {
  return (
    <Routes>
      {CATALOG_KEYS.map((key) => (
        <Route
          key={key}
          path={ROUTE_PATHS[key]}
          element={<CatalogRoute configKey={key} />}
        />
      ))}
    </Routes>
  );
}
