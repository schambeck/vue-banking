export interface Movimentacao {
  id: number;
  data: string;
  tipo: string;
  valor: number;
  saldoAnterior: number;
  version: number;
}
