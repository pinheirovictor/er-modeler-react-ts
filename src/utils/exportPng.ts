import {
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react'

import { toPng } from 'html-to-image'

import type { ERNode } from '../types'


const IMAGE_WIDTH_MIN = 800
const IMAGE_HEIGHT_MIN = 600
const PADDING = 80


function sanitizeFileName(
  name: string,
) {
  return (
    name
      .trim()
      .normalize('NFD')
      .replace(
        /[\u0300-\u036f]/g,
        '',
      )
      .replace(
        /[^a-zA-Z0-9-_]+/g,
        '-',
      )
      .replace(
        /-+/g,
        '-',
      )
      .replace(
        /^-|-$/g,
        '',
      )
      .toLowerCase() ||
    'diagrama-er'
  )
}


export async function exportDiagramAsPng(
  nodes: ERNode[],
  diagramName: string,
) {

  /* =====================================================
     VERIFICA SE EXISTEM ELEMENTOS
     ===================================================== */

  if (nodes.length === 0) {
    window.alert(
      'O diagrama está vazio. Adicione elementos antes de exportar.',
    )

    return
  }


  /* =====================================================
     LOCALIZA O VIEWPORT DO REACT FLOW
     ===================================================== */

  const viewport =
    document.querySelector(
      '.react-flow__viewport',
    ) as HTMLElement | null


  if (!viewport) {
    throw new Error(
      'Viewport do React Flow não encontrado.',
    )
  }


  /* =====================================================
     CALCULA OS LIMITES DE TODOS OS ELEMENTOS
     ===================================================== */

  const nodesBounds =
    getNodesBounds(nodes)


  /*
   * Acrescentamos espaço nas bordas
   * para evitar elementos colados
   * nas extremidades da imagem.
   */

  const imageWidth =
    Math.max(
      Math.ceil(
        nodesBounds.width +
        PADDING * 2,
      ),
      IMAGE_WIDTH_MIN,
    )


  const imageHeight =
    Math.max(
      Math.ceil(
        nodesBounds.height +
        PADDING * 2,
      ),
      IMAGE_HEIGHT_MIN,
    )


  /* =====================================================
     CALCULA O ZOOM NECESSÁRIO
     ===================================================== */

  const transform =
    getViewportForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,

      // zoom mínimo
      0.1,

      // zoom máximo
      2,

      // padding proporcional
      0.1,
    )


  /* =====================================================
     GERA O PNG
     ===================================================== */

  const dataUrl =
    await toPng(
      viewport,
      {
        backgroundColor:
          '#ffffff',

        width:
          imageWidth,

        height:
          imageHeight,

        pixelRatio:
          2,

        cacheBust:
          true,

        style: {
          width:
            `${imageWidth}px`,

          height:
            `${imageHeight}px`,

          transform:
            `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
        },

        filter:
          (
            node:
              HTMLElement,
          ) => {

            /*
             * Não exporta os pontos
             * de conexão.
             */

            if (
              node.classList?.contains(
                'react-flow__handle',
              )
            ) {
              return false
            }


            return true
          },
      },
    )


  /* =====================================================
     DOWNLOAD
     ===================================================== */

  const anchor =
    document.createElement(
      'a',
    )


  anchor.download =
    `${sanitizeFileName(
      diagramName,
    )}.png`


  anchor.href =
    dataUrl


  document.body.appendChild(
    anchor,
  )


  anchor.click()


  document.body.removeChild(
    anchor,
  )
}