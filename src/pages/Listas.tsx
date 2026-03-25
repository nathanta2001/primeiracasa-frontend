import { Button, Card, Col, Empty, Form, Input, message, Modal, Popconfirm, Row, Space, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { Lista, ListaRequest } from "../types/Lista";
import { listaService } from "../services/listaService";
import { DeleteOutlined, EditOutlined, PlusOutlined, UnorderedListOutlined } from "@ant-design/icons";



const { Title, Text } = Typography;

const Listas = () => {

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const [listas, setListas] = useState<Lista[]>([]);

    const [loading, setLoading] = useState(false);
    const [loadingSalvar, setLoadingSalvar] = useState(false);

    const [modalAberto, setModalAberto] = useState(false);
    const[listaSelecionada, setListaSelecionada] = useState<Lista | null>(null);

    useEffect(() => {
        carregarListas();
    }, []);

    const carregarListas = async () => {
        try {

            setLoading(true);
            const data = await listaService.listarTodos();
            setListas(data);

        } catch (error) {
            message.error("Erro ao carregar listas:");
        } finally {
            setLoading(false);
        }
    };

    const abrirModalCriacao = () => {
        setListaSelecionada(null);
        form.resetFields();
        setModalAberto(true);
    };

    const abrirModalEdicao = (lista: Lista) => {
        setListaSelecionada(lista);
        form.setFieldsValue({
            nome: lista.nome,
        });
        setModalAberto(true);
    };

    const fecharModal = () => {
        setModalAberto(false);
        setListaSelecionada(null);
        form.resetFields();
    };

    const onFinish = async (values: ListaRequest) => {
        try {
            setLoadingSalvar(true);

            if (listaSelecionada) {
                await listaService.atualizar(listaSelecionada.id, values);
                message.success('Lista atualizada!');
            } else {
                await listaService.criar(values);
                message.success('Lista criada!');
            }

            fecharModal();
            carregarListas();
        } catch (error) {
            message.error('Erro ao salvar lista');
        } finally {
            setLoadingSalvar(false);
        }
    };

    const handleDeletar = async (id: string) => {
        try {
            await listaService.deletar(id);
            message.success('Lista deletada!');
            carregarListas();
        } catch (error) {
            message.error('Erro ao remover lista');
        } finally {
            setLoading(false);
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
        <div>
            {/* Cabeçalho */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        Listas de Compras
                    </Title>
                </Col>
                <Col>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={abrirModalCriacao}
                    >
                        Nova Lista
                    </Button>
                </Col>
            </Row>

            {listas.length === 0 ? (
                <Empty description="Nenhuma lista criada ainda">
                    <Button type="primary" onClick={abrirModalCriacao}>
                        Criar primeira lista
                    </Button>
                </Empty>
            ) : (
                <Row gutter={[16, 16]}>
                    {listas.map(lista => (
                        <Col key={lista.id} xs={24} sm={12} md={8}>
                            <Card
                                // adiciona efeito de elevação ao passar o mouse
                                hoverable
                                actions={[
                                    <EditOutlined
                                        key="editar"
                                        onClick={() => abrirModalEdicao(lista)}
                                    />,
                                    // Navega para o detalhe da lista ao clicar
                                    <UnorderedListOutlined
                                        key="ver"
                                        onClick={() => navigate(`/listas/${lista.id}`)}
                                    />,
                                    <Popconfirm
                                        key="deletar"
                                        title="Remover lista?"
                                        description="Todos os produtos serão removidos."
                                        onConfirm={() => handleDeletar(lista.id)}
                                        okText="Sim"
                                        cancelText="Não"
                                    >
                                        <DeleteOutlined style={{ color: 'red' }} />
                                    </Popconfirm>
                                ]}
                            >
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            <Modal
                title={listaSelecionada ? 'Editar Lista' : 'Nova Lista'}
                open={modalAberto}
                onCancel={fecharModal}
                footer={null}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    style={{ marginTop: 16 }}
                >
                    <Form.Item
                        name="nome"
                        label="Nome da lista"
                        rules={[{ required: true, message: 'Informe o nome da lista' }]}
                    >
                        <Input placeholder="Ex: Compras da semana" />
                    </Form.Item>

                    <Form.Item
                        name="descricao"
                        label="Descrição (opcional)"
                    >
                        <Input.TextArea
                            rows={3}
                            placeholder="Ex: Compras mensais do mercado..."
                        />
                    </Form.Item>

                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loadingSalvar}
                            >
                                {listaSelecionada ? 'Salvar alterações' : 'Criar lista'}
                            </Button>
                            <Button onClick={fecharModal}>
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
};

export default Listas;