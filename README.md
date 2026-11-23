# 🚌 No Ponto — Sistema Distribuído para Monitoramento de Ônibus

**Seu ônibus. Sua rota. Seu tempo.**

## 1. Sobre o projeto

O **No Ponto** é um sistema desenvolvido com o objetivo de facilitar o acompanhamento de ônibus públicos e escolares.

A proposta é permitir o gerenciamento de veículos, rotas, paradas, usuários e informações de localização, oferecendo aos passageiros uma forma mais prática de acompanhar o transporte.

O projeto está sendo desenvolvido como atividade acadêmica da disciplina de **Fundamentos da Computação Concorrente, Paralela e Distribuída**, explorando a organização dos serviços e o processamento das informações.

## 2. Objetivos

- Gerenciar ônibus, rotas, paradas e usuários.
- Identificar veículos por meio de RFID.
- Registrar informações de localização utilizando GPS.
- Disponibilizar informações por meio de uma API.
- Desenvolver uma interface para visualização dos dados.
- Explorar conceitos de computação concorrente e distribuída.

## 3. Tecnologias utilizadas

| Tecnologia | Finalidade |
|---|---|
| TypeScript | Linguagem utilizada no desenvolvimento |
| Node.js | Ambiente de execução do backend |
| NestJS | Framework para construção da API |
| TypeORM | Comunicação entre backend e banco de dados |
| PostgreSQL | Banco de dados relacional |
| Neon | Hospedagem do banco de dados |
| React | Construção da interface |
| Vite | Ambiente de desenvolvimento do frontend |
| Tailwind CSS | Estilização da interface |
| Leaflet | Recursos de mapas e localização |
| Axios | Comunicação HTTP com a API |
| React Router | Navegação entre páginas |

## 4. Justificativa das tecnologias escolhidas

As tecnologias foram escolhidas considerando a facilidade de desenvolvimento, organização do código, integração entre os componentes e possibilidade de expansão do sistema.

- **TypeScript:** permite trabalhar com tipagem, facilitando a manutenção e identificação de erros.
- **Node.js:** possibilita executar o backend utilizando JavaScript e operações assíncronas.
- **NestJS:** oferece uma estrutura organizada para desenvolver APIs e separar as responsabilidades do sistema.
- **TypeORM:** facilita o mapeamento e a manipulação dos dados no banco PostgreSQL.
- **PostgreSQL:** permite armazenar informações estruturadas e relacionamentos entre as entidades.
- **Neon:** oferece hospedagem de PostgreSQL na nuvem.
- **React:** facilita a criação de interfaces dinâmicas e reutilizáveis.
- **Vite:** proporciona um ambiente rápido para desenvolvimento do frontend.
- **Tailwind CSS:** facilita a criação e organização dos estilos.
- **Leaflet:** permite trabalhar com mapas e representar informações geográficas.
- **Axios:** facilita a realização de requisições HTTP entre frontend e backend.
- **React Router:** permite organizar a navegação entre as telas.

## 5. Alternativas tecnológicas analisadas

Existem outras tecnologias que poderiam ser utilizadas no desenvolvimento do sistema. Algumas alternativas são:

| Tecnologia escolhida | Alternativa | Justificativa da escolha |
|---|---|---|
| NestJS | Express | NestJS oferece uma estrutura mais organizada para separar módulos e responsabilidades. |
| TypeORM | Prisma | TypeORM foi mantido por já estar integrado ao backend desenvolvido. |
| PostgreSQL | MySQL | PostgreSQL atende às necessidades de armazenamento e relacionamentos do projeto. |
| React | Angular | React permite desenvolver a interface utilizando componentes reutilizáveis. |
| Leaflet | Google Maps | Leaflet permite trabalhar com mapas utilizando uma biblioteca de código aberto. |

Essas alternativas representam possibilidades técnicas de desenvolvimento. A escolha final considera a estrutura já implementada e as necessidades do projeto.

## 6. Arquitetura do sistema

O sistema está organizado em duas partes principais:

- **Backend:** responsável pelas regras de negócio, comunicação com o banco de dados e disponibilização das informações.
- **Frontend:** responsável pela interface de interação com o usuário.

### Fluxo geral

1. O usuário interage com a interface.
2. O frontend realiza requisições para a API.
3. O backend recebe e valida as informações.
4. O TypeORM realiza a comunicação com o PostgreSQL.
5. A API retorna os dados para o frontend.
6. A interface apresenta as informações ao usuário.

```mermaid
flowchart TD
    A[Usuário] --> B[Frontend React]
    B --> C[API NestJS]
    C --> D[Validação dos dados]
    D --> E[TypeORM]
    E --> F[(PostgreSQL / Neon)]
    F --> E
    E --> C
    C --> B
```

## 7. Backend

O backend foi desenvolvido utilizando NestJS e TypeScript.

