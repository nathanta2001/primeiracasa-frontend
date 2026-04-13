// Página de formulário para criar ou editar um item da casa
import { Button, Card, Form, Input, InputNumber, message, notification, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { itemCasaService } from "../services/itemCasaService";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { COMODOS_ITEM, NECESSIDADES_ITEM, TIPOS_ITEM } from "../types/ItemCasa";
import { ImageCapture } from "../components/ImageCapture";



const { Title } = Typography;
const { Option } = Select;

const ItemCasaForm = () => {

    const navigate = useNavigate();

    const { id } = useParams();
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loadingDados, setLoadingDados] = useState(false);
    const isEdicao = !!id;


    useEffect(() => {
        if (isEdicao) {
            carregarItemCasa();
        }
    }, [id]);

    const carregarItemCasa = async () => {
        try {

            setLoadingDados(true);
            const item = await itemCasaService.buscarPorId(id!);

            form.setFieldsValue({
                nome: item.nome,
                preco: item.preco,
                tipo: item.tipo,
                necessidade: item.necessidade,
                comodo: item.comodo
            });

        } catch (error) {
            message.error("Erro ao carregar item:");
            navigate("/itens");
        } finally {
            setLoadingDados(false);
        }
    };

    interface ItemCasaFormValues {
        nome: string;
        preco: number;
        tipo: 'MOBILIA' | 'UTENSILIO' | 'ELETRODOMESTICO' | 'ELETRONICO';
        necessidade: 'ESSENCIAL' | 'DESEJAVEL' | 'OPCIONAL';
        comodo: 'COZINHA' | 'QUARTO' | 'SALA' | 'BANHEIRO' | 'AREA_DE_SERVICO' | 'COPA' | 'QUINTAL' | 'JARDIM' | 'GARAGEM' | 'OUTROS';
        fotoBase64?: string;
    }

    const onFinish = async (values: ItemCasaFormValues) => {
        try {
            setLoading(true);

            // Pega o valor da foto que está no estado do form
            const fotoBase64 = form.getFieldValue('fotoBase64');

            const payload = {
                ...values,
                fotoBase64: fotoBase64
            };

            if (isEdicao) {
                await itemCasaService.atualizar(id!, payload);
                notification.success({ message: "Item atualizado com sucesso!" });
            } else {
                await itemCasaService.criar(payload);
                notification.success({ message: "Item criado com sucesso!" });
            }

            if ('vibrate' in navigator) {
                navigator.vibrate(200);
            }

            navigate("/itens");
        } catch (error) {
            notification.error({ message: "Erro ao salvar item" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>

            {/* Botão de voltar + título dinâmico */}
            <Space style={{ marginBottom: 24 }}>
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/itens')}
                >
                    Voltar
                </Button>
                <Title level={2} style={{ margin: 0 }}>
                    {isEdicao ? 'Editar Item' : 'Novo Item'}
                </Title>
            </Space>

            <Card loading={loadingDados}>
                {/* Form do Ant Design
                    layout="vertical" — label em cima do campo
                    form={form} — conecta a instância criada com Form.useForm()
                    onFinish — função chamada quando submete e valida com sucesso */}
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={onFinish}
                    // define valores padrão para criação
                    initialValues={{ adquirido: false }}
                >

                    {/* Form.Item envolve cada campo
                        name — chave do campo no objeto values
                        label — texto exibido acima do campo
                        rules — validações */}
                    <Form.Item
                        name="nome"
                        label="Nome do item"
                        rules={[{ required: true, message: 'Informe o nome do item' }]}
                    >
                        <Input placeholder="Ex: Geladeira Brastemp 400L" />
                    </Form.Item>

                    <Form.Item
                        name="preco"
                        label="Preço estimado (R$)"
                        rules={[
                            { required: true, message: 'Informe o preço' },
                            { type: 'number', min: 0.01, message: 'Preço deve ser maior que zero' }
                        ]}
                    >
                        {/* InputNumber é específico para números
                            min evita valores negativos
                            precision define 2 casas decimais */}
                        <InputNumber
                            style={{ width: '100%' }}
                            formatter={value => `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                            parser={value => value!.replace(/\R\$\s?|(,*)/g, '')}
                        />
                    </Form.Item>

                    {/* Row e Col para colocar dois campos lado a lado */}
                    <Form.Item
                        name="tipo"
                        label="Tipo"
                        rules={[{ required: true, message: 'Selecione o tipo' }]}
                    >
                        <Select placeholder="Selecione o tipo">
                            {Object.values(TIPOS_ITEM).map(tipo => (
                                <Option key={tipo} value={tipo}>{tipo}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="comodo"
                        label="Cômodo"
                        rules={[{ required: true, message: 'Selecione o cômodo' }]}
                    >
                        <Select placeholder="Selecione o cômodo">
                            {Object.values(COMODOS_ITEM).map(comodo => (
                                <Option key={comodo} value={comodo}>{comodo}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        name="necessidade"
                        label="Nível de necessidade"
                        rules={[{ required: true, message: 'Selecione a necessidade' }]}
                    >
                        <Select placeholder="Selecione a necessidade">
                            {Object.values(NECESSIDADES_ITEM).map(nec => (
                                <Option key={nec} value={nec}>{nec}</Option>
                            ))}
                        </Select>
                    </Form.Item>

                    {/* Botões de ação */}
                    <Form.Item style={{ marginBottom: 0 }}>
                        <Space>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={loading}
                            >
                                {isEdicao ? 'Salvar alterações' : 'Criar item'}
                            </Button>
                            <Button onClick={() => navigate('/itens')}>
                                Cancelar
                            </Button>
                        </Space>
                    </Form.Item>

                    <Form.Item name="fotoBase64">
                        <ImageCapture
                            value={form.getFieldValue('fotoBase64')}
                            onChange={(val) => form.setFieldsValue({ fotoBase64: val })}
                        />
                    </Form.Item>

                </Form>
            </Card>
        </div>
    );
};

export default ItemCasaForm;
