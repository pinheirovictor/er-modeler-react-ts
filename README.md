<div align="center">

# DERLab

### Editor Visual para Modelagem Entidade-Relacionamento

Ferramenta web interativa para criação e ensino de **Diagramas Entidade-Relacionamento (DER)** diretamente no navegador.

**React • TypeScript • Vite • React Flow**

[🌐 Acessar o DERLab](https://pinheirovictor.github.io/er-modeler-react-ts/)

</div>

---

## Sobre o DERLab

O **DERLab** é uma ferramenta web desenvolvida para criação de **Modelos Entidade-Relacionamento**, utilizando uma representação visual inspirada na notação clássica de Chen.

A ferramenta foi concebida especialmente para apoiar o **ensino e a aprendizagem de modelagem conceitual de bancos de dados**, permitindo que estudantes construam diagramas de forma visual, interativa e diretamente pelo navegador.

Não é necessário realizar cadastro ou instalar programas adicionais.

Os diagramas são salvos automaticamente no navegador e também podem ser exportados e importados em formato JSON.

---

## Funcionalidades

### Elementos do Modelo ER

- Entidades
- Entidades fracas
- Relacionamentos
- Relacionamentos identificadores
- Atributos
- Atributos-chave
- Atributos multivalorados
- Atributos derivados
- Atributos compostos por meio da conexão entre atributos
- Cardinalidades
- Conexões visuais entre os elementos
- Quatro pontos de conexão em cada elemento
- Movimentação livre dos elementos
- Seleção individual e múltipla
- Painel de propriedades
- Zoom e navegação pelo diagrama
- Grade
- Minimapa
- Salvamento automático
- Importação e exportação JSON
- Histórico de alterações
- Copiar, recortar, colar e duplicar elementos
- Atalhos de teclado
- Diagrama de exemplo

---

## Cardinalidades

O DERLab oferece suporte às seguintes representações de cardinalidade:

```text
1
N
0..1
1..1
0..N
1..N
```

As cardinalidades são utilizadas nas conexões entre **entidades e relacionamentos**.

---

## Regras de Modelagem

O DERLab aplica algumas restrições durante a criação das conexões para auxiliar na construção de modelos ER coerentes.

### Conexões permitidas

```text
Entidade ↔ Atributo

Entidade ↔ Relacionamento

Entidade Fraca ↔ Atributo

Entidade Fraca ↔ Relacionamento

Relacionamento ↔ Atributo

Atributo ↔ Atributo
```

A conexão entre atributos pode ser utilizada para representar **atributos compostos**.

### Conexões não permitidas

```text
Entidade ↔ Entidade

Entidade Fraca ↔ Entidade

Entidade Fraca ↔ Entidade Fraca

Relacionamento ↔ Relacionamento

Elemento ↔ ele mesmo
```

---

## Editor Visual

O DERLab utiliza um ambiente gráfico baseado em nós e conexões.

Cada elemento possui quatro pontos de conexão:

```text
        ●
        │
    ● Elemento ●
        │
        ●
```

Isso permite criar diagramas com maior liberdade de organização e posicionamento.

Também estão disponíveis recursos como:

```text
Zoom
Pan
Grade
Minimapa
Seleção múltipla
Arrastar e soltar
Edição de propriedades
```

---

## Atalhos de Teclado

Os atalhos funcionam em **Windows, Linux e macOS**.

| Ação | Windows / Linux | macOS |
|---|---|---|
| Copiar | `Ctrl + C` | `⌘ + C` |
| Colar | `Ctrl + V` | `⌘ + V` |
| Recortar | `Ctrl + X` | `⌘ + X` |
| Selecionar tudo | `Ctrl + A` | `⌘ + A` |
| Desfazer | `Ctrl + Z` | `⌘ + Z` |
| Refazer | `Ctrl + Y` | `⌘ + Shift + Z` |
| Duplicar | `Ctrl + D` | `⌘ + D` |
| Salvar | `Ctrl + S` | `⌘ + S` |
| Excluir | `Delete / Backspace` | `Delete / Backspace` |
| Cancelar seleção | `Esc` | `Esc` |

---

## Salvamento Automático

O DERLab salva automaticamente o diagrama utilizando o armazenamento local do navegador:

```text
localStorage
```

Isso permite que o trabalho continue disponível mesmo após atualizar ou fechar a página.

Os dados permanecem armazenados no navegador utilizado pelo usuário.

Nenhum servidor ou banco de dados externo é necessário para o funcionamento da aplicação.

---

## Importação e Exportação

Os diagramas podem ser exportados para arquivos:

```text
JSON
```

O arquivo armazena informações como:

```text
Nome do projeto
Entidades
Entidades fracas
Relacionamentos
Atributos
Posições dos elementos
Conexões
Cardinalidades
Propriedades dos elementos
```

O arquivo pode ser posteriormente importado no DERLab para continuar a edição do diagrama.

---

## Exemplo de Modelagem

O DERLab possui um diagrama de exemplo baseado no cenário fictício **TechMaster**.

O modelo apresenta conceitos envolvendo:

```text
Alunos
Professores
Cursos
Turmas
Matrículas
```

O exemplo pode ser carregado utilizando o botão **Exemplo** disponível na interface.

Ele demonstra a utilização de entidades, atributos, relacionamentos, atributos de relacionamento e cardinalidades.

Por padrão, o DERLab inicia com uma área de modelagem vazia. Caso exista um trabalho previamente salvo no navegador, ele será restaurado automaticamente.

---

## Tecnologias

| Tecnologia | Utilização |
|---|---|
| React | Construção da interface |
| TypeScript | Tipagem e desenvolvimento |
| Vite | Ambiente de desenvolvimento e build |
| React Flow / XYFlow | Editor visual de nós e conexões |
| CSS | Interface e representação dos elementos ER |
| LocalStorage | Persistência local dos diagramas |
| GitHub Actions | Automação do processo de publicação |
| GitHub Pages | Hospedagem da aplicação |

---

## Executando Localmente

### Requisitos

Recomenda-se:

```text
Node.js 22.12+
npm
```

Clone o repositório:

```bash
git clone https://github.com/pinheirovictor/er-modeler-react-ts.git
```

Entre na pasta:

```bash
cd er-modeler-react-ts
```

Instale as dependências:

```bash
npm install
```

Execute o ambiente de desenvolvimento:

```bash
npm run dev
```

O Vite exibirá no terminal o endereço da aplicação.

Normalmente:

```text
http://localhost:5173/er-modeler-react-ts/
```

---

## Build de Produção

Para gerar a versão de produção:

```bash
npm run build
```

O resultado será criado na pasta:

```text
dist/
```

Para visualizar o build localmente:

```bash
npm run preview
```

---

## Publicação no GitHub Pages

O DERLab está disponível publicamente em:

### 🌐 https://pinheirovictor.github.io/er-modeler-react-ts/

A publicação é realizada automaticamente por meio do GitHub Actions.

O workflow está localizado em:

```text
.github/workflows/deploy.yml
```

O processo de publicação funciona da seguinte forma:

```text
Push na branch main
        ↓
GitHub Actions
        ↓
Instalação das dependências
        ↓
Build com Vite
        ↓
Geração da pasta dist
        ↓
Deploy
        ↓
GitHub Pages
```

O arquivo `vite.config.ts` utiliza:

```ts
base: '/er-modeler-react-ts/'
```

garantindo que os recursos da aplicação sejam carregados corretamente no endereço do GitHub Pages.

A cada novo `push` realizado na branch `main`, uma nova versão do DERLab é publicada automaticamente.

---

## Estrutura do Projeto

```text
er-modeler-react-ts/
│
├── .github/
│   └── workflows/
│       └── deploy.yml
│
├── src/
│   ├── components/
│   ├── hooks/
│   ├── App.tsx
│   ├── types.ts
│   └── styles.css
│
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md
```

---

## Próximas Evoluções

Algumas funcionalidades planejadas para versões futuras do DERLab:

```text
Exportação para PNG
Exportação para SVG
Validador semântico de modelos ER
Identificação automática de problemas de modelagem
Participação total e parcial
Relacionamentos ternários e n-ários
Conversão automática ER → Relacional
Geração automática de esquema SQL
Gerenciamento de múltiplos projetos
Novos exemplos didáticos
Aprimoramentos de usabilidade
```

---

## Objetivo Educacional

Além de funcionar como um editor visual, o **DERLab** busca auxiliar estudantes na compreensão dos principais conceitos envolvidos na modelagem conceitual de bancos de dados.

O fluxo conceitual trabalhado pela ferramenta é:

```text
Entidades
    ↓
Atributos
    ↓
Relacionamentos
    ↓
Cardinalidades
    ↓
Modelo Entidade-Relacionamento
```

A proposta é disponibilizar uma ferramenta simples, leve e acessível para utilização em:

```text
Aulas
Laboratórios
Exercícios
Atividades práticas
Trabalhos acadêmicos
Estudo de modelagem de bancos de dados
```

---

<div align="center">

# DERLab

### Modelagem Entidade-Relacionamento diretamente no navegador.

[🌐 Acessar o DERLab](https://pinheirovictor.github.io/er-modeler-react-ts/)

</div>