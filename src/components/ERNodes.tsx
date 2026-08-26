import {
  Handle,
  Position,
  type NodeProps,
} from '@xyflow/react'

import type { ERNode } from '../types'


/* =========================================================
   PONTOS DE CONEXÃO
   ========================================================= */

function ConnectionHandles() {
  return (
    <>
      {/* Superior */}
      <Handle
        id="top"
        type="source"
        position={Position.Top}
      />

      {/* Direita */}
      <Handle
        id="right"
        type="source"
        position={Position.Right}
      />

      {/* Inferior */}
      <Handle
        id="bottom"
        type="source"
        position={Position.Bottom}
      />

      {/* Esquerda */}
      <Handle
        id="left"
        type="source"
        position={Position.Left}
      />
    </>
  )
}


/* =========================================================
   ENTIDADE
   ========================================================= */

export function EntityNode({
  data,
  selected,
}: NodeProps<ERNode>) {
  return (
    <div
      className={[
        'er-node',
        'entity-node',
        selected ? 'selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ConnectionHandles />

      <strong>
        {data.label}
      </strong>
    </div>
  )
}


/* =========================================================
   ENTIDADE FRACA
   ========================================================= */

export function WeakEntityNode({
  data,
  selected,
}: NodeProps<ERNode>) {
  return (
    <div
      className={[
        'er-node',
        'entity-node',
        'weak-entity-node',
        selected ? 'selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ConnectionHandles />

      <div className="weak-inner">
        <strong>
          {data.label}
        </strong>
      </div>
    </div>
  )
}


/* =========================================================
   ATRIBUTO
   ========================================================= */

export function AttributeNode({
  data,
  selected,
}: NodeProps<ERNode>) {
  return (
    <div
      className={[
        'er-node',
        'attribute-node',

        data.multivalued
          ? 'multivalued'
          : '',

        data.derived
          ? 'derived'
          : '',

        selected
          ? 'selected'
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ConnectionHandles />

      <span
        className={[
          'attribute-label',

          data.primaryKey
            ? 'primary-key'
            : '',

          data.partialKey
            ? 'partial-key'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {data.label}
      </span>
    </div>
  )
}


/* =========================================================
   RELACIONAMENTO
   ========================================================= */

export function RelationshipNode({
  data,
  selected,
}: NodeProps<ERNode>) {
  return (
    <div
      className={[
        'relationship-wrap',
        selected ? 'selected' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <ConnectionHandles />

      <div
        className={[
          'relationship-diamond',

          data.identifying
            ? 'identifying'
            : '',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span>
          {data.label}
        </span>
      </div>
    </div>
  )
}