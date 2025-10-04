import { IComportamiento } from "./IComportamiento";
import { IGrupo } from "./IGrupo";

export interface ICompetencia {
    codigo: string;
    titulo: string;
    descripcion: string;
    grupo: IGrupo;
    nivel: string;
    comportamientos: IComportamiento[];
  }