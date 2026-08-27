import { PrioridadeTiposEnum } from "../enum/PrioridadeEnum";

export interface CreateAtendimentoDTO {
  tenantId: string;
  transcricao?: string;
  duracaoSegundos?: number;
  prioridade?: PrioridadeTiposEnum;
}