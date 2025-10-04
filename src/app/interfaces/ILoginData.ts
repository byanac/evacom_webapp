export interface ILoginData {
  sub: string
  iat: number;
  exp: number;
  ficha: string;
  nombreCompleto: string;
  correo: string;
  codPuesto: string;
  desPuesto: string;
  indRolAdmin: boolean;
  permisos: IPermisos[]
  foto: string;
  uo: string;
  fecha:string;
}

interface IPermisos{
  calendario: string;
  evaluador: boolean;
  evaluado: boolean;
  evaluadorJefe: boolean;
  tipo: string;
}