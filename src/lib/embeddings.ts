import { normalizeText } from './utils';

const VECTOR_SIZE = 384;

export function embedText(text: string): number[] {
  const normalized = normalizeText(text);
  const vector = new Array<number>(VECTOR_SIZE).fill(0);

  if (!normalized) return vector;

  const tokens = normalized.split(' ');
  for (const token of tokens) {
    if (!token) continue;
    for (let i = 0; i < token.length; i += 1) {
      const charCode = token.charCodeAt(i);
      const index = (charCode * 31 + i * 17 + token.length * 13) % VECTOR_SIZE;
      vector[index] += 1;
    }
  }

  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm) || 1;

  return vector.map((value) => Number((value / norm).toFixed(6)));
}

export function cosineSimilarity(a: number[], b: number[]) {
  const len = Math.min(a.length, b.length);
  let dot = 0;
  let aNorm = 0;
  let bNorm = 0;

  for (let i = 0; i < len; i += 1) {
    dot += a[i] * b[i];
    aNorm += a[i] * a[i];
    bNorm += b[i] * b[i];
  }

  if (aNorm === 0 || bNorm === 0) return 0;
  return dot / (Math.sqrt(aNorm) * Math.sqrt(bNorm));
}

export const EMBEDDING_DIMENSION = VECTOR_SIZE;
