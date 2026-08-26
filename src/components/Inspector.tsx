import type {
  CardinalityMode,
  EREdge,
  ERNode,
  MaximumCardinality,
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
   CARDINALIDADES MÁXIMAS
   ========================================================= */

const maximumCardinalities: MaximumCardinality[] = [
  '1',
  'N',
  'M',
]


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
            value={
              kindLabels[
                node.data.kind
              ]
            }
            disabled
          />

        </label>


        {/* =================================================
            ATRIBUTO
            ================================================= */}

        {node.data.kind === 'attribute' && (

          <div className="option-list">

            {/* =============================================
                CHAVE PRIMÁRIA
                ============================================= */}

            <label className="check-row">

              <input
                type="checkbox"
                checked={
                  Boolean(
                    node.data.primaryKey,
                  )
                }
                onChange={(event) => {

                  const checked =
                    event.target.checked

                  updateData({
                    primaryKey: checked,

                    partialKey:
                      checked
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
                  Sublinhado contínuo
                </small>

              </span>

            </label>


            {/* =============================================
                CHAVE PARCIAL
                ============================================= */}

            <label className="check-row">

              <input
                type="checkbox"
                checked={
                  Boolean(
                    node.data.partialKey,
                  )
                }
                onChange={(event) => {

                  const checked =
                    event.target.checked

                  updateData({
                    partialKey: checked,

                    primaryKey:
                      checked
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
                checked={
                  Boolean(
                    node.data.multivalued,
                  )
                }
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
                checked={
                  Boolean(
                    node.data.derived,
                  )
                }
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
            RELACIONAMENTO
            ================================================= */}

        {node.data.kind === 'relationship' && (

          <>

            {/* =============================================
                RELACIONAMENTO IDENTIFICADOR
                ============================================= */}

            <label className="check-row standalone-check">

              <input
                type="checkbox"
                checked={
                  Boolean(
                    node.data.identifying,
                  )
                }
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


            {/* =============================================
                MODO DE CARDINALIDADE
                ============================================= */}

            <label className="field">

              <span>
                Notação de cardinalidade
              </span>

              <select
                value={
                  node.data.cardinalityMode ??
                  'maximum'
                }
                onChange={(event) => {

                  const value =
                    event.target.value as CardinalityMode

                  updateData({
                    cardinalityMode:
                      value,
                  })
                }}
              >

                <option value="maximum">
                  Somente cardinalidade máxima
                </option>

                <option value="minmax">
                  Cardinalidade mínima e máxima
                </option>

              </select>

            </label>


            {/* =============================================
                AJUDA
                ============================================= */}

            <div className="info-card">

              <strong>
                Representação
              </strong>

              {(
                node.data.cardinalityMode ??
                'maximum'
              ) === 'maximum' ? (

                <p>
                  Cada participação apresenta apenas
                  sua cardinalidade máxima:
                  {' '}
                  <code>1</code>,
                  {' '}
                  <code>N</code>
                  {' '}
                  ou
                  {' '}
                  <code>M</code>.
                </p>

              ) : (

                <p>
                  Cada participação apresenta os
                  valores mínimo e máximo, como
                  {' '}
                  <code>(0,1)</code>,
                  {' '}
                  <code>(1,1)</code>
                  {' '}
                  ou
                  {' '}
                  <code>(1,N)</code>.
                </p>

              )}

            </div>

          </>
        )}

      </aside>
    )
  }


  /* =======================================================
     LIGAÇÃO SELECIONADA
     ======================================================= */

  const selectedEdge =
    edge as EREdge


  const edgeData =
    selectedEdge.data ?? {}


  /* =======================================================
     LIGAÇÃO SEM CARDINALIDADE
     ======================================================= */

  if (
    edgeData.showCardinality === false
  ) {
    return (
      <aside className="inspector">

        <div className="panel-heading">

          <span className="eyebrow">
            PROPRIEDADES
          </span>

          <h2>
            Ligação
          </h2>

        </div>


        <div className="info-card">

          <strong>
            Ligação estrutural
          </strong>

          <p>
            Esta ligação não utiliza cardinalidade.
            Cardinalidades são utilizadas nas
            participações entre entidades e
            relacionamentos.
          </p>

        </div>

      </aside>
    )
  }


  /* =======================================================
     MODO DA CARDINALIDADE
     ======================================================= */

  /*
   * O App.tsx deve sincronizar este campo com
   * cardinalityMode do relacionamento.
   *
   * Mantemos fallback "maximum" para diagramas antigos.
   */

  const mode =
    edgeData.cardinalityMode ??
    'maximum'


  /* =======================================================
     CARDINALIDADE MÁXIMA
     ======================================================= */

  const cardinality:
    MaximumCardinality =
    edgeData.cardinality ??
    '1'


  /* =======================================================
     MIN-MAX
     ======================================================= */

  const minimum =
    edgeData.minimumCardinality ??
    '0'


  const maximum =
    edgeData.maximumCardinality ??
    '1'


  /* =======================================================
     SANITIZAR MÍNIMO
     ======================================================= */

  const sanitizeMinimum = (
    value: string,
  ) => {
    return value.replace(
      /\D/g,
      '',
    )
  }


  /* =======================================================
     SANITIZAR MÁXIMO MIN-MAX
     ======================================================= */

  const sanitizeMaximum = (
    value: string,
  ) => {

    const upper =
      value.toUpperCase()


    if (
      upper.includes('N')
    ) {
      return 'N'
    }


    return upper.replace(
      /\D/g,
      '',
    )
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
          INFORMAÇÃO DO MODO
          =================================================== */}

      <div className="info-card">

        <strong>
          Notação atual
        </strong>

        <p>
          {mode === 'maximum'
            ? 'Somente cardinalidade máxima.'
            : 'Cardinalidade mínima e máxima.'}
        </p>

        <p>
          Para alterar o tipo de notação,
          selecione o relacionamento.
        </p>

      </div>


      {/* ===================================================
          SOMENTE CARDINALIDADE MÁXIMA
          =================================================== */}

      {mode === 'maximum' && (

        <label className="field">

          <span>
            Cardinalidade
          </span>

          <select
            value={cardinality}
            onChange={(event) => {

              const value =
                event.target.value as MaximumCardinality

              onChangeEdge({
                ...selectedEdge,

                data: {
                  ...edgeData,

                  cardinalityMode:
                    'maximum',

                  cardinality:
                    value,
                },
              })
            }}
          >

            {maximumCardinalities.map(
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

      )}


      {/* ===================================================
          CARDINALIDADE MÍNIMA E MÁXIMA
          =================================================== */}

      {mode === 'minmax' && (

        <>

          {/* ===============================================
              MÍNIMA
              =============================================== */}

          <label className="field">

            <span>
              Cardinalidade mínima
            </span>

            <input
              type="text"
              inputMode="numeric"
              value={minimum}
              placeholder="0"
              onChange={(event) => {

                const value =
                  sanitizeMinimum(
                    event.target.value,
                  )

                onChangeEdge({
                  ...selectedEdge,

                  data: {
                    ...edgeData,

                    cardinalityMode:
                      'minmax',

                    minimumCardinality:
                      value,
                  },
                })
              }}
            />

          </label>


          {/* ===============================================
              MÁXIMA
              =============================================== */}

          <label className="field">

            <span>
              Cardinalidade máxima
            </span>

            <input
              type="text"
              value={maximum}
              placeholder="N"
              onChange={(event) => {

                const value =
                  sanitizeMaximum(
                    event.target.value,
                  )

                onChangeEdge({
                  ...selectedEdge,

                  data: {
                    ...edgeData,

                    cardinalityMode:
                      'minmax',

                    maximumCardinality:
                      value,
                  },
                })
              }}
            />

          </label>


          {/* ===============================================
              AJUDA MIN-MAX
              =============================================== */}

          <div className="info-card">

            <strong>
              Notação min–max
            </strong>

            <p>
              <code>(0,1)</code>
              {' '}
              — zero ou uma ocorrência.
            </p>

            <p>
              <code>(1,1)</code>
              {' '}
              — exatamente uma ocorrência.
            </p>

            <p>
              <code>(0,N)</code>
              {' '}
              — zero ou muitas ocorrências.
            </p>

            <p>
              <code>(1,N)</code>
              {' '}
              — uma ou muitas ocorrências.
            </p>

            <p>
              Também podem ser utilizados valores
              como
              {' '}
              <code>(4,N)</code>
              {' '}
              e
              {' '}
              <code>(2,5)</code>.
            </p>

          </div>

        </>

      )}

    </aside>
  )
}