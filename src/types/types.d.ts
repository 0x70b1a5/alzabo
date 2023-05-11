export interface SingleDocument {
  id: string,
  embedding: number[],
  metadata: any
  content: string
}

export interface OurCollection {
  id: string,
  name: string,
  embeddings: number[][]
  metadata?: object,
  documents: string[]
  metadatas: string[]
  ids: string[]
  dirty?: boolean
}