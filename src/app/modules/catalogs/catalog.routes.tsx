import { Routes, Route, Navigate } from 'react-router-dom';
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

const ID_KEYS: Partial<Record<CatalogKey, string>> = {
  tiposPago: 'idTipoPago',
  tiposOcurrencia: 'idTipoOcurrencia',
};

function CatalogRoute({ configKey }: { configKey: CatalogKey }) {
  const config = catalogConfigs[configKey];
  const idKey = ID_KEYS[configKey]
    ?? `id${config.resource.charAt(0).toUpperCase()}${config.resource.slice(1)}`;

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
      <Route index element={<Navigate to='/catalogos/monedas' replace />} />
      {CATALOG_KEYS.map((key) => (
        <Route
          key={key}
          path={ROUTE_PATHS[key]}
          element={<CatalogRoute configKey={key} />}
        />
      ))}
      <Route path='*' element={<Navigate to='/catalogos/monedas' replace />} />
    </Routes>
  );
}
