import {
  Background,
  ConnectionMode,
  Controls,
  MiniMap,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type ReactFlowInstance,
} from '@xyflow/react'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

import { EREdgeComponent } from './components/EREdge'

import {
  AttributeNode,
  EntityNode,
  RelationshipNode,
  WeakEntityNode,
} from './components/ERNodes'

import { Inspector } from './components/Inspector'
import { Palette } from './components/Palette'
import { Toolbar } from './components/Toolbar'

import type {
  ERDiagram,
  EREdge,
  ERNode,
  ERNodeKind,
} from './types'


/* =========================================================
   CONFIGURAÇÃO
   ========================================================= */

const STORAGE_KEY = 'er-studio-diagram-v1'

const MAX_HISTORY = 100


/* =========================================================
   TIPOS AUXILIARES
   ========================================================= */

type DiagramSnapshot = {
  name: string
  nodes: ERNode[]
  edges: EREdge[]
}

type DiagramClipboard = {
  nodes: ERNode[]
  edges: EREdge[]
}

type CardinalityValue =
  | '0..1'
  | '1'
  | '0..N'
  | '1..N'
  | 'N'

type HandleSide =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'


/* =========================================================
   DIAGRAMA VAZIO
   ========================================================= */

function getEmptyDiagram(): ERDiagram {
  return {
    version: 1,
    name: 'Novo Modelo ER',
    nodes: [],
    edges: [],
  }
}


/* =========================================================
   HELPERS DAS ARESTAS DO EXEMPLO
   ========================================================= */

function createAttributeEdge(
  id: string,
  source: string,
  target: string,
  sourceHandle: HandleSide,
  targetHandle: HandleSide,
): EREdge {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'erEdge',

    data: {
      sourceCardinality: '1',
      targetCardinality: '1',
      showCardinality: false,
    },
  }
}


function createRelationshipEdge(
  id: string,
  source: string,
  target: string,
  cardinality: CardinalityValue,
  sourceHandle: HandleSide,
  targetHandle: HandleSide,
): EREdge {
  return {
    id,
    source,
    target,
    sourceHandle,
    targetHandle,
    type: 'erEdge',

    /*
     * Usamos o mesmo valor nas duas extremidades porque
     * o componente atual da aresta trabalha com
     * sourceCardinality e targetCardinality.
     *
     * A cardinalidade conceitualmente relevante é
     * a que está associada à entidade.
     */
    data: {
      sourceCardinality: cardinality,
      targetCardinality: cardinality,
      showCardinality: true,
    },
  }
}


/* =========================================================
   EXEMPLO TECHMASTER
   ========================================================= */

