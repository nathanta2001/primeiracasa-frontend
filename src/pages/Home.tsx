import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, List, Tag, Typography, Spin } from 'antd';
import { ShoppingOutlined, HomeOutlined, CheckCircleOutlined, DollarOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { itemCasaService } from '../services/itemCasaService';
import { type ItemCasa } from '../types/ItemCasa';

const { Title, Text } = Typography;

const Home = () => {
    const [itens, setItens] = useState<ItemCasa[]>([]);
    
    const [loading, setLoading] = useState(true);
    
    const navigate = useNavigate();

    useEffect(() => {
        carregarItens();
    }, []);

    const carregarItens = async () => {
        try {
            setLoading(true);
            const data = await itemCasaService.listarTodos();
            setItens(data);
        } catch (error) {
            console.error('Erro ao carregar itens:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const ultimosItens = itens.slice(0, 5);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div>
            <Title level={2}>
                <HomeOutlined /> Minha Primeira Casa
            </Title>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>

                <Col xs={24} sm={12} md={8}>
                    <Card>
                        <Statistic
                            title="Total de Itens"
                            value={itens.length}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12}>
                    <Button
                        type="primary"
                        size="large"
                        block // ocupa 100% da largura
                        icon={<ShoppingOutlined />}
                        onClick={() => navigate('/itens/novo')}
                    >
                        Adicionar Item
                    </Button>
                </Col>
                <Col xs={24} sm={12}>
                    <Button
                        size="large"
                        block
                        icon={<UnorderedListOutlined />}
                        onClick={() => navigate('/listas')}
                    >
                        Ver Listas de Compras
                    </Button>
                </Col>
            </Row>

            <Card title="Últimos Itens Cadastrados">
                {itens.length === 0 ? (
                    <Text type="secondary">
                        Nenhum item cadastrado ainda. Comece adicionando um!
                    </Text>
                ) : (
                    <List
                        dataSource={ultimosItens}
                        renderItem={(item) => (
                            <List.Item
                                actions={[
                                    <Button
                                        type="link"
                                        onClick={() => navigate(`/itens/${item.id}`)}
                                    >
                                        Ver
                                    </Button>
                                ]}
                            >
                                <List.Item.Meta
                                    title={item.nome}
                                    description={
                                        <>
                                            <Tag>{item.comodo}</Tag>
                                            <Text strong>
                                                R$ {item.preco.toFixed(2)}
                                            </Text>
                                        </>
                                    }
                                />
                            </List.Item>
                        )}
                    />
                )}
                {itens.length > 0 && (
                    <Button
                        type="link"
                        onClick={() => navigate('/itens')}
                        style={{ marginTop: 8 }}
                    >
                        Ver todos os itens →
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default Home;