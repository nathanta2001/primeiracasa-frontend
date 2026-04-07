import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Button, Typography, message } from 'antd';
import { ShoppingOutlined, HomeOutlined, UnorderedListOutlined, RightOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { itemCasaService } from '../services/itemCasaService';
import { type ItemCasa } from '../types/ItemCasa';
import { ItemCard } from '../components/ItemCard';

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

    const handleDeletar = async (id: string) => {
        try {
            await itemCasaService.deletar(id);

            // Ativa a vibração (conforme o checklist)
            if ("vibrate" in navigator) {
                navigator.vibrate(200);
            }

            message.success("Item removido com sucesso!");
            carregarItens(); // Recarrega a lista após deletar
        } catch (error) {
            message.error("Erro ao remover item.");
        }
    };

    // 4 itens mais recentes para o layout 
    const ultimosItens = itens.slice(-4).reverse();

    const handleEditarItem = (id: string) => {
        // Navega para a página de itens passando o ID no state para abrir o modal de edição
        navigate('/itens', { state: { openEditModalId: id } });
    };

    return (
        <div>
            <Title level={2}>
                <HomeOutlined /> Minha Primeira Casa
            </Title>

            {/* Dashboard de Estatísticas */}
            <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={8}>
                    <Card>
                        <Statistic
                            title="Total de Itens"
                            value={itens.length}
                            prefix={<ShoppingOutlined />}
                        />
                    </Card>
                </Col>
            </Row>

            {/* Atalhos Rápidos */}
            <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
                <Col xs={24} sm={12}>
                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={<ShoppingOutlined />}
                        onClick={() => navigate('/itens')}
                    >
                        Gerenciar Minha Casa
                    </Button>
                </Col>
                <Col xs={24} sm={12}>
                    <Button
                        size="large"
                        block
                        icon={<UnorderedListOutlined />}
                        onClick={() => navigate('/listas')}
                    >
                        Listas de Compras
                    </Button>
                </Col>
            </Row>

            {/* Seção de Últimos Itens com ItemCard */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={4} style={{ margin: 0 }}>Últimos Itens Cadastrados</Title>
                {itens.length > 0 && (
                    <Button type="link" onClick={() => navigate('/itens')} icon={<RightOutlined />}>
                        Ver todos
                    </Button>
                )}
            </div>

            {loading ? (
                <Row gutter={[16, 16]}>
                    {[1, 2, 3, 4].map(i => (
                        <Col key={i} xs={24} sm={12} md={6}>
                            <ItemCard loading={true} />
                        </Col>
                    ))}
                </Row>
            ) : itens.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">Nenhum item cadastrado ainda.</Text>
                    <br />
                    <Button type="primary" style={{ marginTop: 16 }} onClick={() => navigate('/itens')}>
                        Começar agora
                    </Button>
                </Card>
            ) : (
                <Row gutter={[16, 16]}>
                    {ultimosItens.map(item => (
                        <Col key={item.id} xs={24} sm={12} md={6}>
                            <ItemCard
                                item={item}
                                onEdit={() => handleEditarItem(item.id)}
                                onDelete={handleDeletar}
                            />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};

export default Home;