import { IComportamientoResultado } from "./IComportamientoResultado";
import { IGrupo } from "./IGrupo";

export interface ICompetenciaResultado {
    codigo: string;
    titulo: string;
    descripcion: string;
    estado: number;
    grupo: IGrupo;
    nivel: string;
    resultado: number;
    comportamientosResultado: IComportamientoResultado[];
}
