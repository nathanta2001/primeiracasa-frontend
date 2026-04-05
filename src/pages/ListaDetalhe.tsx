import { useEffect, useState } from 'react';
import {
    Card, Button, Typography, Spin, Space,
    Popconfirm, message, Empty, Tag, List,
    Modal, Form, Input, Select,
    Row,
    Col
} from 'antd';
import { ArrowLeftOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { listaService } from '../services/listaService';
import { produtoService } from '../services/produtoService';
import { type Lista } from '../types/Lista';
import { type Produto, type ProdutoRequest } from '../types/Produto';
import { CATEGORIA_PRODUTO, STATUS_PRODUTO } from '../types/Produto';

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
            // Omit<ProdutoRequest, 'idLista'> significa ProdutoRequest sem o campo idLista
            // adicionamos o idLista aqui pois já sabemos qual é
            await produtoService.criar({ ...values, idLista: id! });
            message.success('Produto adicionado!');
            form.resetFields();
            setModalAberto(false);
            carregarDados();
        } catch (error) {
            message.error('Erro ao adicionar produto');
        } finally {
            setLoadingSalvar(false);
        }
    };

    const handleDeletar = async (produtoId: string) => {
        try {
            await produtoService.deletar(produtoId);
            message.success('Produto removido!');
            carregarDados();
        } catch (error) {
            message.error('Erro ao remover produto');
        }
    };


    // // precisa de um botão pra isso aq tbm
    // const handleUploadFoto = async (arquivo: File) => {
    //     if (!arquivo) return;
        
    //     // Convertendo para Base64 para salvar no banco
    //     const reader = new FileReader();
    //     reader.readAsDataURL(arquivo);
    //     reader.onload = () => {
    //         const base64 = reader.result;
    //         //produtoService.salvarFoto(id!, base64 as string);
    //         console.log("Foto pronta para o Java:", base64);
    //     };
    //     };

    const corStatus = (status: string) => {
        const cores: Record<string, string> = {
            'DISPONIVEL': 'green',
            'ESGOTADO': 'red',
            'COMPRADO': 'blue'
        };
        return cores[status] ?? 'default';
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
            {produtos.length === 0 ? (
                <Empty description="Nenhum produto nesta lista">
                    <Button type="primary" onClick={() => setModalAberto(true)}>
                        Adicionar primeiro produto
                    </Button>
                </Empty>
            ) : (
                <Card>
                    <List
                        dataSource={produtos}
                        renderItem={(produto) => (
                            <List.Item
                                actions={[
                                    <Popconfirm
                                        key="deletar"
                                        title="Remover produto?"
                                        onConfirm={() => handleDeletar(produto.id)}
                                        okText="Sim"
                                        cancelText="Não"
                                    >
                                        <Button
                                            danger
                                            icon={<DeleteOutlined />}
                                            size="small"
                                        />
                                    </Popconfirm>
                                ]}
                            >
                                <List.Item.Meta
                                    title={
                                        <Space>
                                            {produto.nome}
                                            <Tag color={corStatus(produto.status)}>
                                                {produto.status}
                                            </Tag>
                                        </Space>
                                    }
                                    description={produto.categoria}
                                />
                            </List.Item>
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

                    <Form.Item name="descricao" label="Descrição (opcional)">
                        <Input.TextArea rows={2} />
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
                </Form>
            </Modal>
        </div>
    );
};

export default ListaDetalhe;