Sua responsabilidade é processar as requisições, validar os dados, executar as operações necessárias e realizar a comunicação com o banco de dados.

### Principais módulos

| Módulo | Responsabilidade |
|---|---|
| Ônibus | Cadastro, consulta, atualização e exclusão de veículos |
| Rotas | Gerenciamento das rotas |
| Paradas | Gerenciamento dos pontos de parada |
| Localização | Registro das coordenadas dos veículos |
| Usuários | Gerenciamento dos usuários |

### Funcionalidades implementadas

O módulo de ônibus possui operações CRUD:

- **Create:** cadastro de ônibus.
- **Read:** consulta dos ônibus cadastrados.
- **Update:** atualização dos dados.
- **Delete:** exclusão de veículos.

Também possui validação de dados, filtros por placa e status e paginação na consulta.

## 8. Frontend

O frontend foi desenvolvido utilizando React, TypeScript e Vite.

A interface possui uma estrutura de painel administrativo, com navegação lateral e áreas destinadas à apresentação das informações do sistema.

### Elementos da interface

- Painel inicial.
- Área de gerenciamento de ônibus.
- Área de rotas.
- Área de paradas.
- Indicadores e informações gerais.
- Espaço destinado à visualização de mapas.

O objetivo é oferecer uma interface simples e organizada para facilitar o acesso às funcionalidades.

## 9. Concorrência e distribuição

A disciplina de Fundamentos da Computação Concorrente, Paralela e Distribuída propõe explorar formas de organizar e executar tarefas computacionais.

No contexto do No Ponto, um cenário de aplicação desses conceitos é o recebimento de várias atualizações de localização de ônibus ao mesmo tempo.

O processamento dessas informações pode ser organizado por serviços independentes, permitindo distribuir tarefas e evitar que todas as operações fiquem concentradas em um único componente.

**Observação:** os mecanismos específicos de concorrência e distribuição devem ser descritos conforme forem implementados e testados no projeto. A arquitetura atual identificada no repositório não comprova, por si só, o uso de filas ou workers.

## 10. Custos do projeto

O desenvolvimento prioriza ferramentas gratuitas ou de código aberto.

| Recurso | Tecnologia | Custo |
|---|---|---|
| Linguagem | TypeScript | Gratuito |
| Backend | NestJS e Node.js | Gratuito |
| ORM | TypeORM | Gratuito |
| Banco de dados | PostgreSQL | Gratuito (software) |
| Hospedagem do banco | Neon | Depende do plano utilizado |
| Frontend | React e Vite | Gratuito |
| Estilização | Tailwind CSS | Gratuito |
| Mapas | Leaflet | Gratuito |

Os custos de hospedagem, infraestrutura e eventuais serviços externos devem ser atualizados de acordo com os planos efetivamente utilizados.

## 11. Demonstração do funcionamento

O backend foi executado e testado com o banco PostgreSQL hospedado no Neon.

Foram realizadas operações de cadastro, consulta, atualização e exclusão de ônibus.

Os testes confirmaram:

- Cadastro de ônibus pela API.
- Consulta dos registros cadastrados.
- Atualização de informações.
- Exclusão de registros.
- Validação dos dados enviados.

### Evidências

Adicionar nesta seção:

- Captura da interface do frontend.
- Captura da API em execução.
- Exemplo de cadastro de ônibus.
- Exemplo de consulta dos dados.
- Captura do banco de dados.
- Demonstração dos recursos de concorrência e distribuição, quando implementados.

## 12. Como executar o projeto

### Backend

Acesse a pasta do backend:

```bash
cd backend
```

Instale as dependências:

```bash
npm install
```

Configure as variáveis de ambiente no arquivo `.env`, utilizando as credenciais do banco de dados:

```env
DATABASE_URL="SUA_URL_DO_BANCO"
DIRECT_URL="SUA_URL_DE_CONEXAO_DIRETA"
```

Compile o projeto:

```bash
npm run build
```

Execute as migrations:

```bash
npm run migration:run
```

Inicie o servidor:

```bash
npm run start:dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

### Frontend

A pasta do frontend deverá ser adicionada ao repositório.

Após sua inclusão, as instruções de instalação e execução serão documentadas conforme a configuração final do projeto.

## 13. Banco de dados

O sistema utiliza PostgreSQL com TypeORM.

As principais entidades são:

- Rota
- Ônibus
- Parada
- Localização
- Usuário
- UsuarioFavoritaRota

A entidade UsuarioFavoritaRota representa o relacionamento entre usuários e rotas favoritas.

## 14. Equipe de desenvolvimento

- **Eduardo Artur**
- **Emerson Sousa**
- **Marjory Leticia**

---

**No Ponto — Seu ônibus. Sua rota. Seu tempo.**

Projeto acadêmico desenvolvido no curso de Análise e Desenvolvimento de Sistemas.