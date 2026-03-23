export interface ItemCasa {
    id: string;
    nome: string;
    preco: number;
    tipo: TipoItem;
    necessidade: NecessidadeItem;
    comodo: ComodoItem;
}

export interface ItemCasaRequest {
    nome: string;
    preco: number;
    tipo: TipoItem;
    necessidade: NecessidadeItem;
    comodo: ComodoItem;
}

export interface ItemCasaFiltros {
    nome?: string;
    tipo?: TipoItem;
    necessidade?: NecessidadeItem;
    comodo?: ComodoItem;
    precoMin?: number;
    precoMax?: number;
}

export type TipoItem = 
    | 'MOBILIA' 
    | 'UTENSILIO' 
    | 'ELETRODOMESTICO' 
    | 'ELETRONICO';

export type NecessidadeItem = 
    | 'ESSENCIAL' 
    | 'DESEJAVEL' 
    | 'OPCIONAL';

export type ComodoItem = 
    | 'COZINHA'
    | 'QUARTO'
    | 'SALA'
    | 'BANHEIRO'
    | 'AREA_DE_SERVICO'
    | 'COPA'
    | 'QUINTAL'
    | 'JARDIM'
    | 'GARAGEM'
    | 'OUTROS';
