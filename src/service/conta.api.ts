import {
  BaseCreate,
  BaseFindById, BaseFindByNumerAndAgencia,
  BaseFindPage,
  BaseRemove,
  BaseUpdate
} from "@/service/base.api";
import type { Conta } from "../entity/conta.entity";

const API_URL = import.meta.env.VITE_API_URL + "/contas";

export const useCreateContaApi = () => new BaseCreate<Conta>(API_URL);
export const useUpdateContaApi = () => new BaseUpdate<Conta, number>(API_URL);
export const useRemoveContaApi = () => new BaseRemove<number>(API_URL);
export const useFindByIdContaApi = () =>
  new BaseFindById<Conta, number>(API_URL);
export const useFindPageContaApi = () => new BaseFindPage<Conta>(API_URL);
export const useFindContaByNumeroAndAgencia = () =>
  new BaseFindByNumerAndAgencia<Conta>(API_URL);
