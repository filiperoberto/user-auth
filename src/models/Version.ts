export interface Version {

    id: number;
    version_number: number;
    citacoes: string;
    descricao: string;
    sinonimos: string;
    created: string;
    modified: string;
    aprovada: boolean;
    id_pessoa: number;
    idade_morte: number;
    idade_pai_nascimento : number;
    idade_mae_nascimento : number;
    sexo : boolean;
    linhagem_de_jesus : boolean;
    nome : string;
    rei: boolean;
    profeta: boolean;
    sacerdote: boolean;
    juiz: boolean;
    pai: number;
    mae: number;
    user_id: number;
    conjuges?: number[];
}