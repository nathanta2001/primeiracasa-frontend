export interface Produto {
    id: string;
    nome: string;
    preco: number;
    categoria: CategoriaProduto;
    StatusProduto: StatusProduto;
}

export interface ProdutoRequest {
    nome: string;
    preco: number;
    categoria: CategoriaProduto;
    StatusProduto: StatusProduto;
    idLista: string;
}

export type CategoriaProduto = 
    | "MERCEARIA"
    | "HORTIFRUTI"
    | "ACOUGUE"
    | "LATICINIOS"
    | "PADARIA"
    | "BEBIDAS"
    | "HIGIENE"
    | "LIMPEZA"
    | "PET_SHOP"
    | "CONGELADOS"
    | "GRAOS_E_CEREAIS"
    | "UTILITARIOS"
    | "OUTROS"

export type StatusProduto = 
    | "EM_ESTOQUE"
    | "ACABANDO"
    | "ESGOTADO"
