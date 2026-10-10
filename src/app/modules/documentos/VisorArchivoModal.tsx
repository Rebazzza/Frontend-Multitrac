import { useEffect, useState } from 'react';
import { Modal } from '../../shared/components/modal';
import { documentoService } from '../../core/services/documento.service';
import type { ApiError } from '../../core/interceptors/error.interceptor';
import './documentos-page.css';

interface VisorArchivoModalProps {
  isOpen: boolean;
  idDocumentoRegistro?: number | null;
  nombreArchivo?: string | null;
  title?: string;
  onClose: () => void;
}

/**
 * Visor seguro de archivos. Descarga el documento como blob autenticado y lo
 * muestra con un object URL (imágenes y PDFs), de forma que nunca se expone ni
 * se navega a la ruta física del servidor.
 */
export function VisorArchivoModal({
  isOpen,
  idDocumentoRegistro,
  nombreArchivo,
  title = 'Vista previa del documento',
  onClose,
}: VisorArchivoModalProps) {
  const [url, setUrl] = useState<string | null>(null);
  const [contentType, setContentType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const id = idDocumentoRegistro;
    if (!isOpen || !id) return;

    let cancelled = false;
    let objectUrl: string | null = null;

    const load = async () => {
      setLoading(true);
      setError('');
      setUrl(null);
      setContentType('');
      try {
        const { blob, contentType: tipo } = await documentoService.getArchivo(id);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
        setContentType(tipo || blob.type);
      } catch (err) {
        if (!cancelled) {
          setError((err as ApiError)?.message || 'No se pudo cargar el archivo.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [isOpen, idDocumentoRegistro]);

  const esPdf = contentType.includes('pdf') || /\.pdf$/i.test(nombreArchivo ?? '');
  const esImagen = contentType.startsWith('image/');

  return (
    <Modal isOpen={isOpen} title={title} onClose={onClose} size="lg">
      <div className="documentos-visor">
        {nombreArchivo && <p className="documentos-visor__nombre">{nombreArchivo}</p>}

        {loading && <div className="documentos-visor__estado">Cargando archivo...</div>}
        {!loading && error && (
          <div className="documentos-visor__estado documentos-visor__estado--error">{error}</div>
        )}

        {!loading && !error && url && esImagen && (
          <img className="documentos-visor__imagen" src={url} alt={nombreArchivo ?? 'Documento'} />
        )}
        {!loading && !error && url && !esImagen && esPdf && (
          <iframe
            className="documentos-visor__pdf"
            src={url}
            title={nombreArchivo ?? 'Documento PDF'}
          />
        )}
        {!loading && !error && url && !esImagen && !esPdf && (
          <div className="documentos-visor__estado">
            Este tipo de archivo no se puede previsualizar. Puede descargarlo.
          </div>
        )}

        <div className="documentos-visor__actions">
          {url && (
            <a className="btn btn--secondary" href={url} download={nombreArchivo ?? 'documento'}>
              Descargar
            </a>
          )}
          <button type="button" className="btn btn--primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
