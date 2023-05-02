export interface SingleDocument {
  id: string,
  embeddings: number[],
  metadata: any
  content: string
}