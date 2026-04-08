import { useEffect, useState } from "react";
import {
    Card, Row, Col, Button, Typography, Select,
    Input, message, Empty,
    Form, Modal, InputNumber, Space
} from "antd";
import { useLocation } from 'react-router-dom';
import { itemCasaService } from '../services/itemCasaService';
import type { ItemCasa, ItemCasaFiltros } from "../types/ItemCasa";
import { TIPOS_ITEM, COMODOS_ITEM, NECESSIDADES_ITEM } from "../types/ItemCasa";
import { PageHeader } from "../components/PageHeader";
import { ItemCard } from "../components/ItemCard";
import { FilterOutlined } from "@ant-design/icons";
import { ImageCapture } from '../components/ImageCapture';
import { compressImage } from "../utils/imageUtils";




const { Text } = Typography;

const { Option } = Select;

const ItensCasa = () => {

    const [form] = Form.useForm();

    const [itensCasa, setItensCasa] = useState<ItemCasa[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState<ItemCasaFiltros>({});

    const [mostrarFiltros, setMostrarFiltros] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [itemSelecionado, setItemSelecionado] = useState<ItemCasa | null>(null);

    useEffect(() => {
        carregarItensCasa();
    }, [filtros]);

    const location = useLocation();

    useEffect(() => {
        if (location.state?.openEditModalId && itensCasa.length > 0) {
            abrirModal(location.state.openEditModalId);
            window.history.replaceState({}, document.title);
        }
    }, [location.state, itensCasa]);

    const carregarItensCasa = async () => {

        try {
            setLoading(true);

            const temFiltro = Object.values(filtros).some(Boolean);

            const data = temFiltro
                ? await itemCasaService.filtrar(filtros)
                : await itemCasaService.listarTodos();

            setItensCasa(data);

        } catch (error) {
            message.error("Erro ao carregar itens.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeletar = async (id: string) => {
        try {
            await itemCasaService.deletar(id);

            // vibra por 200ms
            if ("vibrate" in navigator) {
                navigator.vibrate(200);
            }

            message.success("Item removido.");
            carregarItensCasa();
        } catch (error) {
            message.error("Erro ao excluir item.");
        }
    };

    const handleFiltro = (campo: keyof ItemCasaFiltros, valor: any) => {
        setFiltros(prev => ({
            ...prev,
            [campo]: valor || undefined
        }));
    }

    const limparFiltros = () => {
        setFiltros({});
    }

    const abrirModal = (id?: string) => {
        if (id) {
            const item = itensCasa.find(i => i.id === id);
            setItemSelecionado(item || null);
            form.setFieldsValue(item);
        } else {
            setItemSelecionado(null);
            form.resetFields();
        }
        setModalAberto(true);
    };

    const onFinish = async (values: any) => {
        try {
            setLoading(true);

            // Garante que a foto saia do estado do Form para o payload
            const fotoDoForm = form.getFieldValue('fotoBase64');

            let fotoParaEnviar = fotoDoForm || values.fotoBase64;

            // Compressão para evitar lentidão e erros de payload grande
            if (fotoParaEnviar && fotoParaEnviar.startsWith('data:image')) {
                fotoParaEnviar = await compressImage(fotoParaEnviar, 600);
            }

            const payload = {
                ...values,
                fotoBase64: fotoParaEnviar
            };

            if (itemSelecionado) {
                await itemCasaService.atualizar(itemSelecionado.id, payload);
                message.success("Atualizado com sucesso!");
            } else {
                await itemCasaService.criar(payload);
                message.success("Criado com sucesso!");
            }

            // Limpeza completa após sucesso
            setModalAberto(false);
            form.resetFields(); // Limpa inclusive o campo invisível da foto
            carregarItensCasa();
        } catch (error) {
            message.error("Erro ao salvar.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div>
            <PageHeader
                title="Minha Casa"
                buttonText="Novo Item"
                extra={
                    <Space>
                        <Button
                            icon={<FilterOutlined />}
                            onClick={() => setMostrarFiltros(!mostrarFiltros)}
                            type={mostrarFiltros ? 'primary' : 'default'}
                        >
                            Filtros
                        </Button>
                        <Button
                            type="primary"
                            onClick={() => abrirModal()}
                        >
                            Novo Item
                        </Button>
                    </Space>
                }
            />

            {mostrarFiltros && (
                <Card style={{ marginBottom: 16 }}>
                    <Row gutter={[16, 16]}>

                        {/* Filtro por nome */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Nome</Text>
                            <Input
                                placeholder="Buscar por nome..."
                                value={filtros.nome}
                                onChange={e => handleFiltro('nome', e.target.value || undefined)}
                                style={{ marginTop: 4 }}
                            />
                        </Col>

                        {/* Filtro por cômodo */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Cômodo</Text>
                            <Select
                                placeholder="Selecione..."
                                value={filtros.comodo}
                                allowClear
                                style={{ width: '100%', marginTop: 4 }}
                                onChange={val => handleFiltro('comodo', val)}
                            >
                                {COMODOS_ITEM.map(comodo => (
                                    <Option key={comodo} value={comodo}>
                                        {comodo}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        {/* Filtro por tipo */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Tipo</Text>
                            <Select
                                placeholder="Selecione..."
                                value={filtros.tipo}
                                allowClear
                                style={{ width: '100%', marginTop: 4 }}
                                onChange={val => handleFiltro('tipo', val)}
                            >
                                {TIPOS_ITEM.map(tipo => (
                                    <Option key={tipo} value={tipo}>
                                        {tipo}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        {/* Filtro por necessidade */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Necessidade</Text>
                            <Select
                                placeholder="Selecione..."
                                value={filtros.necessidade}
                                allowClear
                                style={{ width: '100%', marginTop: 4 }}
                                onChange={val => handleFiltro('necessidade', val)}
                            >
                                {NECESSIDADES_ITEM.map(nec => (
                                    <Option key={nec} value={nec}>
                                        {nec}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        {/* Filtro por faixa de preço */}
                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Preço mínimo</Text>
                            <Input
                                type="number"
                                placeholder="R$ 0,00"
                                value={filtros.precoMin}
                                onChange={e => handleFiltro('precoMin', e.target.value ? Number(e.target.value) : undefined)}
                                style={{ marginTop: 4 }}
                            />
                        </Col>

                        <Col xs={24} sm={12} md={6}>
                            <Text strong>Preço máximo</Text>
                            <Input
                                type="number"
                                placeholder="R$ 0,00"
                                value={filtros.precoMax}
                                onChange={e => handleFiltro('precoMax', e.target.value ? Number(e.target.value) : undefined)}
                                style={{ marginTop: 4 }}
                            />
                        </Col>

                        {/* Botão de limpar filtros */}
                        <Col xs={24}>
                            <Button onClick={limparFiltros}>
                                Limpar filtros
                            </Button>
                        </Col>
                    </Row>
                </Card>
            )}

            {/* Exibe quantidade de resultados */}
            <Text type="secondary" style={{ display: 'block', marginBottom: 16 }}>
                {itensCasa.length} {itensCasa.length === 1 ? 'item encontrado' : 'itens encontrados'}
            </Text>


            {/* Spinner de loading */}
            {/* Listagem de Itens */}
            {loading ? (
                <Row gutter={[16, 16]}>
                    {[1, 2, 3, 4].map(i => (
                        <Col key={i} xs={24} sm={12} md={8} lg={6}>
                            <ItemCard loading={true} />
                        </Col>
                    ))}
                </Row>
            ) : itensCasa.length === 0 ? (
                <Empty description="Nenhum item encontrado" />
            ) : (
                <Row gutter={[16, 16]}>
                    {itensCasa.map(item => (
                        <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                            <ItemCard
                                item={item}
                                onEdit={(id) => abrirModal(id)} // Agora abre o modal em vez de navegar
                                onDelete={handleDeletar}
                            />
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal de Cadastro/Edição */}
            <Modal
                title={itemSelecionado ? "Editar Item" : "Novo Item"}
                open={modalAberto}
                onCancel={() => setModalAberto(false)}
                footer={null}
                destroyOnHidden
            >
                <Form form={form} layout="vertical" onFinish={onFinish}>
                    <Form.Item name="nome" label="Nome" rules={[{ required: true, message: 'Informe o nome' }]}>
                        <Input />
                    </Form.Item>

                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="preco" label="Preço" rules={[{ required: true, message: 'Informe o preço' }]}>
                                <InputNumber style={{ width: '100%' }} prefix="R$" min={0.01} />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item name="tipo" label="Tipo" rules={[{ required: true }]}>
                                <Select>
                                    {TIPOS_ITEM.map(t => <Option key={t} value={t}>{t}</Option>)}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item name="comodo" label="Cômodo" rules={[{ required: true }]}>
                        <Select>
                            {COMODOS_ITEM.map(c => <Option key={c} value={c}>{c}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="necessidade" label="Necessidade" rules={[{ required: true }]}>
                        <Select>
                            {NECESSIDADES_ITEM.map(n => <Option key={n} value={n}>{n}</Option>)}
                        </Select>
                    </Form.Item>

                    <Form.Item name="fotoBase64" label="Foto do Item">
                        <ImageCapture
                            value={form.getFieldValue('fotoBase64')}
                            onChange={(val) => form.setFieldsValue({ fotoBase64: val })}
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" block loading={loading}>
                            Salvar
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}


export default ItensCasa;