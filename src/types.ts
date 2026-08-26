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
   CARDINALIDADES ANTIGAS
   ========================================================= */

/*
 * Mantido para compatibilidade com modelos
 * criados anteriormente pelo DERLab.
 *
 * Exemplos antigos:
 *
 * 1
 * N
 * 0..1
 * 1..1
 * 0..N
 * 1..N
 */

export type Cardinality =
  | '1'
  | 'N'
  | '0..1'
  | '1..1'
  | '0..N'
  | '1..N'


/* =========================================================
   MODO DE REPRESENTAÇÃO
   ========================================================= */

/*
 * maximum
 *
 * Exibe somente a cardinalidade máxima
 * de cada participação:
 *
 * ENTIDADE --- 1 --- RELACIONAMENTO
 *
 * ENTIDADE --- N --- RELACIONAMENTO
 *
 *
 * minmax
 *
 * Exibe cardinalidade mínima e máxima:
 *
 * ENTIDADE --- (0,1) --- RELACIONAMENTO
 *
 * ENTIDADE --- (1,N) --- RELACIONAMENTO
 */

export type CardinalityMode =
  | 'maximum'
  | 'minmax'


/* =========================================================
   CARDINALIDADE MÁXIMA
   ========================================================= */

/*
 * Utilizada quando o relacionamento está
 * no modo "maximum".
 *
 * Exemplo:
 *
 * FUNCIONARIO --- N --- TRABALHA_PARA --- 1 --- DEPARTAMENTO
 *
 * A combinação N e 1 representa uma
 * relação N:1.
 *
 * M e N podem ser utilizados para
 * representar muitos-para-muitos.
 */

export type MaximumCardinality =
  | '1'
  | 'N'
  | 'M'


/* =========================================================
   EXTREMIDADE DA CARDINALIDADE
   ========================================================= */

/*
 * Indica em qual extremidade da ligação
 * encontra-se a entidade.
 *
 * A cardinalidade deve aparecer próxima
 * da entidade.
 */

export type CardinalityEndpoint =
  | 'source'
  | 'target'


/* =========================================================
   DADOS DOS NÓS
   ========================================================= */

export type ERNodeData = {

  /* =====================================================
     DADOS COMUNS
     ===================================================== */

  label: string

  kind: ERNodeKind


  /* =====================================================
     ATRIBUTOS
     ===================================================== */

  /*
   * Atributo-chave.
   *
   * Representação:
   * sublinhado contínuo.
   */

  primaryKey?: boolean


  /*
   * Chave parcial / discriminadora.
   *
   * Utilizada principalmente em
   * entidades fracas.
   *
   * Representação:
   * sublinhado tracejado.
   */

  partialKey?: boolean


  /*
   * Atributo multivalorado.
   *
   * Representação:
   * elipse dupla.
   */

  multivalued?: boolean


  /*
   * Atributo derivado.
   *
   * Representação:
   * elipse tracejada.
   */

  derived?: boolean


  /* =====================================================
     RELACIONAMENTOS
     ===================================================== */

  /*
   * Relacionamento identificador.
   *
   * Representação:
   * losango duplo.
   */

  identifying?: boolean


  /*
   * Define a forma de representação
   * das cardinalidades deste relacionamento.
   *
   * maximum
   *
   *   1
   *   N
   *   M
   *
   * minmax
   *
   *   (0,1)
   *   (1,1)
   *   (0,N)
   *   (1,N)
   *   (4,N)
   */

  cardinalityMode?: CardinalityMode
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

  /* =====================================================
     CARDINALIDADE MÁXIMA
     ===================================================== */

  /*
   * Utilizada quando o relacionamento está
   * no modo:
   *
   * cardinalityMode = "maximum"
   *
   * Exemplos:
   *
   * 1
   * N
   * M
   */

  cardinality?: MaximumCardinality


  /* =====================================================
     CARDINALIDADE MIN-MAX
     ===================================================== */

  /*
   * Cardinalidade mínima.
   *
   * Exemplos:
   *
   * 0
   * 1
   * 2
   * 4
   */

  minimumCardinality?: string


  /*
   * Cardinalidade máxima utilizada
   * no modo min-max.
   *
   * Exemplos:
   *
   * 1
   * 2
   * 5
   * N
   *
   * minimumCardinality = "1"
   * maximumCardinality = "N"
   *
   * resulta em:
   *
   * (1,N)
   */

  maximumCardinality?: string


  /* =====================================================
     POSIÇÃO
     ===================================================== */

  /*
   * Indica onde está a entidade na ligação.
   *
   * source:
   *
   * ENTIDADE ------ RELACIONAMENTO
   *
   *
   * target:
   *
   * RELACIONAMENTO ------ ENTIDADE
   *
   * A cardinalidade sempre aparece próxima
   * da entidade.
   */

  cardinalityEndpoint?:
    CardinalityEndpoint


  /* =====================================================
     VISIBILIDADE
     ===================================================== */

  /*
   * Cardinalidade deve aparecer apenas em
   * ligações:
   *
   * Entidade ↔ Relacionamento
   *
   * ou:
   *
   * Entidade Fraca ↔ Relacionamento
   */

  showCardinality?: boolean


  /* =====================================================
     APARÊNCIA
     ===================================================== */

  /*
   * Ligação tracejada.
   *
   * Atualmente utilizada em ligações
   * envolvendo atributo derivado.
   */

  dashed?: boolean


  /* =====================================================
     COMPATIBILIDADE COM VERSÕES ANTERIORES
     ===================================================== */

  /*
   * Em uma versão intermediária do DERLab
   * o modo de cardinalidade foi armazenado
   * diretamente na aresta.
   *
   * Agora o modo pertence ao relacionamento.
   *
   * Mantemos o campo para conseguir migrar
   * diagramas antigos.
   */

  cardinalityMode?: CardinalityMode


  /*
   * Campos utilizados pela versão antiga
   * de cardinalidades.
   *
   * Mantidos para leitura de JSONs e
   * localStorage antigos.
   */

  sourceCardinality?: Cardinality

  targetCardinality?: Cardinality
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
   DIAGRAMA
   ========================================================= */

export type ERDiagram = {

  /*
   * Mantemos versão 1 por enquanto
   * porque o DERLab possui compatibilidade
   * com diagramas anteriormente salvos.
   */

  version: 1

  name: string

  nodes: ERNode[]

  edges: EREdge[]
}