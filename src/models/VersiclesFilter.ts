import { Filter } from "../util/filter";

export interface VersiclesFilter extends Filter {

    versao: string;
    livro : string;
    capitulo: number;
    versiculo: number;
    versiculos: [number, number];

}