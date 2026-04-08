import { Card, List, Space, Image, Button, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, ShoppingOutlined } from '@ant-design/icons';
import { StatusTag } from './StatusTag';
import { type Produto } from '../types/Produto';
import { normalizeImageSrc } from '../utils/imageUtils';

interface ProdutoCardProps {
  produto?: Produto;
  loading?: boolean;
  onEdit?: (produto: Produto) => void;
  onDelete?: (id: string) => void;
}

export const ProdutoCard = ({ produto, loading, onEdit, onDelete }: ProdutoCardProps) => {
  const imageSrc = normalizeImageSrc(produto?.fotoBase64);

  return (
    <List.Item
      actions={!loading ? [
        <Button type="text" icon={<EditOutlined />} onClick={() => onEdit?.(produto!)} />,
        <Popconfirm title="Remover?" onConfirm={() => onDelete?.(produto!.id)}>
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ] : []}
    >
      {loading ? (
        <Card loading={true} style={{ width: '100%' }} />
      ) : (
        <List.Item.Meta
          avatar={
            imageSrc ? (
              <Image src={imageSrc} width={50} height={50} style={{ borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <div style={{ width: 50, height: 50, backgroundColor: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingOutlined style={{ color: '#ccc' }} />
              </div>
            )
          }
          title={
            <Space>
              {produto?.nome}
              <StatusTag type="status" value={produto!.status} />
            </Space>
          }
          description={produto?.categoria}
        />
      )}
    </List.Item>
  );
};
