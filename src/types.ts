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

  /* Atributos */
  primaryKey?: boolean
  multivalued?: boolean
  derived?: boolean

  /* Relacionamento identificador */
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

  showCardinality?: boolean
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