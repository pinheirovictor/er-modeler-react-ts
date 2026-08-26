import {
  getNodesBounds,
  getViewportForBounds,
} from '@xyflow/react'

import {
  toPng,
} from 'html-to-image'

import {
  jsPDF,
} from 'jspdf'

import type {
  ERNode,
} from '../types'


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

/*
 * Margem interna da imagem exportada.
 *
 * Essa margem é calculada em pixels no tamanho
 * da imagem que será enviada ao PDF.
 */
const IMAGE_PADDING =
  30


/*
 * Padding utilizado pelo getViewportForBounds.
 *
 * IMPORTANTE:
 *
 * Não utilizar IMAGE_PADDING aqui diretamente.
 *
 * Um valor como 30 faria o React Flow aplicar
 * um espaçamento gigantesco, deixando o DER
 * minúsculo.
 *
 * 0.04 produz uma margem pequena ao redor
 * do modelo e mantém o diagrama grande.
 */
const FIT_PADDING =
  0.04


/*
 * Qualidade da imagem antes de entrar no PDF.
 */
const EXPORT_PIXEL_RATIO =
  2


/*
 * Margem física do PDF em milímetros.
 */
const PDF_MARGIN =
  8


/* =========================================================
   SANITIZAR NOME DO ARQUIVO
   ========================================================= */

function sanitizeFileName(
  value: string,
) {
  return (
    value
      .trim()
      .replace(
        /[^a-zA-Z0-9_-]+/g,
        '-',
      ) ||
    'modelo-er'
  )
}


/* =========================================================
   EXPORTAR DIAGRAMA COMO PDF
   ========================================================= */

export async function exportDiagramAsPdf(
  nodes: ERNode[],
  diagramName: string,
) {

  /* =======================================================
     VALIDAR DIAGRAMA
     ======================================================= */

  if (
    nodes.length ===
    0
  ) {
    throw new Error(
      'Não há elementos para exportar.',
    )
  }


  /* =======================================================
     LOCALIZAR VIEWPORT DO REACT FLOW
     ======================================================= */

  const viewportElement =
    document.querySelector(
      '.react-flow__viewport',
    ) as HTMLElement | null


  if (
    !viewportElement
  ) {
    throw new Error(
      'Viewport do React Flow não encontrado.',
    )
  }


  /* =======================================================
     CALCULAR LIMITES DO DIAGRAMA
     ======================================================= */

  const nodesBounds =
    getNodesBounds(
      nodes,
    )


  /*
   * Dimensão da imagem baseada SOMENTE
   * no conteúdo real do DER.
   *
   * Isso evita capturar todo o canvas vazio.
   */

  const imageWidth =
    Math.max(
      Math.ceil(
        nodesBounds.width +
        IMAGE_PADDING * 2,
      ),
      1,
    )


  const imageHeight =
    Math.max(
      Math.ceil(
        nodesBounds.height +
        IMAGE_PADDING * 2,
      ),
      1,
    )


  /* =======================================================
     CALCULAR ENQUADRAMENTO
     ======================================================= */

  const viewport =
    getViewportForBounds(
      nodesBounds,

      imageWidth,
      imageHeight,

      /*
       * Zoom mínimo.
       */
      0.1,

      /*
       * Zoom máximo.
       *
       * Permite ampliar modelos pequenos.
       */
      2.5,

      /*
       * Pequeno padding relativo.
       *
       * O erro anterior estava aqui:
       * era usado IMAGE_PADDING / 2 = 30.
       */
      FIT_PADDING,
    )


  /* =======================================================
     GERAR IMAGEM TEMPORÁRIA
     ======================================================= */

  const dataUrl =
    await toPng(
      viewportElement,
      {
        backgroundColor:
          '#ffffff',

        width:
          imageWidth,

        height:
          imageHeight,

        pixelRatio:
          EXPORT_PIXEL_RATIO,

        cacheBust:
          true,

        style: {
          width:
            `${imageWidth}px`,

          height:
            `${imageHeight}px`,

          transform:
            `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,

          transformOrigin:
            '0 0',
        },


        /* =================================================
           ELEMENTOS NÃO EXPORTADOS
           ================================================= */

        filter: (
          domNode,
        ) => {

          if (
            domNode instanceof
            HTMLElement
          ) {

            /*
             * Pontos azuis de conexão.
             */

            if (
              domNode
                .classList
                .contains(
                  'react-flow__handle',
                )
            ) {
              return false
            }

          }

          return true
        },
      },
    )


  /* =======================================================
     ORIENTAÇÃO DO PDF
     ======================================================= */

  const orientation:
    'portrait' |
    'landscape' =
    imageWidth >=
    imageHeight
      ? 'landscape'
      : 'portrait'


  /* =======================================================
     CRIAR PDF
     ======================================================= */

  const pdf =
    new jsPDF({
      orientation,

      unit:
        'mm',

      format:
        'a4',

      compress:
        true,
    })


  /* =======================================================
     DIMENSÕES DA PÁGINA
     ======================================================= */

  const pageWidth =
    pdf
      .internal
      .pageSize
      .getWidth()


  const pageHeight =
    pdf
      .internal
      .pageSize
      .getHeight()


  /* =======================================================
     ÁREA DISPONÍVEL
     ======================================================= */

  const availableWidth =
    pageWidth -
    PDF_MARGIN * 2


  const availableHeight =
    pageHeight -
    PDF_MARGIN * 2


  /* =======================================================
     PROPORÇÃO DO DIAGRAMA
     ======================================================= */

  const imageRatio =
    imageWidth /
    imageHeight


  const availableRatio =
    availableWidth /
    availableHeight


  let pdfImageWidth =
    availableWidth


  let pdfImageHeight =
    availableHeight


  /*
   * Mantemos a proporção original.
   *
   * O DER ocupará o máximo possível da página
   * sem sofrer deformação.
   */

  if (
    imageRatio >
    availableRatio
  ) {

    /*
     * Modelo mais horizontal.
     */

    pdfImageWidth =
      availableWidth

    pdfImageHeight =
      pdfImageWidth /
      imageRatio

  } else {

    /*
     * Modelo mais vertical.
     */

    pdfImageHeight =
      availableHeight

    pdfImageWidth =
      pdfImageHeight *
      imageRatio

  }


  /* =======================================================
     CENTRALIZAR NA PÁGINA
     ======================================================= */

  const x =
    (
      pageWidth -
      pdfImageWidth
    ) /
    2


  const y =
    (
      pageHeight -
      pdfImageHeight
    ) /
    2


  /* =======================================================
     INSERIR DIAGRAMA
     ======================================================= */

  pdf.addImage(
    dataUrl,

    'PNG',

    x,
    y,

    pdfImageWidth,
    pdfImageHeight,

    undefined,

    'FAST',
  )


  /* =======================================================
     METADADOS
     ======================================================= */

  pdf.setProperties({
    title:
      diagramName ||
      'Modelo ER',

    subject:
      'Diagrama Entidade-Relacionamento',

    creator:
      'DERLab',

    author:
      'DERLab',
  })


  /* =======================================================
     SALVAR
     ======================================================= */

  pdf.save(
    `${sanitizeFileName(
      diagramName,
    )}.pdf`,
  )
}