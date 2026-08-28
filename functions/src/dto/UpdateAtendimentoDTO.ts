import { StatusEnum } from "../enum/StatusEnum";

export interface UpdateAtendimentoDTO {
  atendimentoId: string;
  tenantId?: string;
  novoStatus?: StatusEnum;
}