const exampleNodes: ERNode[] = [

  /* =====================================================
     ENTIDADES
     ===================================================== */

  {
    id: 'aluno',
    type: 'entity',

    position: {
      x: 180,
      y: 280,
    },

    data: {
      label: 'ALUNO',
      kind: 'entity',
    },
  },

  {
    id: 'curso',
    type: 'entity',

    position: {
      x: 1050,
      y: 210,
    },

    data: {
      label: 'CURSO',
      kind: 'entity',
    },
  },

  {
    id: 'professor',
    type: 'entity',

    position: {
      x: 200,
      y: 680,
    },

    data: {
      label: 'PROFESSOR',
      kind: 'entity',
    },
  },

  {
    id: 'turma',
    type: 'entity',

    position: {
      x: 1050,
      y: 680,
    },

    data: {
      label: 'TURMA',
      kind: 'entity',
    },
  },


  /* =====================================================
     RELACIONAMENTOS
     ===================================================== */

  {
    id: 'matricula',
    type: 'relationship',

    position: {
      x: 610,
      y: 350,
    },

    data: {
      label: 'MATRÍCULA',
      kind: 'relationship',
    },
  },

  {
    id: 'leciona',
    type: 'relationship',

    position: {
      x: 620,
      y: 670,
    },

    data: {
      label: 'LECIONA',
      kind: 'relationship',
    },
  },

  {
    id: 'pertence',
    type: 'relationship',

    position: {
      x: 1045,
      y: 465,
    },

    data: {
      label: 'PERTENCE',
      kind: 'relationship',
    },
  },


  /* =====================================================
     ATRIBUTOS DE ALUNO
     ===================================================== */

  {
    id: 'aluno-cpf',
    type: 'attribute',

    position: {
      x: 0,
      y: 100,
    },

    data: {
      label: 'CPF',
      kind: 'attribute',
      primaryKey: true,
    },
  },

  {
    id: 'aluno-nome',
    type: 'attribute',

    position: {
      x: 0,
      y: 210,
    },

    data: {
      label: 'Nome',
      kind: 'attribute',
    },
  },

  {
    id: 'aluno-data-nascimento',
    type: 'attribute',

    position: {
      x: 0,
      y: 325,
    },

    data: {
      label: 'DataNascimento',
      kind: 'attribute',
    },
  },

  {
    id: 'aluno-email',
    type: 'attribute',

    position: {
      x: 0,
      y: 440,
    },

    data: {
      label: 'Email',
      kind: 'attribute',
    },
  },


  /* =====================================================
     ATRIBUTOS DE CURSO
     ===================================================== */

  {
    id: 'curso-id',
    type: 'attribute',

    position: {
      x: 820,
      y: 20,
    },

    data: {
      label: 'ID_Curso',
      kind: 'attribute',
      primaryKey: true,
    },
  },

  {
    id: 'curso-nome',
    type: 'attribute',

    position: {
      x: 1000,
      y: 10,
    },

    data: {
      label: 'Nome',
      kind: 'attribute',
    },
  },

  {
    id: 'curso-carga',
    type: 'attribute',

    position: {
      x: 1190,
      y: 25,
    },

    data: {
      label: 'CargaHoraria',
      kind: 'attribute',
    },
  },

  {
    id: 'curso-nivel',
    type: 'attribute',

    position: {
      x: 1320,
      y: 135,
    },

    data: {
      label: 'Nivel',
      kind: 'attribute',
    },
  },

  {
    id: 'curso-area',
    type: 'attribute',

    position: {
      x: 1320,
      y: 250,
    },

    data: {
      label: 'Area',
      kind: 'attribute',
    },
  },


  /* =====================================================
     ATRIBUTOS DE PROFESSOR
     ===================================================== */

  {
    id: 'professor-cpf',
    type: 'attribute',

    position: {
      x: 20,
      y: 570,
    },

    data: {
      label: 'CPF',
      kind: 'attribute',
      primaryKey: true,
    },
  },

  {
    id: 'professor-nome',
    type: 'attribute',

    position: {
      x: 20,
      y: 680,
    },

    data: {
      label: 'Nome',
      kind: 'attribute',
    },
  },

  {
    id: 'professor-especialidade',
    type: 'attribute',

    position: {
      x: 20,
      y: 790,
    },

    data: {
      label: 'Especialidade',
      kind: 'attribute',
    },
  },


  /* =====================================================
     ATRIBUTOS DE TURMA
     ===================================================== */

  {
    id: 'turma-id',
    type: 'attribute',

    position: {
      x: 1320,
      y: 530,
    },

    data: {
      label: 'ID_Turma',
      kind: 'attribute',
      primaryKey: true,
    },
  },

  {
    id: 'turma-data-inicio',
    type: 'attribute',

    position: {
      x: 1340,
      y: 640,
    },

    data: {
      label: 'DataInicio',
      kind: 'attribute',
    },
  },

  {
    id: 'turma-data-termino',
    type: 'attribute',

    position: {
      x: 1340,
      y: 750,
    },

    data: {
      label: 'DataTermino',
      kind: 'attribute',
    },
  },

  {
    id: 'turma-turno',
    type: 'attribute',

    position: {
      x: 1190,
      y: 850,
    },

    data: {
      label: 'Turno',
      kind: 'attribute',
    },
  },


  /* =====================================================
     ATRIBUTOS DE MATRÍCULA
     ===================================================== */

  {
    id: 'matricula-data',
    type: 'attribute',

    position: {
      x: 500,
      y: 490,
    },

    data: {
      label: 'DataMatricula',
      kind: 'attribute',
    },
  },

  {
    id: 'matricula-nota',
    type: 'attribute',

    position: {
      x: 710,
      y: 490,
    },

    data: {
      label: 'NotaFinal',
      kind: 'attribute',
    },
  },
]


/* =========================================================
   LIGAÇÕES DO EXEMPLO
   ========================================================= */

const exampleEdges: EREdge[] = [

  /* =====================================================
     ATRIBUTOS DE ALUNO
     ===================================================== */

  createAttributeEdge(
    'e-aluno-cpf',
    'aluno',
    'aluno-cpf',
    'left',
    'right',
  ),

  createAttributeEdge(
    'e-aluno-nome',
    'aluno',
    'aluno-nome',
    'left',
    'right',
  ),

  createAttributeEdge(
    'e-aluno-data',
    'aluno',
    'aluno-data-nascimento',
    'left',
    'right',
  ),

  createAttributeEdge(
    'e-aluno-email',
    'aluno',
    'aluno-email',
    'left',
    'right',
  ),


  /* =====================================================
     ATRIBUTOS DE CURSO
     ===================================================== */

  createAttributeEdge(
    'e-curso-id',
    'curso',
    'curso-id',
    'top',
    'bottom',
  ),

  createAttributeEdge(
    'e-curso-nome',
    'curso',
    'curso-nome',
    'top',
    'bottom',
  ),

  createAttributeEdge(
    'e-curso-carga',
    'curso',
    'curso-carga',
    'top',
    'bottom',
  ),

  createAttributeEdge(
    'e-curso-nivel',
    'curso',
    'curso-nivel',
    'right',
    'left',
  ),

  createAttributeEdge(
    'e-curso-area',
    'curso',
    'curso-area',
    'right',
    'left',
  ),


  /* =====================================================
     ATRIBUTOS DE PROFESSOR
     ===================================================== */

  createAttributeEdge(
    'e-professor-cpf',
    'professor',
    'professor-cpf',
    'left',
    'right',
  ),

  createAttributeEdge(
    'e-professor-nome',
    'professor',
    'professor-nome',
    'left',
    'right',
  ),

  createAttributeEdge(
    'e-professor-especialidade',
    'professor',
    'professor-especialidade',
    'left',
    'right',
  ),


  /* =====================================================
     ATRIBUTOS DE TURMA
     ===================================================== */

  createAttributeEdge(
    'e-turma-id',
    'turma',
    'turma-id',
    'right',
    'left',
  ),

  createAttributeEdge(
    'e-turma-data-inicio',
    'turma',
    'turma-data-inicio',
    'right',
    'left',
  ),

  createAttributeEdge(
    'e-turma-data-termino',
    'turma',
    'turma-data-termino',
    'right',
    'left',
  ),

  createAttributeEdge(
    'e-turma-turno',
    'turma',
    'turma-turno',
    'bottom',
    'top',
  ),


  /* =====================================================
     ATRIBUTOS DO RELACIONAMENTO MATRÍCULA
     ===================================================== */

  createAttributeEdge(
    'e-matricula-data',
    'matricula',
    'matricula-data',
    'bottom',
    'top',
  ),

  createAttributeEdge(
    'e-matricula-nota',
    'matricula',
    'matricula-nota',
    'bottom',
    'top',
  ),


  /* =====================================================
     ALUNO N : N TURMA

     Aluno participa de várias matrículas.
     Uma Turma possui vários alunos.
     ===================================================== */

  createRelationshipEdge(
    'e-aluno-matricula',
    'aluno',
    'matricula',
    'N',
    'right',
    'left',
  ),

  createRelationshipEdge(
    'e-turma-matricula',
    'turma',
    'matricula',
    'N',
    'top',
    'right',
  ),


  /* =====================================================
     PROFESSOR 1 : N TURMA
     ===================================================== */

  createRelationshipEdge(
    'e-professor-leciona',
    'professor',
    'leciona',
    '1',
    'right',
    'left',
  ),

  createRelationshipEdge(
    'e-turma-leciona',
    'turma',
    'leciona',
    'N',
    'left',
    'right',
  ),


  /* =====================================================
     CURSO 1 : N TURMA
     ===================================================== */

  createRelationshipEdge(
    'e-curso-pertence',
    'curso',
    'pertence',
    '1',
    'bottom',
    'top',
  ),

  createRelationshipEdge(
    'e-turma-pertence',
    'turma',
    'pertence',
    'N',
    'top',
    'bottom',
  ),
]


