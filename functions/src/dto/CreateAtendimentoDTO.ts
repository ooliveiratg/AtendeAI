import { PrioridadeTiposEnum } from "../enum/PrioridadeEnum";

export interface createAtendimentoDTO{
    tenantId: string; 
    transcricao: string;
    duracaoSegundos: number;
    prioridade: string;
}