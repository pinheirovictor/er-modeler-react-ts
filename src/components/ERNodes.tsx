import { Handle, Position, type NodeProps } from '@xyflow/react'
import type { ERNode } from '../types'

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

export function EntityNode({ data, selected }: NodeProps<ERNode>) {
  return (
    <div className={`er-node entity-node ${selected ? 'selected' : ''}`}>
      <ConnectionHandles />
      <strong>{data.label}</strong>
    </div>
  )
}

export function WeakEntityNode({ data, selected }: NodeProps<ERNode>) {
  return (
    <div className={`er-node entity-node weak-entity-node ${selected ? 'selected' : ''}`}>
      <ConnectionHandles />
      <div className="weak-inner"><strong>{data.label}</strong></div>
    </div>
  )
}

export function AttributeNode({ data, selected }: NodeProps<ERNode>) {
  return (
    <div
      className={[
        'er-node',
        'attribute-node',
        data.multivalued ? 'multivalued' : '',
        data.derived ? 'derived' : '',
        selected ? 'selected' : '',
      ].join(' ')}
    >
      <ConnectionHandles />
      <span className={data.primaryKey ? 'primary-key' : ''}>{data.label}</span>
    </div>
  )
}

export function RelationshipNode({ data, selected }: NodeProps<ERNode>) {
  return (
    <div className={`relationship-wrap ${selected ? 'selected' : ''}`}>
      <ConnectionHandles />
      <div className={`relationship-diamond ${data.identifying ? 'identifying' : ''}`}>
        <span>{data.label}</span>
      </div>
    </div>
  )
}

// export function IsaNode({ data, selected }: NodeProps<ERNode>) {
//   return (
//     <div className={`isa-wrap ${selected ? 'selected' : ''}`}>
//       <ConnectionHandles />
//       <div className="isa-triangle"><span>{data.label || 'ISA'}</span></div>
//     </div>
//   )
// }
