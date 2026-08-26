type Props = {
  diagramName: string
  onNameChange: (value: string) => void
  onNew: () => void
  onExample: () => void
  onExport: () => void
  onExportPng: () => void
  onExportPdf: () => void
  onImport: () => void
  onDeleteSelected: () => void
  hasSelection: boolean
}

export function Toolbar({
  diagramName,
  onNameChange,
  onNew,
  onExample,
  onExport,
  onExportPng,
  onExportPdf,
  onImport,
  onDeleteSelected,
  hasSelection,
}: Props) {
  return (
    <header className="toolbar">
      <div className="brand">
        <div className="brand-mark">DER</div>

        <div>
          <strong>DERLab</strong>
          <small>
            Modelagem Entidade-Relacionamento
          </small>
        </div>
      </div>

      <input
        className="diagram-name"
        value={diagramName}
        onChange={(event) =>
          onNameChange(event.target.value)
        }
        aria-label="Nome do diagrama"
        title="Nome do diagrama"
      />

      <div className="toolbar-group toolbar-actions">
        <button
          type="button"
          onClick={onNew}
        >
          Novo
        </button>

        <button
          type="button"
          onClick={onExample}
        >
          Exemplo
        </button>

        <button
          type="button"
          onClick={onImport}
        >
          Importar
        </button>

        <button
          type="button"
          onClick={onExportPng}
          title="Exportar diagrama como imagem PNG"
        >
          Exportar PNG
        </button>

        <button
          type="button"
          onClick={
            onExportPdf
          }
        >
          Exportar PDF
        </button>

        <button
          type="button"
          onClick={onExport}
          title="Exportar projeto como arquivo JSON"
        >
          Exportar JSON
        </button>

        <button
          type="button"
          className="danger-outline"
          disabled={!hasSelection}
          onClick={onDeleteSelected}
          title={
            hasSelection
              ? 'Excluir elementos selecionados'
              : 'Selecione um elemento para excluir'
          }
        >
          Excluir
        </button>
      </div>
    </header>
  )
}