/* =========================================================
   O EXEMPLO É CARREGADO SOMENTE PELO BOTÃO EXEMPLO
   ========================================================= */

function getExample(): ERDiagram {
  return {
    version: 1,
    name: 'Exemplo - TechMaster',
    nodes: structuredClone(exampleNodes),
    edges: structuredClone(exampleEdges),
  }
}


/* =========================================================
   CARREGAR DIAGRAMA SALVO
   ========================================================= */

function loadDiagram(): ERDiagram | null {
  try {
    const stored =
      localStorage.getItem(STORAGE_KEY)

    if (!stored) {
      return null
    }

    const parsed =
      JSON.parse(stored) as ERDiagram

    if (
      parsed.version !== 1 ||
      !Array.isArray(parsed.nodes) ||
      !Array.isArray(parsed.edges)
    ) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}


/* =========================================================
   CRIAR NOVO ELEMENTO
   ========================================================= */

function makeNode(
  kind: ERNodeKind,
  index: number,
): ERNode {
  const labels: Record<ERNodeKind, string> = {
    entity: 'Nova Entidade',
    weakEntity: 'Entidade Fraca',
    attribute: 'novo_atributo',
    relationship: 'relaciona',
  }

  return {
    id: crypto.randomUUID(),

    type: kind,

    position: {
      x: 250 + (index % 4) * 55,
      y: 130 + (index % 5) * 45,
    },

    data: {
      label: labels[kind],
      kind,
    },
  }
}


/* =========================================================
   NOTAÇÃO DAS LIGAÇÕES
   ========================================================= */

function getEdgeNotation(
  sourceId: string | null | undefined,
  targetId: string | null | undefined,
  nodes: ERNode[],
) {
  const sourceNode =
    nodes.find(
      (node) =>
        node.id === sourceId,
    )

  const targetNode =
    nodes.find(
      (node) =>
        node.id === targetId,
    )

  const sourceKind =
    sourceNode?.data.kind

  const targetKind =
    targetNode?.data.kind


  const involvesDerivedAttribute =
    (
      sourceKind === 'attribute' &&
      sourceNode?.data.derived
    ) ||
    (
      targetKind === 'attribute' &&
      targetNode?.data.derived
    )


  const sourceIsEntity =
    sourceKind === 'entity' ||
    sourceKind === 'weakEntity'

  const targetIsEntity =
    targetKind === 'entity' ||
    targetKind === 'weakEntity'


  const isEntityRelationship =
    (
      sourceIsEntity &&
      targetKind === 'relationship'
    ) ||
    (
      sourceKind === 'relationship' &&
      targetIsEntity
    )


  return {
    showCardinality:
      isEntityRelationship,

    dashed:
      Boolean(
        involvesDerivedAttribute,
      ),
  }
}


/* =========================================================
   VALIDAÇÃO DAS CONEXÕES
   ========================================================= */

function isConnectionAllowed(
  sourceId: string | null | undefined,
  targetId: string | null | undefined,
  nodes: ERNode[],
) {
  if (
    !sourceId ||
    !targetId
  ) {
    return false
  }


  /*
   * Não conecta o elemento nele mesmo.
   */

  if (
    sourceId === targetId
  ) {
    return false
  }


  const sourceNode =
    nodes.find(
      (node) =>
        node.id === sourceId,
    )

  const targetNode =
    nodes.find(
      (node) =>
        node.id === targetId,
    )


  if (
    !sourceNode ||
    !targetNode
  ) {
    return false
  }


  const sourceKind =
    sourceNode.data.kind

  const targetKind =
    targetNode.data.kind


  const sourceIsEntity =
    sourceKind === 'entity' ||
    sourceKind === 'weakEntity'

  const targetIsEntity =
    targetKind === 'entity' ||
    targetKind === 'weakEntity'


  /* =====================================================
     ENTIDADE ↔ ENTIDADE = INVÁLIDO
     ===================================================== */

  if (
    sourceIsEntity &&
    targetIsEntity
  ) {
    return false
  }


  /* =====================================================
     RELACIONAMENTO ↔ RELACIONAMENTO = INVÁLIDO
     ===================================================== */

  if (
    sourceKind === 'relationship' &&
    targetKind === 'relationship'
  ) {
    return false
  }


  /*
   * Permitidos:
   *
   * Entidade ↔ Atributo
   * Entidade ↔ Relacionamento
   * Entidade Fraca ↔ Atributo
   * Entidade Fraca ↔ Relacionamento
   * Relacionamento ↔ Atributo
   * Atributo ↔ Atributo
   */

  return true
}


/* =========================================================
   COMPONENTE PRINCIPAL
   ========================================================= */

export default function App() {

  /* =======================================================
     ESTADO INICIAL

     Se houver trabalho salvo, restaura.
     Caso contrário, inicia em branco.

     O EXEMPLO NÃO É CARREGADO AQUI.
     ======================================================= */

  const initial =
    useMemo(
      () =>
        loadDiagram() ??
        getEmptyDiagram(),
      [],
    )


  const [
    diagramName,
    setDiagramName,
  ] =
    useState(initial.name)


  const [
    nodes,
    setNodes,
    onNodesChange,
  ] =
    useNodesState<ERNode>(
      initial.nodes,
    )


  const [
    edges,
    setEdges,
    onEdgesChange,
  ] =
    useEdgesState<EREdge>(
      initial.edges,
    )


  const [
    selectedNodeId,
    setSelectedNodeId,
  ] =
    useState<string>()


  const [
    selectedEdgeId,
    setSelectedEdgeId,
  ] =
    useState<string>()


  const [
    saved,
    setSaved,
  ] =
    useState(true)


  /* =======================================================
     REFS
     ======================================================= */

  const fileInputRef =
    useRef<HTMLInputElement>(
      null,
    )


  const reactFlowRef =
    useRef<
      ReactFlowInstance<
        ERNode,
        EREdge
      > | null
    >(null)


  const clipboardRef =
    useRef<DiagramClipboard>({
      nodes: [],
      edges: [],
    })


  const pasteCountRef =
    useRef(0)


  const historyRef =
    useRef<DiagramSnapshot[]>(
      [],
    )


  const futureRef =
    useRef<DiagramSnapshot[]>(
      [],
    )


  /* =======================================================
     TIPOS DE NÓ
     ======================================================= */

  const nodeTypes =
    useMemo(
      () => ({
        entity:
          EntityNode,

        weakEntity:
          WeakEntityNode,

        attribute:
          AttributeNode,

        relationship:
          RelationshipNode,
      }),
      [],
    )


  /* =======================================================
     TIPOS DE ARESTA
     ======================================================= */

  const edgeTypes =
    useMemo(
      () => ({
        erEdge:
          EREdgeComponent,
      }),
      [],
    )


  /* =======================================================
     SNAPSHOT ATUAL
     ======================================================= */

  const getCurrentSnapshot =
    useCallback(
      (): DiagramSnapshot => ({
        name:
          diagramName,

        nodes:
          structuredClone(nodes),

        edges:
          structuredClone(edges),
      }),
      [
        diagramName,
        nodes,
        edges,
      ],
    )


  /* =======================================================
     HISTÓRICO
     ======================================================= */

  const saveHistory =
    useCallback(() => {

      historyRef.current.push(
        getCurrentSnapshot(),
      )


      if (
        historyRef.current.length >
        MAX_HISTORY
      ) {
        historyRef.current.shift()
      }


      futureRef.current = []

    }, [
      getCurrentSnapshot,
    ])


  /* =======================================================
     APLICAR SNAPSHOT
     ======================================================= */

  const applySnapshot =
    useCallback(
      (
        snapshot:
          DiagramSnapshot,
      ) => {

        setDiagramName(
          snapshot.name,
        )


        setNodes(
          structuredClone(
            snapshot.nodes,
          ).map(
            (node) => ({
              ...node,
              selected: false,
            }),
          ),
        )


        setEdges(
          structuredClone(
            snapshot.edges,
          ).map(
            (edge) => ({
              ...edge,
              selected: false,
            }),
          ),
        )


        setSelectedNodeId(
          undefined,
        )

        setSelectedEdgeId(
          undefined,
        )

      },
      [
        setNodes,
        setEdges,
      ],
    )


  /* =======================================================
     AJUSTAR VISUALIZAÇÃO AO DIAGRAMA
     ======================================================= */

  const fitDiagram =
    useCallback(() => {

      window.setTimeout(
        () => {

          reactFlowRef.current?.fitView({
            padding: 0.12,
            duration: 350,
          })

        },
        50,
      )

    }, [])


  /* =======================================================
     AUTOSAVE
     ======================================================= */

  useEffect(() => {

    setSaved(false)


    const handle =
      window.setTimeout(
        () => {

          const diagram:
            ERDiagram = {

            version: 1,

            name:
              diagramName,

            nodes,

            edges,
          }


          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(
              diagram,
            ),
          )


          setSaved(true)

        },
        250,
      )


    return () =>
      window.clearTimeout(
        handle,
      )

  }, [
    diagramName,
    nodes,
    edges,
  ])


  /* =======================================================
     SALVAR MANUALMENTE
     Ctrl/Cmd + S
     ======================================================= */

  const saveDiagram =
    useCallback(() => {

      const diagram:
        ERDiagram = {

        version: 1,

        name:
          diagramName,

        nodes,

        edges,
      }


      localStorage.setItem(
        STORAGE_KEY,

        JSON.stringify(
          diagram,
        ),
      )


      setSaved(true)

    }, [
      diagramName,
      nodes,
      edges,
    ])


  /* =======================================================
     NOVA CONEXÃO
     ======================================================= */

  const onConnect =
    useCallback(
      (
        connection:
          Connection,
      ) => {

        if (
          !connection.source ||
          !connection.target
        ) {
          return
        }


        if (
          !isConnectionAllowed(
            connection.source,
            connection.target,
            nodes,
          )
        ) {
          return
        }


        saveHistory()


        const notation =
          getEdgeNotation(
            connection.source,
            connection.target,
            nodes,
          )


        setEdges(
          (current) =>
            addEdge<EREdge>(
              {
                ...connection,

                id:
                  crypto.randomUUID(),

                type:
                  'erEdge',

                data: {
                  sourceCardinality:
                    '1',

                  targetCardinality:
                    'N',

                  ...notation,
                },
              },

              current,
            ),
        )

      },
      [
        nodes,
        setEdges,
        saveHistory,
      ],
    )


  /* =======================================================
     ADICIONAR ELEMENTO
     ======================================================= */

  const addNode =
    useCallback(
      (
        kind:
          ERNodeKind,
      ) => {

        saveHistory()


        const node =
          makeNode(
            kind,
            nodes.length,
          )


        setNodes(
          (current) => [

            ...current.map(
              (item) => ({
                ...item,
                selected: false,
              }),
            ),

            {
              ...node,
              selected: true,
            },
          ],
        )


        setEdges(
          (current) =>
            current.map(
              (edge) => ({
                ...edge,
                selected: false,
              }),
            ),
        )


        setSelectedNodeId(
          node.id,
        )

        setSelectedEdgeId(
          undefined,
        )

      },
      [
        nodes.length,
        setNodes,
        setEdges,
        saveHistory,
      ],
    )


  /* =======================================================
     SUBSTITUIR DIAGRAMA
     ======================================================= */

  const setDiagram =
    useCallback(
      (
        diagram:
          ERDiagram,
        shouldFit = true,
      ) => {

        saveHistory()


        setDiagramName(
          diagram.name,
        )


        setNodes(
          structuredClone(
            diagram.nodes,
          ).map(
            (node) => ({
              ...node,
              selected: false,
            }),
          ),
        )


        setEdges(
          structuredClone(
            diagram.edges,
          ).map(
            (edge) => ({
              ...edge,
              selected: false,
            }),
          ),
        )


        setSelectedNodeId(
          undefined,
        )

        setSelectedEdgeId(
          undefined,
        )


        pasteCountRef.current =
          0


        if (
          shouldFit &&
          diagram.nodes.length > 0
        ) {
          fitDiagram()
        }

      },
      [
        setNodes,
        setEdges,
        saveHistory,
        fitDiagram,
      ],
    )


  /* =======================================================
     NOVO DIAGRAMA
     ======================================================= */

  const newDiagram =
    useCallback(() => {

      if (
        (
          nodes.length > 0 ||
          edges.length > 0
        ) &&
        !window.confirm(
          'Criar um novo diagrama em branco? O modelo atual será substituído.',
        )
      ) {
        return
      }


      setDiagram(
        getEmptyDiagram(),
        false,
      )

    }, [
      nodes.length,
      edges.length,
      setDiagram,
    ])


  /* =======================================================
     CARREGAR EXEMPLO TECHMASTER

     SOMENTE executado quando o usuário
     pressiona o botão "Exemplo".
     ======================================================= */

  const loadExample =
    useCallback(() => {

      if (
        (
          nodes.length > 0 ||
          edges.length > 0
        ) &&
        !window.confirm(
          'Carregar o exemplo TechMaster? O diagrama atual será substituído.',
        )
      ) {
        return
      }


      setDiagram(
        getExample(),
        true,
      )

    }, [
      nodes.length,
      edges.length,
      setDiagram,
    ])


  /* =======================================================
     EXPORTAR JSON
     ======================================================= */

  const exportDiagram =
    useCallback(() => {

      const diagram:
        ERDiagram = {

        version: 1,

        name:
          diagramName,

        nodes,

        edges,
      }


      const blob =
        new Blob(
          [
            JSON.stringify(
              diagram,
              null,
              2,
            ),
          ],
          {
            type:
              'application/json',
          },
        )


      const url =
        URL.createObjectURL(
          blob,
        )


      const anchor =
        document.createElement(
          'a',
        )


      anchor.href =
        url


      anchor.download =
        `${diagramName
          .trim()
          .replace(
            /[^a-zA-Z0-9_-]+/g,
            '-',
          ) ||
        'modelo-er'
        }.json`


      anchor.click()


      URL.revokeObjectURL(
        url,
      )

    }, [
      diagramName,
      nodes,
      edges,
    ])


  /* =======================================================
     IMPORTAR JSON
     ======================================================= */

  const importDiagram =
    useCallback(() => {

      fileInputRef.current?.click()

    }, [])


  const onImportFile =
    useCallback(
      async (
        file?: File,
      ) => {

        if (!file) {
          return
        }


        try {

          const parsed =
            JSON.parse(
              await file.text(),
            ) as ERDiagram


          if (
            parsed.version !== 1 ||
            !Array.isArray(
              parsed.nodes,
            ) ||
            !Array.isArray(
              parsed.edges,
            )
          ) {
            throw new Error(
              'Formato incompatível',
            )
          }


          setDiagram(
            {
              ...parsed,

              name:
                parsed.name ||
                'Modelo importado',
            },
            true,
          )

        } catch {

          window.alert(
            'Não foi possível importar o arquivo. Verifique se ele foi exportado pela Ferramenta.',
          )

        } finally {

          if (
            fileInputRef.current
          ) {
            fileInputRef.current.value =
              ''
          }

        }

      },
      [
        setDiagram,
      ],
    )


  /* =======================================================
     ELEMENTOS SELECIONADOS
     ======================================================= */

  const getSelectedNodeIds =
    useCallback(() => {

      return new Set(
        nodes

          .filter(
            (node) =>
              node.selected ||
              node.id ===
              selectedNodeId,
          )

          .map(
            (node) =>
              node.id,
          ),
      )

    }, [
      nodes,
      selectedNodeId,
    ])


  const getSelectedEdgeIds =
    useCallback(() => {

      return new Set(
        edges

          .filter(
            (edge) =>
              edge.selected ||
              edge.id ===
              selectedEdgeId,
          )

          .map(
            (edge) =>
              edge.id,
          ),
      )

    }, [
      edges,
      selectedEdgeId,
    ])


  /* =======================================================
     COPIAR
     Ctrl/Cmd + C
     ======================================================= */

  const copySelected =
    useCallback(() => {

      const selectedNodeIds =
        getSelectedNodeIds()


      if (
        selectedNodeIds.size === 0
      ) {
        return
      }


      const selectedNodes =
        nodes.filter(
          (node) =>
            selectedNodeIds.has(
              node.id,
            ),
        )


      const selectedEdges =
        edges.filter(
          (edge) =>
            selectedNodeIds.has(
              edge.source,
            ) &&
            selectedNodeIds.has(
              edge.target,
            ),
        )


      clipboardRef.current = {
        nodes:
          structuredClone(
            selectedNodes,
          ),

        edges:
          structuredClone(
            selectedEdges,
          ),
      }


      pasteCountRef.current =
        0

    }, [
      nodes,
      edges,
      getSelectedNodeIds,
    ])


  /* =======================================================
     COLAR
     Ctrl/Cmd + V
     ======================================================= */

  const pasteSelected =
    useCallback(() => {

      const clipboard =
        clipboardRef.current


      if (
        clipboard.nodes.length === 0
      ) {
        return
      }


      saveHistory()


      pasteCountRef.current +=
        1


      const offset =
        40 *
        pasteCountRef.current


      const idMap =
        new Map<
          string,
          string
        >()


      clipboard.nodes.forEach(
        (node) => {

          idMap.set(
            node.id,
            crypto.randomUUID(),
          )

        },
      )


      const pastedNodes:
        ERNode[] =
        clipboard.nodes.map(
          (node) => ({

            ...structuredClone(
              node,
            ),

            id:
              idMap.get(
                node.id,
              )!,

            position: {
              x:
                node.position.x +
                offset,

              y:
                node.position.y +
                offset,
            },

            selected:
              true,
          }),
        )


      const pastedEdges:
        EREdge[] =
        clipboard.edges.map(
          (edge) => ({

            ...structuredClone(
              edge,
            ),

            id:
              crypto.randomUUID(),

            source:
              idMap.get(
                edge.source,
              )!,

            target:
              idMap.get(
                edge.target,
              )!,

            selected:
              false,
          }),
        )


      setNodes(
        (current) => [

          ...current.map(
            (node) => ({
              ...node,
              selected: false,
            }),
          ),

          ...pastedNodes,
        ],
      )


      setEdges(
        (current) => [

          ...current.map(
            (edge) => ({
              ...edge,
              selected: false,
            }),
          ),

          ...pastedEdges,
        ],
      )


      if (
        pastedNodes.length === 1
      ) {
        setSelectedNodeId(
          pastedNodes[0].id,
        )
      } else {
        setSelectedNodeId(
          undefined,
        )
      }


      setSelectedEdgeId(
        undefined,
      )

    }, [
      setNodes,
      setEdges,
      saveHistory,
    ])


  /* =======================================================
     EXCLUIR
     Delete / Backspace
     ======================================================= */

  const deleteSelected =
    useCallback(() => {

      const selectedNodeIds =
        getSelectedNodeIds()

      const selectedEdgeIds =
        getSelectedEdgeIds()


      if (
        selectedNodeIds.size === 0 &&
        selectedEdgeIds.size === 0
      ) {
        return
      }


      saveHistory()


      setNodes(
        (current) =>
          current.filter(
            (node) =>
              !selectedNodeIds.has(
                node.id,
              ),
          ),
      )


      setEdges(
        (current) =>
          current.filter(
            (edge) =>

              !selectedEdgeIds.has(
                edge.id,
              ) &&

              !selectedNodeIds.has(
                edge.source,
              ) &&

              !selectedNodeIds.has(
                edge.target,
              ),
          ),
      )


      setSelectedNodeId(
        undefined,
      )

      setSelectedEdgeId(
        undefined,
      )

    }, [
      getSelectedNodeIds,
      getSelectedEdgeIds,
      setNodes,
      setEdges,
      saveHistory,
    ])


  /* =======================================================
     RECORTAR
     Ctrl/Cmd + X
     ======================================================= */

  const cutSelected =
    useCallback(() => {

      const selectedNodeIds =
        getSelectedNodeIds()

      const selectedEdgeIds =
        getSelectedEdgeIds()


      if (
        selectedNodeIds.size === 0 &&
        selectedEdgeIds.size === 0
      ) {
        return
      }


      copySelected()
      deleteSelected()

    }, [
      getSelectedNodeIds,
      getSelectedEdgeIds,
      copySelected,
      deleteSelected,
    ])


  /* =======================================================
     SELECIONAR TUDO
     Ctrl/Cmd + A
     ======================================================= */

  const selectAll =
    useCallback(() => {

      setNodes(
        (current) =>
          current.map(
            (node) => ({
              ...node,
              selected: true,
            }),
          ),
      )


      setEdges(
        (current) =>
          current.map(
            (edge) => ({
              ...edge,
              selected: true,
            }),
          ),
      )


      setSelectedNodeId(
        undefined,
      )

      setSelectedEdgeId(
        undefined,
      )

    }, [
      setNodes,
      setEdges,
    ])


  /* =======================================================
     LIMPAR SELEÇÃO
     ESC
     ======================================================= */

  const clearSelection =
    useCallback(() => {

      setNodes(
        (current) =>
          current.map(
            (node) => ({
              ...node,
              selected: false,
            }),
          ),
      )


      setEdges(
        (current) =>
          current.map(
            (edge) => ({
              ...edge,
              selected: false,
            }),
          ),
      )


      setSelectedNodeId(
        undefined,
      )

      setSelectedEdgeId(
        undefined,
      )

    }, [
      setNodes,
      setEdges,
    ])


  /* =======================================================
     DUPLICAR
     Ctrl/Cmd + D
     ======================================================= */

  const duplicateSelected =
    useCallback(() => {

      const selectedNodeIds =
        getSelectedNodeIds()


      if (
        selectedNodeIds.size === 0
      ) {
        return
      }


      copySelected()
      pasteSelected()

    }, [
      getSelectedNodeIds,
      copySelected,
      pasteSelected,
    ])


  /* =======================================================
     UNDO
     Ctrl/Cmd + Z
     ======================================================= */

  const undo =
    useCallback(() => {

      const previous =
        historyRef.current.pop()


      if (!previous) {
        return
      }


      futureRef.current.push(
        getCurrentSnapshot(),
      )


      applySnapshot(
        previous,
      )

    }, [
      getCurrentSnapshot,
      applySnapshot,
    ])


  /* =======================================================
     REDO

     Windows/Linux:
     Ctrl + Y
     Ctrl + Shift + Z

     macOS:
     Cmd + Shift + Z
     ======================================================= */

  const redo =
    useCallback(() => {

      const next =
        futureRef.current.pop()


      if (!next) {
        return
      }


      historyRef.current.push(
        getCurrentSnapshot(),
      )


      if (
        historyRef.current.length >
        MAX_HISTORY
      ) {
        historyRef.current.shift()
      }


      applySnapshot(
        next,
      )

    }, [
      getCurrentSnapshot,
      applySnapshot,
    ])


  /* =======================================================
     ATUALIZAR NÓ
     ======================================================= */

  const updateNode =
    useCallback(
      (
        updated:
          ERNode,
      ) => {

        saveHistory()


        const nextNodes =
          nodes.map(
            (node) =>
              node.id === updated.id
                ? updated
                : node,
          )


        setNodes(
          nextNodes,
        )


        setEdges(
          (currentEdges) =>
            currentEdges.map(
              (edge) => {

                if (
                  edge.source !==
                  updated.id &&
                  edge.target !==
                  updated.id
                ) {
                  return edge
                }


                const notation =
                  getEdgeNotation(
                    edge.source,
                    edge.target,
                    nextNodes,
                  )


                return {
                  ...edge,

                  data: {
                    sourceCardinality:
                      edge.data
                        ?.sourceCardinality ??
                      '1',

                    targetCardinality:
                      edge.data
                        ?.targetCardinality ??
                      'N',

                    ...edge.data,

                    ...notation,
                  },
                }

              },
            ),
        )

      },
      [
        nodes,
        setNodes,
        setEdges,
        saveHistory,
      ],
    )


  /* =======================================================
     ATUALIZAR ARESTA
     ======================================================= */

  const updateEdge =
    useCallback(
      (
        updated:
          EREdge,
      ) => {

        saveHistory()


        setEdges(
          (current) =>
            current.map(
              (edge) =>
                edge.id === updated.id
                  ? updated
                  : edge,
            ),
        )

      },
      [
        setEdges,
        saveHistory,
      ],
    )


  /* =======================================================
     ATALHOS DE TECLADO
     ======================================================= */

  useKeyboardShortcuts({
    onCopy:
      copySelected,

    onPaste:
      pasteSelected,

    onCut:
      cutSelected,

    onDelete:
      deleteSelected,

    onSelectAll:
      selectAll,

    onUndo:
      undo,

    onRedo:
      redo,

    onDuplicate:
      duplicateSelected,

    onSave:
      saveDiagram,

    onEscape:
      clearSelection,
  })


  /* =======================================================
     ELEMENTO SELECIONADO
     ======================================================= */

  const selectedNode =
    nodes.find(
      (node) =>
        node.id ===
        selectedNodeId,
    )


  const selectedEdge =
    edges.find(
      (edge) =>
        edge.id ===
        selectedEdgeId,
    )


  const hasSelection =
    Boolean(
      selectedNodeId ||
      selectedEdgeId ||

      nodes.some(
        (node) =>
          node.selected,
      ) ||

      edges.some(
        (edge) =>
          edge.selected,
      ),
    )


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <main className="app-shell">

      {/* ===================================================
          TOOLBAR
          =================================================== */}

      <Toolbar
        diagramName={
          diagramName
        }

        onNameChange={
          setDiagramName
        }

        onNew={
          newDiagram
        }

        onExample={
          loadExample
        }

        onExport={
          exportDiagram
        }

        onImport={
          importDiagram
        }

        onDeleteSelected={
          deleteSelected
        }

        hasSelection={
          hasSelection
        }
      />


      {/* ===================================================
          IMPORTAÇÃO
          =================================================== */}

      <input
        ref={
          fileInputRef
        }

        className="hidden-input"

        type="file"

        accept="application/json,.json"

        onChange={
          (event) =>
            onImportFile(
              event
                .target
                .files?.[0],
            )
        }
      />


      {/* ===================================================
          WORKSPACE
          =================================================== */}

      <section className="workspace">

        {/* =================================================
            PALETA
            ================================================= */}

        <Palette
          onAdd={
            addNode
          }
        />


        {/* =================================================
            CANVAS
            ================================================= */}

        <div className="canvas-wrap">

          <ReactFlow<
            ERNode,
            EREdge
          >
            nodes={
              nodes
            }

            edges={
              edges
            }

            nodeTypes={
              nodeTypes
            }

            edgeTypes={
              edgeTypes
            }


            /* =============================================
               INSTÂNCIA DO REACT FLOW
               ============================================= */

            onInit={
              (instance) => {
                reactFlowRef.current =
                  instance
              }
            }


            /* =============================================
               ALTERAÇÕES
               ============================================= */

            onNodesChange={
              onNodesChange
            }

            onEdgesChange={
              onEdgesChange
            }


            /* =============================================
               CONEXÕES
               ============================================= */

            onConnect={
              onConnect
            }

            connectionMode={
              ConnectionMode.Loose
            }

            isValidConnection={
              (connection) =>
                isConnectionAllowed(
                  connection.source,
                  connection.target,
                  nodes,
                )
            }


            /* =============================================
               SELEÇÃO DE NÓ
               ============================================= */

            onNodeClick={
              (_, node) => {

                setSelectedNodeId(
                  node.id,
                )

                setSelectedEdgeId(
                  undefined,
                )

              }
            }


            /* =============================================
               SELEÇÃO DE ARESTA
               ============================================= */

            onEdgeClick={
              (_, edge) => {

                setSelectedEdgeId(
                  edge.id,
                )

                setSelectedNodeId(
                  undefined,
                )

              }
            }


            /* =============================================
               CLIQUE NO CANVAS
               ============================================= */

            onPaneClick={
              () => {

                setSelectedNodeId(
                  undefined,
                )

                setSelectedEdgeId(
                  undefined,
                )

              }
            }


            /* =============================================
               MOVIMENTAÇÃO + UNDO
               ============================================= */

            onNodeDragStart={
              () => {

                saveHistory()

              }
            }


            /* =============================================
               VISUALIZAÇÃO
               ============================================= */

            defaultViewport={{
              x: 0,
              y: 0,
              zoom: 0.75,
            }}

            fitView

            fitViewOptions={{
              padding: 0.2,
              maxZoom: 0.9,
            }}

            snapToGrid

            snapGrid={[
              20,
              20,
            ]}

            minZoom={
              0.25
            }

            maxZoom={
              2.5
            }


            /* =============================================
               DELETE É CONTROLADO PELO NOSSO HOOK
               ============================================= */

            deleteKeyCode={
              null
            }
          >

            <Background
              gap={20}
              size={1}
            />

            <MiniMap
              pannable
              zoomable
            />

            <Controls />

          </ReactFlow>


          {/* ===============================================
              STATUS DE SALVAMENTO
              =============================================== */}

          <div
            className="save-status"
            aria-live="polite"
          >
            <span
              className={
                saved
                  ? 'status-dot saved'
                  : 'status-dot'
              }
            />

            {
              saved
                ? 'Salvo no navegador'
                : 'Salvando...'
            }
          </div>

        </div>


        {/* =================================================
            INSPECTOR
            ================================================= */}

        <Inspector
          node={
            selectedNode
          }

          edge={
            selectedEdge
          }

          onChangeNode={
            updateNode
          }

          onChangeEdge={
            updateEdge
          }
        />

      </section>


      {/* ===================================================
          STATUSBAR
          =================================================== */}

      <footer className="statusbar">

        <span>
          {nodes.length} elementos
        </span>

        <span>
          {edges.length} ligações
        </span>

        <span>
          Arraste · conecte · selecione · edite
        </span>

      </footer>

    </main>
  )
}