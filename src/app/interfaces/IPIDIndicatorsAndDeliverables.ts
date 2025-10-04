export interface IRegistro {
    codigo: number;
    grupo: string;
    valor: string;
    descripcion: string;
}

export interface IPIDIndicatorsAndDeliverables {
    registros: IRegistro[];
    mensaje: string;
}
