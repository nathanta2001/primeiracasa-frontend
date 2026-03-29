import { useEffect, useState } from "react";
import {
    Card, Row, Col, Button, Tag, Typography, Spin, Select,
    Input, Space, Popconfirm, message, Empty
} from "antd";
import { 
    DeleteOutlined, EditOutlined, PlusOutlined, 
    FilterOutlined 
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { itemCasaService } from '../services/itemCasaService';
import type { ItemCasa, ItemCasaFiltros } from "../types/ItemCasa";
import { TIPOS_ITEM, COMODOS_ITEM, NECESSIDADES_ITEM } from "../types/ItemCasa";




const { Title, Text } = Typography;

const { Option } = Select;

const ItensCasa = () => {
    
    const  navigate = useNavigate();

    const [itensCasa, setItensCasa] = useState<ItemCasa[]>([]);
    const [loading, setLoading] = useState(true);
    const [filtros, setFiltros] = useState<ItemCasaFiltros>({});

    const [mostrarFiltros, setMostrarFiltros] = useState(false);

    useEffect(() => {
        carregarItensCasa();
    }, [filtros]);

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

    const corNecessidade = (necessidade: string) => {
        const cores: Record<string, string> = {
            "ESSENCIAL": "red",
            "DESEJAVEL": "yellow",
            "OPCIONAL": "blue"
        };


        return cores[necessidade] || "default";
    };

    const corTipo = (tipo: string) => {
        const cores: Record<string, string> = {
            "MOBILIA": "brown",
            "UTENSILIO": "blue",
            "ELETRODOMESTICO": "gray",
            "ELETRONICO": "white"
        };
        return cores[tipo] || "default";
    };

    return (
        <div>
            {/* Cabeçalho */}
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
                <Col>
                    <Title level={2} style={{ margin: 0 }}>
                        Minha Casa
                    </Title>
                </Col>
                <Col>
                    {/* botões com espaçamento automático */}
                    <Space>
                        <Button
                            icon={<FilterOutlined />}
                            // mostrar e esconder os filtros
                            onClick={() => setMostrarFiltros(prev => !prev)}
                        >
                            Filtros
                        </Button>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => navigate('/itens/novo')}
                        >
                            Novo Item
                        </Button>
                    </Space>
                </Col>
            </Row>

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
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 100 }}>
                    <Spin size="large" />
                </div>

            ) : itensCasa.length === 0 ? (
                <Empty
                    description="Nenhum item encontrado"
                    style={{ marginTop: 60 }}
                >
                    <Button type="primary" onClick={() => navigate('/itens/novo')}>
                        Adicionar primeiro item
                    </Button>
                </Empty>

            ) : (
                /* Grid de cards — um por item */
                <Row gutter={[16, 16]}>
                    {itensCasa.map(item => (
                        <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                            <Card
                                /* actions são os botões no rodapé do card */
                                actions={[
                                    /* Botão de editar */
                                    <EditOutlined
                                        key="editar"
                                        onClick={() => navigate(`/itens/${item.id}`)}
                                    />,

                                    /* Popconfirm pede confirmação antes de deletar */
                                    <Popconfirm
                                        key="deletar"
                                        title="Remover item?"
                                        description="Essa ação não pode ser desfeita."
                                        onConfirm={() => handleDeletar(item.id)}
                                        okText="Sim"
                                        cancelText="Não"
                                    >
                                        <DeleteOutlined style={{ color: 'red' }} />
                                    </Popconfirm>
                                ]}
                            >
                                {/* Cabeçalho do card com tags */}
                                <Space wrap style={{ marginBottom: 8 }}>
                                    <Tag color={corTipo(item.tipo)}>{item.tipo}</Tag>
                                    <Tag color={corNecessidade(item.necessidade)}>
                                        {item.necessidade}
                                    </Tag>
                                </Space>

                                {/* Nome e informações do item */}
                                <Card.Meta
                                    title={item.nome}
                                    description={
                                        <Space direction="vertical" size={2}>
                                            <Text type="secondary">{item.comodo}</Text>
                                            <Text strong style={{ fontSize: 16 }}>
                                                R$ {item.preco.toFixed(2)}
                                            </Text>
                                        </Space>
                                    }
                                />
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
};


export default ItensCasa;