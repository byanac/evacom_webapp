 export interface Admin {
    codigoFicha: String;
  }

  export interface Grupo {
    codigo: String;
  }
  
  export interface IRegisterCompetency {
    codigo: string;
    descripcion: string;
    admin: Admin
    grupo: Grupo,
    titulo: string;
    estado?: number
  }
  