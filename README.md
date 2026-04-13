# Minha Primeira Casa - Frontend 🏠

Aplicação PWA (Progressive Web App) desenvolvida para auxiliar na organização de itens e listas de compras para quem está montando sua primeira casa. Este projeto faz parte da disciplina de Desenvolvimento Mobile do CEFET-MG.

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias modernas para garantir performance e uma experiência de usuário fluida:

* **React + TypeScript**: Base da aplicação para uma interface reativa e tipagem estática segura.
* **Vite**: Ferramenta de build rápida para o desenvolvimento frontend.
* **Ant Design (antd)**: Biblioteca de componentes de UI para um design profissional e responsivo.
* **React Router**: Gerenciamento de rotas e navegação.
* **Axios**: Integração com a API REST para persistência de dados.
* **PWA (Progressive Web App)**: Implementação de Service Workers, Manifesto e estratégias de cache para funcionamento offline.

## ✨ Funcionalidades

### 1. Gestão de Itens da Casa
* **CRUD Completo**: Criação, listagem, edição e exclusão de itens necessários para a casa.
* **Categorização**: Organização de itens por cômodo (Cozinha, Quarto, Sala, etc.) e tipo (Mobilia, Eletrodoméstico, etc.).
* **Nível de Necessidade**: Classificação dos itens como Essenciais, Desejáveis ou Opcionais.

### 2. Listas de Compras e Produtos
* **Listas Personalizadas**: Criação de listas de compras (ex: "Chá de Panela", "Supermercado").
* **Gestão de Produtos**: Adição de produtos às listas com controle de status (Em estoque, Acabando, Falta).
* **Compartilhamento**: Uso da Web Share API para compartilhar listas com outras pessoas.

### 3. Recursos de PWA e Dispositivo
* **Captura de Imagem**: Upload de fotos para itens e produtos, permitindo **Tirar Foto** (uso direto da câmera via hardware) ou escolher da **Galeria**.
* **Feedback Tátil (Vibração)**: Uso da Vibration API para confirmar ações como salvar ou excluir registros.
* **Suporte Offline**: Acesso à aplicação e visualização de dados mesmo sem conexão com a internet através de Service Workers.
* **Notificações Push**: Alertas visuais ao adicionar novos itens à lista.

## 🛠️ Instruções de Execução

### Pré-requisitos
* Node.js instalado (versão 18 ou superior recomendada).
* Gerenciador de pacotes (npm ou yarn).

### Instalação
1. Clone o repositório:
   ```bash
   git clone [https://github.com/nathanta2001/primeiracasa-frontend.git](https://github.com/nathanta2001/primeiracasa-frontend.git)