import { Card, Space, Typography, Popconfirm, Image } from 'antd';
import { EditOutlined, DeleteOutlined, HomeOutlined } from '@ant-design/icons';
import { StatusTag } from './StatusTag';
import { type ItemCasa } from '../types/ItemCasa';
import { normalizeImageSrc } from '../utils/imageUtils';

const { Text } = Typography;

interface ItemCardProps {
  item?: ItemCasa;
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ItemCard = ({ item, loading, onEdit, onDelete }: ItemCardProps) => {
  const imageSrc = normalizeImageSrc(item?.fotoBase64);

  return (
    <Card
      loading={loading}
      cover={
        !loading && (
          <div style={{ height: 150, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5' }}>
            {imageSrc ? (
              <Image 
                src={imageSrc} 
                alt={item?.nome ?? 'Imagem do item'} 
                style={{ height: 150, objectFit: 'cover', width: '100%' }} 
              />
            ) : (
              <HomeOutlined style={{ fontSize: 40, color: '#ccc' }} />
            )}
          </div>
        )
      }
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
              <Space orientation="vertical" size={0}>
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
