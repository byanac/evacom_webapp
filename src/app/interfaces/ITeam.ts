
export interface ITeam {
    registros: Registro[];
    mensaje: string;
}

export interface Registro {
    codigo: string;
    nombreCorto: string
    nombre: string;
}
