import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react'

import type {
  Cardinality,
  EREdge,
  MaximumCardinality,
} from '../types'


/* =========================================================
   CONVERSÃO DE CARDINALIDADE ANTIGA
   ========================================================= */

/*
 * Alguns diagramas antigos podem ainda possuir:
 *
 * 1
 * N
 * 0..1
 * 1..1
 * 0..N
 * 1..N
 *
 * Esta função ajuda a manter a exibição compatível.
 */

function getLegacyMaximum(
  value:
    Cardinality |
    undefined,
): MaximumCardinality | undefined {

  if (value === '1') {
    return '1'
  }

  if (
    value === 'N' ||
    value === '0..N' ||
    value === '1..N'
  ) {
    return 'N'
  }

  if (
    value === '0..1' ||
    value === '1..1'
  ) {
    return '1'
  }

  return undefined
}


/* =========================================================
   FORMATAÇÃO DA CARDINALIDADE
   ========================================================= */

function formatCardinality(
  data:
    EREdge['data'],
) {

  if (!data) {
    return '1'
  }


  const mode =
    data.cardinalityMode ??
    'maximum'


  /* =====================================================
     MODO: SOMENTE CARDINALIDADE MÁXIMA
     ===================================================== */

  if (mode === 'maximum') {

    /*
     * Formato atual:
     *
     * 1
     * N
     * M
     */

    if (data.cardinality) {
      return data.cardinality
    }


    /*
     * Compatibilidade com a versão intermediária,
     * que armazenava o máximo em
     * maximumCardinality.
     */

    if (
      data.maximumCardinality === '1' ||
      data.maximumCardinality === 'N' ||
      data.maximumCardinality === 'M'
    ) {
      return data.maximumCardinality
    }


    /*
     * Compatibilidade com versões antigas.
     *
     * Escolhemos o campo correspondente ao lado
     * da entidade.
     */

    const legacyValue =
      data.cardinalityEndpoint === 'target'
        ? data.targetCardinality
        : data.sourceCardinality


    return (
      getLegacyMaximum(
        legacyValue,
      ) ??
      '1'
    )
  }


  /* =====================================================
     MODO: CARDINALIDADE MÍNIMA E MÁXIMA
     ===================================================== */

  const minimum =
    data.minimumCardinality ??
    '0'


  const maximum =
    data.maximumCardinality ??
    '1'


  /*
   * Notação Navathe:
   *
   * (0,1)
   * (1,1)
   * (0,N)
   * (1,N)
   * (4,N)
   * (2,5)
   */

  return `(${minimum},${maximum})`
}


/* =========================================================
   COMPONENTE DA ARESTA
   ========================================================= */

export function EREdgeComponent({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
  markerEnd,
  markerStart,
  style,
  selected,
}: EdgeProps<EREdge>) {

  /* =======================================================
     CAMINHO DA LIGAÇÃO
     ======================================================= */

  const [edgePath] =
    getStraightPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    })


  /* =======================================================
     POSIÇÃO DA CARDINALIDADE PRÓXIMA DA ORIGEM
     ======================================================= */

  const sourceLabelX =
    sourceX +
    (
      targetX -
      sourceX
    ) *
    0.18


  const sourceLabelY =
    sourceY +
    (
      targetY -
      sourceY
    ) *
    0.18


  /* =======================================================
     POSIÇÃO DA CARDINALIDADE PRÓXIMA DO DESTINO
     ======================================================= */

  const targetLabelX =
    sourceX +
    (
      targetX -
      sourceX
    ) *
    0.82


  const targetLabelY =
    sourceY +
    (
      targetY -
      sourceY
    ) *
    0.82


  /* =======================================================
     CONFIGURAÇÕES DA ARESTA
     ======================================================= */

  const showCardinality =
    data?.showCardinality ??
    false


  const dashed =
    data?.dashed ??
    false


  /*
   * Indica em qual extremidade está a entidade.
   *
   * A cardinalidade sempre aparece próxima
   * da entidade.
   */

  const endpoint =
    data?.cardinalityEndpoint ??
    'source'


  const cardinality =
    formatCardinality(
      data,
    )


  return (
    <>

      {/* ===================================================
          LINHA DA LIGAÇÃO
          =================================================== */}

      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={{
          ...style,

          strokeWidth:
            selected
              ? 3
              : 2,

          strokeDasharray:
            dashed
              ? '2 7'
              : undefined,

          strokeLinecap:
            'round',
        }}
      />


      {/* ===================================================
          CARDINALIDADE
          =================================================== */}

      {showCardinality && (
        <EdgeLabelRenderer>

          {/* ===============================================
              ENTIDADE NA ORIGEM
              =============================================== */}

          {endpoint === 'source' && (
            <div
              className="edge-cardinality"
              style={{
                transform:
                  `translate(-50%, -50%) translate(${sourceLabelX}px, ${sourceLabelY}px)`,
              }}
            >
              {cardinality}
            </div>
          )}


          {/* ===============================================
              ENTIDADE NO DESTINO
              =============================================== */}

          {endpoint === 'target' && (
            <div
              className="edge-cardinality"
              style={{
                transform:
                  `translate(-50%, -50%) translate(${targetLabelX}px, ${targetLabelY}px)`,
              }}
            >
              {cardinality}
            </div>
          )}

        </EdgeLabelRenderer>
      )}

    </>
  )
}