import type {
  Edge,
  Node,
} from '@xyflow/react'


/* =========================================================
   TIPOS DE ELEMENTOS DO MODELO ER
   ========================================================= */

export type ERNodeKind =
  | 'entity'
  | 'weakEntity'
  | 'attribute'
  | 'relationship'


/* =========================================================
   CARDINALIDADES
   ========================================================= */

export type Cardinality =
  | '1'
  | 'N'
  | '0..1'
  | '1..1'
  | '0..N'
  | '1..N'


/* =========================================================
   DADOS DOS NÓS
   ========================================================= */

export type ERNodeData = {
  label: string
  kind: ERNodeKind

  /* =====================================================
     PROPRIEDADES DE ATRIBUTOS
     ===================================================== */

  /* Chave primária */
  primaryKey?: boolean

  /* Chave parcial / discriminadora de entidade fraca */
  partialKey?: boolean

  /* Atributo multivalorado */
  multivalued?: boolean

  /* Atributo derivado */
  derived?: boolean


  /* =====================================================
     PROPRIEDADES DE RELACIONAMENTOS
     ===================================================== */

  /* Relacionamento identificador de entidade fraca */
  identifying?: boolean
}


/* =========================================================
   NÓ DO REACT FLOW
   ========================================================= */

export type ERNode =
  Node<
    ERNodeData,
    ERNodeKind
  >


/* =========================================================
   DADOS DAS LIGAÇÕES
   ========================================================= */

export type EREdgeData = {
  sourceCardinality: Cardinality
  targetCardinality: Cardinality

  /* Exibe ou oculta as cardinalidades */
  showCardinality?: boolean

  /* Ligação tracejada, usada atualmente em atributo derivado */
  dashed?: boolean
}


/* =========================================================
   ARESTA DO REACT FLOW
   ========================================================= */

export type EREdge =
  Edge<
    EREdgeData,
    'erEdge'
  >


/* =========================================================
   ARQUIVO DO DIAGRAMA
   ========================================================= */

export type ERDiagram = {
  version: 1
  name: string
  nodes: ERNode[]
  edges: EREdge[]
}