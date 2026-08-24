import type { Cardinality, EREdge, ERNode } from '../types'

type Props = {
  node?: ERNode
  edge?: EREdge
  onChangeNode: (node: ERNode) => void
  onChangeEdge: (edge: EREdge) => void
}

const cardinalities: Cardinality[] = ['0..1', '1..1', '0..N', '1..N', 'N']

const kindLabels: Record<ERNode['data']['kind'], string> = {
  entity: 'Entidade',
  weakEntity: 'Entidade fraca',
  attribute: 'Atributo',
  relationship: 'Relacionamento',
}

export function Inspector({ node, edge, onChangeNode, onChangeEdge }: Props) {
  if (!node && !edge) {
    return (
      <aside className="inspector">
        <div className="panel-heading">
          <span className="eyebrow">PROPRIEDADES</span>
          <h2>Nenhuma seleção</h2>
        </div>
        <p className="muted">Clique em um elemento ou em uma ligação do diagrama para editá-lo.</p>

        <div className="legend-card">
          <strong>Notação usada</strong>
          <div><span>▭</span> Entidade</div>
          <div><span>▣</span> Entidade fraca</div>
          <div><span>◯</span> Atributo</div>
          <div><span>◇</span> Relacionamento</div>
        </div>
      </aside>
    )
  }

  if (node) {
    const updateData = (patch: Partial<ERNode['data']>) =>
      onChangeNode({ ...node, data: { ...node.data, ...patch } })

    return (
      <aside className="inspector">
        <div className="panel-heading">
          <span className="eyebrow">PROPRIEDADES</span>
          <h2>{kindLabels[node.data.kind]}</h2>
        </div>

        <label className="field">
          <span>Nome</span>
          <input value={node.data.label} onChange={(event) => updateData({ label: event.target.value })} />
        </label>

        <label className="field">
          <span>Tipo</span>
          <input value={kindLabels[node.data.kind]} disabled />
        </label>

        {node.data.kind === 'attribute' && (
          <div className="option-list">
            <label className="check-row">
              <input
                type="checkbox"
                checked={Boolean(node.data.primaryKey)}
                onChange={(event) => updateData({ primaryKey: event.target.checked })}
              />
              <span><strong>Chave</strong><small>Sublinha o atributo</small></span>
            </label>

            <label className="check-row">
              <input
                type="checkbox"
                checked={Boolean(node.data.multivalued)}
                onChange={(event) => updateData({ multivalued: event.target.checked })}
              />
              <span><strong>Multivalorado</strong><small>Elipse dupla</small></span>
            </label>

            <label className="check-row">
              <input
                type="checkbox"
                checked={Boolean(node.data.derived)}
                onChange={(event) => updateData({ derived: event.target.checked })}
              />
              <span><strong>Derivado</strong><small>Contorno tracejado</small></span>
            </label>
          </div>
        )}

        {node.data.kind === 'relationship' && (
          <label className="check-row standalone-check">
            <input
              type="checkbox"
              checked={Boolean(node.data.identifying)}
              onChange={(event) => updateData({ identifying: event.target.checked })}
            />
            <span><strong>Identificador</strong><small>Relacionamento com losango duplo</small></span>
          </label>
        )}
      </aside>
    )
  }

  const edgeData = edge!.data ?? {
    sourceCardinality: '1..1' as Cardinality,
    targetCardinality: '0..N' as Cardinality,
  }

  return (
    <aside className="inspector">
      <div className="panel-heading">
        <span className="eyebrow">PROPRIEDADES</span>
        <h2>Ligação</h2>
      </div>

      <label className="field">
        <span>Cardinalidade na origem</span>
        <select
          value={edgeData.sourceCardinality}
          onChange={(event) =>
            onChangeEdge({
              ...edge!,
              data: { ...edgeData, sourceCardinality: event.target.value as Cardinality },
            })
          }
        >
          {cardinalities.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>

      <label className="field">
        <span>Cardinalidade no destino</span>
        <select
          value={edgeData.targetCardinality}
          onChange={(event) =>
            onChangeEdge({
              ...edge!,
              data: { ...edgeData, targetCardinality: event.target.value as Cardinality },
            })
          }
        >
          {cardinalities.map((item) => <option key={item}>{item}</option>)}
        </select>
      </label>

      <div className="info-card">
        <strong>Exemplo</strong>
        <p><code>1..1</code> representa participação obrigatória e única. <code>0..N</code> permite zero ou muitas ocorrências.</p>
      </div>
    </aside>
  )
}
