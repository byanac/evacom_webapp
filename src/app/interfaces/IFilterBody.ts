import { IEvaluationGroupFilter } from "./IEvaluationGroupFilter";

export interface IFilterBody extends IEvaluationGroupFilter{
    estado: boolean;
    todos: boolean;
}