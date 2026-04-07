// src/components/PageHeader.tsx
import { Row, Col, Typography, Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

interface PageHeaderProps {
  title: string;
  buttonText?: string;
  buttonRoute?: string;
  extra?: React.ReactNode; 
}

export const PageHeader = ({ title, buttonText, buttonRoute, extra }: PageHeaderProps) => {
  const navigate = useNavigate();
  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
      <Col>
        <Title level={2} style={{ margin: 0 }}>{title}</Title>
      </Col>
      <Col>
        <Space>
          {extra} {/* Aqui aparecerá o botão de filtros */}
          {buttonText && buttonRoute && (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate(buttonRoute)}>
              {buttonText}
            </Button>
          )}
        </Space>
      </Col>
    </Row>
  );
};