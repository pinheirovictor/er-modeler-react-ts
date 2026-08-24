type Props = {
  diagramName: string
  onNameChange: (value: string) => void
  onNew: () => void
  onExample: () => void
  onExport: () => void
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
  onImport,
  onDeleteSelected,
  hasSelection,
}: Props) {
  return (
    <header className="toolbar">
      <div className="brand">
        <div className="brand-mark">ER</div>
        <div>
          <strong>DERLab</strong>
          <small>Modelagem Entidade-Relacionamento</small>
        </div>
      </div>

      <input
        className="diagram-name"
        value={diagramName}
        onChange={(event) => onNameChange(event.target.value)}
        aria-label="Nome do diagrama"
        title="Nome do diagrama"
      />

      <div className="toolbar-group toolbar-actions">
        <button onClick={onNew}>Novo</button>
        <button onClick={onExample}>Exemplo</button>
        <button onClick={onImport}>Importar</button>
        <button onClick={onExport}>Exportar</button>
        <button className="danger-outline" disabled={!hasSelection} onClick={onDeleteSelected}>
          Excluir
        </button>
      </div>
    </header>
  )
}
