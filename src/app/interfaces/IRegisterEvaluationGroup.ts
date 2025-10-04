  export interface Admin {
    codigoFicha: String;
  }
  
  export interface IRegisterEvaluationGroup {
    codigo: string;
    descripcion: string;
    admin: Admin
    estado?: number
  }
  

  