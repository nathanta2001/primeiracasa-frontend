import { Card, Space, Typography, Popconfirm, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { StatusTag } from './StatusTag';
import { type ItemCasa } from '../types/ItemCasa';

const { Text } = Typography;

interface ItemCardProps {
  item?: ItemCasa;
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ItemCard = ({ item, loading, onEdit, onDelete }: ItemCardProps) => {
  return (
    <Card
      loading={loading} // o ant design já mostra um skeleton se loading for true
      actions={!loading ? [
        <EditOutlined key="edit" onClick={() => onEdit?.(item!.id)} />,
        <Popconfirm title="Remover item?" onConfirm={() => onDelete?.(item!.id)}>
          <DeleteOutlined key="delete" style={{ color: 'red' }} />
        </Popconfirm>
      ] : []}
    >
      {item && (
        <>
          <Space wrap style={{ marginBottom: 8 }}>
            <StatusTag type="tipo" value={item.tipo} />
            <StatusTag type="necessidade" value={item.necessidade} />
          </Space>
          <Card.Meta
            title={item.nome}
            description={
              <Space direction="vertical" size={0}>
                <Text type="secondary">{item.comodo}</Text>
                <Text strong>R$ {item.preco.toFixed(2)}</Text>
              </Space>
            }
          />
        </>
      )}
    </Card>
  );
};