import { BaseCreate, BaseFindById, BaseFindPage, BaseRemove } from "@/service/base.api";
import type { Movimentacao } from "@/entity/movimentacao.entity";

export const API_URL = import.meta.env.VITE_API_URL + "/movimentacoes";

export const useCreateMovimentacaoApi = () => new BaseCreate<Movimentacao>(API_URL);
export const useRemoveMovimentacaoApi = () => new BaseRemove<number>(API_URL);
export const useFindByIdMovimentacaoApi = () =>
  new BaseFindById<Movimentacao, number>(API_URL);
export const useFindPageMovimentacaoApi = () => new BaseFindPage<Movimentacao>(API_URL + "/extrato");
