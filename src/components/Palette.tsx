import type { ERNodeKind } from '../types'

type Props = {
  onAdd: (kind: ERNodeKind) => void
}

const items: Array<{ kind: ERNodeKind; title: string; hint: string; symbol: string }> = [
  { kind: 'entity', title: 'Entidade', hint: 'Objeto principal do domínio', symbol: '▭' },
  { kind: 'weakEntity', title: 'Entidade fraca', hint: 'Depende de outra entidade', symbol: '▣' },
  { kind: 'attribute', title: 'Atributo', hint: 'Propriedade de uma entidade', symbol: '◯' },
  { kind: 'relationship', title: 'Relacionamento', hint: 'Associação entre entidades', symbol: '◇' }
]

export function Palette({ onAdd }: Props) {
  return (
    <aside className="palette">
      <div className="panel-heading">
        <span className="eyebrow">ELEMENTOS</span>
        <h2>Modelo ER</h2>
      </div>

      <div className="palette-list">
        {items.map((item) => (
          <button className="palette-item" key={item.kind} onClick={() => onAdd(item.kind)}>
            <span className="palette-symbol">{item.symbol}</span>
            <span>
              <strong>{item.title}</strong>
              <small>{item.hint}</small>
            </span>
          </button>
        ))}
      </div>

      <div className="palette-help">
        <strong>Dica</strong>
        <p>Adicione um elemento e conecte os pontos azuis. Selecione-o para editar as propriedades.</p>
      </div>
    </aside>
  )
}
