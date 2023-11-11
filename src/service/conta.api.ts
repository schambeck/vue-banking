import { BaseFindById, BaseFindPage, BaseRemove } from "@/service/base.api";
import type { Conta } from "../entity/conta.entity";

const API_URL = import.meta.env.VITE_API_URL + "/contas";

export const useRemoveContaApi = () => new BaseRemove<number>(API_URL);
export const useFindByIdContaApi = () =>
  new BaseFindById<Conta, number>(API_URL);
export const useFindPageContaApi = () => new BaseFindPage<Conta>(API_URL);
