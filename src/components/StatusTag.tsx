import { Tag } from 'antd';

interface StatusTagProps {
  type: 'necessidade' | 'tipo' | 'status';
  value: string;
}

export const StatusTag = ({ type, value }: StatusTagProps) => {
  const colorMap: Record<string, string> = {
    // Necessidades
    ESSENCIAL: "red", DESEJAVEL: "yellow", OPCIONAL: "blue",
    // Tipos
    MOBILIA: "brown", UTENSILIO: "blue", ELETRODOMESTICO: "gray", ELETRONICO: "orange",
    // Status Produto
    EM_ESTOQUE: "green", ACABANDO: "orange", ESGOTADO: "red"
  };

  return <Tag color={colorMap[value] || "default"}>{value}</Tag>;
};