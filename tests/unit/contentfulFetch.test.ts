import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as contentful from '../../lib/api';

describe('Contentful API client (unit)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // 1️⃣ Teste fetchGraphQL real
  test('fetchGraphQL envia o pedido correto', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      json: async () => ({ data: { ok: true } }),
    } as Partial<Response>);

    await contentful.fetchGraphQL('query { test }');

    expect(globalThis.fetch).toHaveBeenCalledWith(
      expect.stringContaining('content/v1/spaces/'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
        }),
        body: expect.any(String),
      }),
    );
  });

  // 2️⃣ extractPost
  test('extractPost devolve o primeiro item', () => {
    const response = {
      data: { postCollection: { items: [{ slug: 'one' }, { slug: 'two' }] } },
    };
    const post = contentful.extractPost(response);
    expect(post).toEqual({ slug: 'one' });
  });

  // 3️⃣ extractPostEntries válido
  test('extractPostEntries devolve lista válida', () => {
    const response = { data: { postCollection: { items: [{ slug: 'one' }] } } };
    const result = contentful.extractPostEntries(response);
    expect(result).toEqual([{ slug: 'one' }]);
  });

  // 4️⃣ extractPostEntries inválido
  test('extractPostEntries devolve [] quando resposta é inválida', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = contentful.extractPostEntries(null);
    expect(result).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });

  // 5️⃣ getAllPosts retorna posts quando fetchGraphQL funciona
  test('getAllPosts chama fetchGraphQL e retorna posts', async () => {
    const mockPosts = [{ slug: 'post1' }];
    const mockFetch = vi.fn().mockResolvedValue({
      data: { postCollection: { items: mockPosts } },
    });

    const posts = await contentful.getAllPosts(false, mockFetch);

    expect(mockFetch).toHaveBeenCalled();
    expect(posts).toEqual(mockPosts);
  });

  // 6️⃣ getAllPosts retorna [] quando fetchGraphQL retorna inválido
  test('getAllPosts retorna [] quando fetchGraphQL retorna inválido', async () => {
    const mockFetch = vi.fn().mockResolvedValue(null);
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const posts = await contentful.getAllPosts(false, mockFetch);

    expect(mockFetch).toHaveBeenCalled();
    expect(posts).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
