  export interface Admin {
    codigoFicha: String;
  }
  
  export interface IRegisterCompetencyGroup {
    codigo: string;
    descripcion: string;
    admin: Admin
    estado?: number
  }
  