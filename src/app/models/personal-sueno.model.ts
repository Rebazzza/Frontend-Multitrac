/**
 * Contrato de PERSONAL_SUEÑO.
 *
 * La tabla solo persiste el descanso como texto "H:MM"/"HH:MM" en la columna
 * `Sueño` (varchar(5)); no existen columnas separadas de hora de inicio/fin ni
 * de estado fisico. El backend expone:
 *  - `sueno`: el texto tal como se guarda.
 *  - `horasDescanso`: el mismo valor en horas decimales, calculado con
 *    HorasDescansoHelper a partir de `sueno`.
 */
export interface PersonalSueno {
  idSueno: number;
  idPersonal: number;
  idEmpresa?: number | null;
  idCliente?: number | null;
  idOperacionGeneral?: number | null;
  fecha?: string | null;
  estado?: number | null;
  /** Descanso en formato "H:MM" o "HH:MM". */
  sueno?: string | null;
  /** Descanso en horas decimales; calculado por el backend desde `sueno`. */
  horasDescanso?: number | null;
  chm?: number | null;
  foto?: string | null;
  observaciones?: string | null;
}

export interface PersonalSuenoCreateDto {
  idPersonal: number;
  idEmpresa?: number | null;
  idCliente?: number | null;
  idOperacionGeneral?: number | null;
  fecha?: string | null;
  estado?: number | null;
  sueno?: string | null;
  chm?: number | null;
  foto?: string | null;
  observaciones?: string | null;
}

export interface PersonalSuenoUpdateDto extends PersonalSuenoCreateDto {
  idSueno: number;
}

export interface PersonalSuenoDto extends PersonalSueno {}
