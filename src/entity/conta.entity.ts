import type { Correntista } from "@/entity/correntista.entity";

export interface Conta {
  id: number;
  numero: number;
  agencia: string;
  correntista: Correntista;
  version: number;
}
