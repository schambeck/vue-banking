import { BaseCreate, BaseFindById, BaseFindPage, BaseRemove } from "@/service/base.api";
import type { Saldo } from "../entity/saldo.entity";

const API_URL = import.meta.env.VITE_API_URL + "/saldos";

export const useCreateSaldoApi = () => new BaseCreate<Saldo>(API_URL);
export const useRemoveSaldoApi = () => new BaseRemove<number>(API_URL);
export const useFindByIdSaldoApi = () =>
  new BaseFindById<Saldo, number>(API_URL);
export const useFindPageSaldoApi = () => new BaseFindPage<Saldo>(API_URL);
