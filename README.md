# ER Studio

Ferramenta web de modelagem Entidade-Relacionamento feita em React + TypeScript + Vite + React Flow.

## Recursos atuais

- Entidade
- Entidade fraca
- Atributo
  - chave
  - multivalorado
  - derivado
- Relacionamento
- Relacionamento identificador
- Generalização / especialização (ISA)
- Conexões visuais
- Cardinalidades `0..1`, `1..1`, `0..N`, `1..N` e `N`
- Zoom, pan, grade e minimapa
- Painel de propriedades
- Salvamento automático no navegador
- Importação e exportação JSON
- Diagrama de exemplo
- GitHub Pages via GitHub Actions

## Requisitos

- Node.js 22.12+ recomendado
- npm

## Rodar localmente

```bash
npm install
npm run dev
```

O terminal exibirá o endereço local, normalmente `http://localhost:5173`.

## Gerar build de produção

```bash
npm run build
npm run preview
```

O build ficará na pasta `dist/`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Coloque os arquivos deste projeto nele.
3. Faça push para o branch `main`.
4. Abra `Settings > Pages`.
5. Em **Source**, selecione **GitHub Actions**.
6. O workflow `.github/workflows/deploy.yml` fará o deploy a cada push em `main`.

O `vite.config.ts` usa `base: './'`, portanto o projeto funciona em uma subpasta do GitHub Pages sem você precisar alterar o nome do repositório.

## Próximas evoluções

- Atributo composto
- Relacionamento ternário com regras didáticas
- Participação total/parcial
- Undo/redo
- Copiar/colar
- Exportação PNG/SVG
- Validador semântico
- Conversão automática ER -> relacional
- Geração de SQL
- Múltiplos projetos no navegador
