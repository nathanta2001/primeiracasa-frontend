# Ant Design — Componentes utilizados

Versão: 5.x
Documentação oficial: https://ant.design/components/overview

## COMPONENTES

## Layout e estrutura

Layout — estrutura principal da página com Header/Content
Row / Col — grid responsivo com suporte a breakpoints (xs, sm, md, lg)
Card — container com borda e sombra, suporta actions e loading
Space — agrupa elementos com espaçamento automático
Modal — janela modal para formulários rápidos
Drawer — painel lateral deslizante
Badge — contador numérico sobre ícones
Tooltip — dica ao passar o mouse
Divider — separador visual entre seções
Result — página de resultado de ação (sucesso, erro, 404)

## Navegação

Menu — barra de navegação com suporte a selectedKeys e onClick

##  Tipografia

Typography.Title — títulos com níveis (h1-h5)
Typography.Text — texto com variantes strong, secondary, type

##  Formulários

Form / Form.Item — formulário com validação integrada
Input — campo de texto simples
Input.TextArea — campo de texto multilinha
InputNumber — campo numérico com min, precision, prefix
Select / Select.Option — dropdown de seleção com allowClear
Switch — toggle on/off, requer valuePropName="checked" no Form.Item
Table — tabela com colunas, ordenação e paginação (alternativa aos Cards em lista)

##  Feedback e notificações

message — notificações temporárias de sucesso/erro/info
Spin — spinner de carregamento
Popconfirm — confirmação antes de ação destrutiva
Empty — estado de lista vazia

##  Dados

Statistic — exibe números com título e ícone
List / List.Item / List.Item.Meta — lista de itens com ações
Tag — etiquetas coloridas para status e categorias

##  Ícones (pacote @ant-design/icons)

HomeOutlined
ShoppingOutlined
CheckCircleOutlined
DollarOutlined
FilterOutlined
PlusOutlined
EditOutlined
DeleteOutlined
CheckOutlined
ArrowLeftOutlined
AppstoreOutlined
UnorderedListOutlined


## Customização de tema
Configurado em main.tsx via ConfigProvider
Token primário: #7C3AED