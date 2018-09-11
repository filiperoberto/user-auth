import { Filter } from "../util/filter";

export interface PostFilter extends Filter {
    tag : number;
    user: number;
    mostrarOcultos: boolean;
}