import type {
  Cardinality,
  EREdge,
  ERNode,
} from '../types'


/* =========================================================
   PROPRIEDADES
   ========================================================= */

type Props = {
  node?: ERNode
  edge?: EREdge

  onChangeNode: (node: ERNode) => void
  onChangeEdge: (edge: EREdge) => void
}


/* =========================================================
   CARDINALIDADES
   ========================================================= */

const cardinalities: Cardinality[] = [
  '1',
  'N',
  '0..1',
  '1..1',
  '0..N',
  '1..N',
]


/* =========================================================
   NOMES DOS ELEMENTOS
   ========================================================= */

const kindLabels: Record<
  ERNode['data']['kind'],
  string
> = {
  entity: 'Entidade',
  weakEntity: 'Entidade fraca',
  attribute: 'Atributo',
  relationship: 'Relacionamento',
}


/* =========================================================
   COMPONENTE
   ========================================================= */

export function Inspector({
  node,
  edge,
  onChangeNode,
  onChangeEdge,
}: Props) {

  /* =======================================================
     NENHUM ELEMENTO SELECIONADO
     ======================================================= */

  if (!node && !edge) {
    return (
      <aside className="inspector">

        <div className="panel-heading">
          <span className="eyebrow">
            PROPRIEDADES
          </span>

          <h2>
            Nenhuma seleção
          </h2>
        </div>

        <p className="muted">
          Clique em um elemento ou em uma ligação
          do diagrama para editá-lo.
        </p>

        <div className="legend-card">
          <strong>
            Notação usada
          </strong>

          <div>
            <span>▭</span>
            Entidade
          </div>

          <div>
            <span>▣</span>
            Entidade fraca
          </div>

          <div>
            <span>◯</span>
            Atributo
          </div>

          <div>
            <span>◇</span>
            Relacionamento
          </div>
        </div>

      </aside>
    )
  }


  /* =======================================================
     NÓ SELECIONADO
     ======================================================= */

  if (node) {

    const updateData = (
      patch: Partial<ERNode['data']>,
    ) => {
      onChangeNode({
        ...node,

        data: {
          ...node.data,
          ...patch,
        },
      })
    }


    return (
      <aside className="inspector">

        {/* =================================================
            CABEÇALHO
            ================================================= */}

        <div className="panel-heading">
          <span className="eyebrow">
            PROPRIEDADES
          </span>

          <h2>
            {kindLabels[node.data.kind]}
          </h2>
        </div>


        {/* =================================================
            NOME
            ================================================= */}

        <label className="field">
          <span>
            Nome
          </span>

          <input
            value={node.data.label}
            onChange={(event) =>
              updateData({
                label: event.target.value,
              })
            }
          />
        </label>


        {/* =================================================
            TIPO
            ================================================= */}

        <label className="field">
          <span>
            Tipo
          </span>

          <input
            value={kindLabels[node.data.kind]}
            disabled
          />
        </label>


        {/* =================================================
            PROPRIEDADES DO ATRIBUTO
            ================================================= */}

        {node.data.kind === 'attribute' && (
          <div className="option-list">

            {/* =============================================
                CHAVE PRIMÁRIA
                ============================================= */}

            <label className="check-row">
              <input
                type="checkbox"
                checked={Boolean(
                  node.data.primaryKey,
                )}
                onChange={(event) => {
                  const checked =
                    event.target.checked

                  updateData({
                    primaryKey: checked,

                    /*
                     * Chave primária e chave parcial
                     * são mutuamente exclusivas.
                     */
                    partialKey: checked
                      ? false
                      : node.data.partialKey,
                  })
                }}
              />

              <span>
                <strong>
                  Chave primária
                </strong>

                <small>
                  Nome com sublinhado contínuo
                </small>
              </span>
            </label>


            {/* =============================================
                CHAVE PARCIAL
                ============================================= */}

            <label className="check-row">
              <input
                type="checkbox"
                checked={Boolean(
                  node.data.partialKey,
                )}
                onChange={(event) => {
                  const checked =
                    event.target.checked

                  updateData({
                    partialKey: checked,

                    /*
                     * Ao marcar chave parcial,
                     * a chave primária é desmarcada.
                     */
                    primaryKey: checked
                      ? false
                      : node.data.primaryKey,
                  })
                }}
              />

              <span>
                <strong>
                  Chave parcial
                </strong>

                <small>
                  Sublinhado tracejado — utilizada
                  na identificação de entidade fraca
                </small>
              </span>
            </label>


            {/* =============================================
                MULTIVALORADO
                ============================================= */}

            <label className="check-row">
              <input
                type="checkbox"
                checked={Boolean(
                  node.data.multivalued,
                )}
                onChange={(event) =>
                  updateData({
                    multivalued:
                      event.target.checked,
                  })
                }
              />

              <span>
                <strong>
                  Multivalorado
                </strong>

                <small>
                  Elipse dupla
                </small>
              </span>
            </label>


            {/* =============================================
                DERIVADO
                ============================================= */}

            <label className="check-row">
              <input
                type="checkbox"
                checked={Boolean(
                  node.data.derived,
                )}
                onChange={(event) =>
                  updateData({
                    derived:
                      event.target.checked,
                  })
                }
              />

              <span>
                <strong>
                  Derivado
                </strong>

                <small>
                  Elipse com contorno tracejado
                </small>
              </span>
            </label>

          </div>
        )}


        {/* =================================================
            PROPRIEDADES DO RELACIONAMENTO
            ================================================= */}

        {node.data.kind === 'relationship' && (
          <label className="check-row standalone-check">
            <input
              type="checkbox"
              checked={Boolean(
                node.data.identifying,
              )}
              onChange={(event) =>
                updateData({
                  identifying:
                    event.target.checked,
                })
              }
            />

            <span>
              <strong>
                Identificador
              </strong>

              <small>
                Relacionamento identificador
                representado por losango duplo
              </small>
            </span>
          </label>
        )}

      </aside>
    )
  }


  /* =======================================================
     ARESTA SELECIONADA
     ======================================================= */

  const selectedEdge = edge as EREdge

  const edgeData = selectedEdge.data ?? {
    sourceCardinality: '1' as Cardinality,
    targetCardinality: 'N' as Cardinality,
  }


  /* =======================================================
     ATUALIZAR CARDINALIDADE DA ORIGEM
     ======================================================= */

  const updateSourceCardinality = (
    value: string,
  ) => {
    onChangeEdge({
      ...selectedEdge,

      data: {
        ...edgeData,
        sourceCardinality:
          value as Cardinality,
      },
    })
  }


  /* =======================================================
     ATUALIZAR CARDINALIDADE DO DESTINO
     ======================================================= */

  const updateTargetCardinality = (
    value: string,
  ) => {
    onChangeEdge({
      ...selectedEdge,

      data: {
        ...edgeData,
        targetCardinality:
          value as Cardinality,
      },
    })
  }


  return (
    <aside className="inspector">

      {/* ===================================================
          CABEÇALHO
          =================================================== */}

      <div className="panel-heading">
        <span className="eyebrow">
          PROPRIEDADES
        </span>

        <h2>
          Ligação
        </h2>
      </div>


      {/* ===================================================
          CARDINALIDADE DA ORIGEM
          =================================================== */}

      <label className="field">
        <span>
          Cardinalidade na origem
        </span>

        <select
          value={
            edgeData.sourceCardinality
          }
          onChange={(event) =>
            updateSourceCardinality(
              event.target.value,
            )
          }
        >
          {cardinalities.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ),
          )}
        </select>
      </label>


      {/* ===================================================
          CARDINALIDADE DO DESTINO
          =================================================== */}

      <label className="field">
        <span>
          Cardinalidade no destino
        </span>

        <select
          value={
            edgeData.targetCardinality
          }
          onChange={(event) =>
            updateTargetCardinality(
              event.target.value,
            )
          }
        >
          {cardinalities.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ),
          )}
        </select>
      </label>


      {/* ===================================================
          AJUDA
          =================================================== */}

      <div className="info-card">
        <strong>
          Cardinalidades
        </strong>

        <p>
          <code>1</code>
          {' '}
          representa uma ocorrência.
          {' '}
          <code>N</code>
          {' '}
          representa muitas ocorrências.
        </p>

        <p>
          <code>0..1</code>
          {' '}
          representa zero ou uma ocorrência.
        </p>

        <p>
          <code>1..1</code>
          {' '}
          representa participação obrigatória
          e única.
        </p>

        <p>
          <code>0..N</code>
          {' '}
          representa participação opcional
          com muitas ocorrências.
        </p>

        <p>
          <code>1..N</code>
          {' '}
          representa uma ou muitas ocorrências.
        </p>
      </div>

    </aside>
  )
}