import {
  BaseEdge,
  EdgeLabelRenderer,
  getStraightPath,
  type EdgeProps,
} from '@xyflow/react'

import type { EREdge } from '../types'

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

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  })

  const sourceLabelX =
    sourceX + (targetX - sourceX) * 0.16

  const sourceLabelY =
    sourceY + (targetY - sourceY) * 0.16

  const targetLabelX =
    sourceX + (targetX - sourceX) * 0.84

  const targetLabelY =
    sourceY + (targetY - sourceY) * 0.84

  const showCardinality =
    data?.showCardinality ?? true

  const dashed =
    data?.dashed ?? false

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerStart={markerStart}
        markerEnd={markerEnd}
        style={{
          ...style,

          strokeWidth:
            selected ? 3 : 2,

          strokeDasharray:
            dashed ? '2 7' : undefined,

          strokeLinecap:
            'round',
        }}
      />

      {showCardinality && (
        <EdgeLabelRenderer>

          <div
            className="edge-cardinality"
            style={{
              transform:
                `translate(-50%, -50%) translate(${sourceLabelX}px, ${sourceLabelY}px)`,
            }}
          >
            {data?.sourceCardinality ?? '1..1'}
          </div>

          <div
            className="edge-cardinality"
            style={{
              transform:
                `translate(-50%, -50%) translate(${targetLabelX}px, ${targetLabelY}px)`,
            }}
          >
            {data?.targetCardinality ?? '0..N'}
          </div>

        </EdgeLabelRenderer>
      )}
    </>
  )
}