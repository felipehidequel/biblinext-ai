# BiblioNext - Sistema de Gerenciamento de Biblioteca

O BiblioNext é um sistema moderno para gerenciamento de bibliotecas, construído com as tecnologias mais recentes do ecossistema Next.js. Ele oferece um painel administrativo para que bibliotecários possam gerenciar o catálogo de livros e o fluxo de empréstimos de forma eficiente e intuitiva.

Este projeto foi desenvolvido como um MVP (Mínimo Produto Viável) e demonstra o uso de Server Components, Server Actions e um mecanismo de fallback para garantir a resiliência dos dados.

## 🚀 Funcionalidades Principais

* **Painel Administrativo**: Uma interface central para todas as operações da biblioteca.
* **Gerenciamento de Catálogo**: Adicione, visualize e edite livros no acervo.
* **Aprovação de Empréstimos**: Visualize e gerencie solicitações de empréstimo pendentes.
* **Design Responsivo**: Interface adaptável para diferentes tamanhos de tela.
* **Mecanismo de Fallback**: Garante que os dados de novos livros não sejam perdidos caso o banco de dados principal (Firestore) esteja indisponível, salvando-os localmente em um arquivo JSON.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias:

* **Framework**: [Next.js](https://nextjs.org/) (com App Router)
* **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
* **Banco de Dados**: [Firebase Firestore](https://firebase.google.com/docs/firestore)
* **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
* **Componentes UI**: [shadcn/ui](https://ui.shadcn.com/)
* **Ícones**: [Lucide React](https://lucide.dev/)

## ⚙️ Arquitetura

A arquitetura do projeto segue uma abordagem de componentização moderna, separando claramente as responsabilidades:

1.  **Frontend (`src/app`, `src/components`)**: As páginas são construídas como **Server Components** para renderização otimizada no servidor. Os componentes interativos (formulários, botões) são **Client Components**.
2.  **Lógica de Negócio (`src/lib/actions.ts`)**: Mutações de dados (criar, atualizar, aprovar) são gerenciadas por **Server Actions**, garantindo segurança e co-localização da lógica de backend com as chamadas do frontend.
3.  **Acesso a Dados (`src/lib/data.ts`)**: Funções responsáveis por buscar dados do Firestore e do mecanismo de fallback em JSON.
4.  **Configuração do Firebase (`src/lib/firebase.ts`)**: Centraliza a inicialização e configuração do SDK do Firebase.
5.  **Fallback (`firestore-fallback.json`)**: Um arquivo JSON na raiz do projeto que atua como um armazenamento temporário quando o Firestore está inacessível.

## 🏁 Como Começar

Siga os passos abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* Uma conta no [Firebase](https://firebase.google.com/) com um projeto criado e o Firestore habilitado.

### 1. Clonar o Repositório

```bash
git clone [https://github.com/felipehidequel/biblinext-ai.git](https://github.com/felipehidequel/biblinext-ai.git)
cd biblionext-ai


### 2. Executar

Utilize os comandos:

```bash
npm install
npm run dev

Por se tratar de um MVP, tem um sistema de fallback para persistir os dados em um JSON para evitar a necessidade de autenticação no Firebase durante o desenvolvimento inicial.
