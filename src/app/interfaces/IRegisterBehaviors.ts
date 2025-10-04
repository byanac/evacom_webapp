  export interface Admin {
    codigoFicha: String;
  }

  export interface Nivel {
    codigo: String;
  }

  export interface Competencia {
    codigo: String;
  }
  
  export interface IRegisterBehaviors {
    codigo: string;
    descripcion: string;    
    nivel: Nivel,
    competencia: Competencia,
    admin: Admin
    estado?: number
  }
  