import { useEffect, useState } from 'react';
import {
    Card, Button, Typography, Spin, Space,
    message, Empty, List,
    Modal, Form, Input, Select,
    Row,
    Col,
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, ShareAltOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { listaService } from '../services/listaService';
import { produtoService } from '../services/produtoService';
import { type Lista } from '../types/Lista';
import { type Produto, type ProdutoRequest } from '../types/Produto';
import { CATEGORIA_PRODUTO, STATUS_PRODUTO } from '../types/Produto';
import { ImageCapture } from '../components/ImageCapture';
import { ProdutoCard } from '../components/ProdutoCard';
import { compressImage } from '../utils/imageUtils';


const { Title, Text } = Typography;
const { Option } = Select;

const ListaDetalhe = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [lista, setLista] = useState<Lista | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingSalvar, setLoadingSalvar] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);

    useEffect(() => {
        carregarDados();
    }, [id]);

    const carregarDados = async () => {
        try {
            setLoading(true);

            // Busca a lista e os produtos em paralelo com Promise.all
            // Promise.all espera as duas requisições terminarem ao mesmo tempo
            // mais eficiente do que fazer uma por vez
            const [listaData, produtosData] = await Promise.all([
                listaService.buscarPorId(id!),
                produtoService.listarTodos()
            ]);

            setLista(listaData);
            // Filtra só os produtos desta lista
            setProdutos(produtosData.filter(p => p.idLista === id));
        } catch (error) {
            message.error('Erro ao carregar dados');
            navigate('/listas');
        } finally {
            setLoading(false);
        }
    };


    const onFinish = async (values: Omit<ProdutoRequest, 'idLista'>) => {
        try {
            setLoadingSalvar(true);

            const fotoFinal = form.getFieldValue('fotoBase64') || values.fotoBase64;
            let fotoProcessada = values.fotoBase64;

            if (fotoProcessada && fotoProcessada.startsWith('data:image')) {
                fotoProcessada = await compressImage(fotoProcessada, 600); // Reduz para 600px de largura
            }
            const payload = { ...values, idLista: id!, fotoBase64: fotoFinal };

            if (produtoSelecionado) {
                await produtoService.atualizar(produtoSelecionado.id, payload);
                message.success('Produto atualizado!');
            } else {
                await produtoService.criar(payload);
                message.success('Produto adicionado!');

                // Notificação apenas na criação para não spammar o usuário
                if (Notification.permission === 'granted') {
                    navigator.serviceWorker.ready.then((registration) => {
                        registration.showNotification("🛒 Novo Item", {
                            body: `${values.nome} foi adicionado à lista.`,
                            icon: '/icon-192x192.png',
                            vibrate: [200, 100, 200],
                            tag: 'novo-produto'
                        } as any);
                    });
                }
            }

            form.resetFields();
            setProdutoSelecionado(null);
            setModalAberto(false);
            carregarDados();
        } catch (error) {
            message.error('Erro ao salvar produto');
        } finally {
            setLoadingSalvar(false);
        }
    };
    const handleDeletar = async (produtoId: string) => {
        try {
            await produtoService.deletar(produtoId);

            // vibra por 200ms
            if ("vibrate" in navigator) {
                navigator.vibrate(200);
            }

            message.success('Produto removido!');
            carregarDados();
        } catch (error) {
            message.error('Erro ao remover produto');
        }
    };

    const abrirModalEdicao = (produto: Produto) => {
        setProdutoSelecionado(produto);
        form.setFieldsValue({
            nome: produto.nome,
            categoria: produto.categoria,
            status: produto.status,
            fotoBase64: produto.fotoBase64
        });
        setModalAberto(true);
    };


    const handleCompartilhar = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Lista de Compras: ${lista?.nome}`,
                    text: `Confira os itens da lista ${lista?.nome} no meu app Minha Primeira Casa!`,
                    url: window.location.href,
                });
            } catch (error) {
                console.log('Erro ao compartilhar', error);
            }
        } else {
            message.info("Compartilhamento não suportado neste navegador.");
        }
    };


    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div style={{ maxWidth: 800, margin: '0 auto' }}>

            {/* Cabeçalho */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Space>
                        <Button
                            icon={<ArrowLeftOutlined />}
                            onClick={() => navigate('/listas')}
                        />
                        <Title level={2} style={{ margin: 0 }}>
                            {lista?.nome}
                        </Title>
                        <Button
                            icon={<ShareAltOutlined />}
                            onClick={handleCompartilhar}
                            type="text"
                        />
                    </Space>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setModalAberto(true)}
                    >
                        Adicionar Produto
                    </Button>
                </Col>
            </Row>

            {/* Resumo rápido */}
            <Card style={{ marginBottom: 16 }}>
                <Space size="large">
                    <Text>Total: <Text strong>{produtos.length} produtos</Text></Text>
                    <Text>
                        Comprados: <Text strong style={{ color: 'green' }}>
                            {produtos.filter(p => p.status === 'EM_ESTOQUE').length}
                        </Text>
                    </Text>
                    <Text>
                        Pendentes: <Text strong style={{ color: 'orange' }}>
                            {produtos.filter(p => p.status !== 'EM_ESTOQUE').length}
                        </Text>
                    </Text>
                </Space>
            </Card>

            {/* Lista de produtos */}
            {produtos.length === 0 && !loading ? (
                <Empty description="Nenhum produto nesta lista">
                    <Button type="primary" onClick={() => setModalAberto(true)}>
                        Adicionar primeiro produto
                    </Button>
                </Empty>
            ) : (
                <Card>
                    <List
                        dataSource={loading ? ([{}, {}, {}] as Produto[]) : produtos}
                        renderItem={(produto) => (
                            <ProdutoCard
                                produto={loading ? undefined : produto as Produto}
                                loading={loading}
                                onEdit={abrirModalEdicao}
                                onDelete={handleDeletar}
                            />
                        )}
                    />
                </Card>
            )}

            {/* Modal de adicionar produto */}
            <Modal
                title="Adicionar Produto"
                open={modalAberto}
                onCancel={() => {
                    setModalAberto(false);
                    form.resetFields();
                }}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ marginTop: 16 }}
                    initialValues={{ status: 'ACABANDO' }}
                >
                    <Form.Item
                        name="nome"
                        label="Nome do produto"
                        rules={[{ required: true, message: 'Informe o nome' }]}
                    >
                        <Input placeholder="Ex: Arroz Tio João 5kg" />
                    </Form.Item>

                    <Form.Item
                        name="categoria"
                        label="Categoria"
                        rules={[{ required: true, message: 'Selecione a categoria' }]}
                    >
                        <Select placeholder="Selecione a categoria">
                            {Object.values(CATEGORIA_PRODUTO).map(cat => (
                                <Option key={cat} value={cat}>{cat}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item name="status" label="Status">
                        <Select>
                            {Object.values(STATUS_PRODUTO).map(s => (
                                <Option key={s} value={s}>{s}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loadingSalvar}
                            >
                                Adicionar
                            </Button>
                            <Button onClick={() => {
                                setModalAberto(false);
                                form.resetFields();
                            }}>
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>

                    <Form.Item
                        noStyle 
                        shouldUpdate={(prevValues, currentValues) => prevValues.fotoBase64 !== currentValues.fotoBase64}
                    >
                        {({ getFieldValue }) => (
                            <Form.Item
                                name="fotoBase64"
                                label="Foto do Produto"
                            >
                                <ImageCapture
                                    value={getFieldValue('fotoBase64')}
                                    onChange={(val) => form.setFieldsValue({ fotoBase64: val })}
                                />
                            </Form.Item>
                        )}
                    </Form.Item>

                </Form>

            </Modal>
        </div>
    );
};

export default ListaDetalhe;