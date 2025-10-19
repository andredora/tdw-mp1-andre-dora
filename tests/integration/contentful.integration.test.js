import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as contentful from '../../lib/api';

describe('Contentful API client (integration)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockFetch = vi.fn();
  global.fetch = mockFetch;

  test('getAllPosts retorna lista completa', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        data: {
          postCollection: { items: [{ slug: 'post1' }, { slug: 'post2' }] },
        },
      }),
    });

    const posts = await contentful.getAllPosts(false);

    expect(posts).toEqual([{ slug: 'post1' }, { slug: 'post2' }]);

    expect(mockFetch).toHaveBeenCalledOnce();
    expect(mockFetch.mock.calls[0][0]).toContain('content/v1/spaces/');
  });

  test('getPreviewPostBySlug retorna post correto', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        data: {
          postCollection: {
            items: [{ slug: 'preview1', title: 'Preview Post' }],
          },
        },
      }),
    });

    const post = await contentful.getPreviewPostBySlug('preview1');

    expect(post).toEqual({ slug: 'preview1', title: 'Preview Post' });
    expect(mockFetch).toHaveBeenCalledOnce();
  });

  test('getPostAndMorePosts retorna post e morePosts corretamente', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        data: {
          postCollection: { items: [{ slug: 'main', title: 'Main Post' }] },
        },
      }),
    });

    mockFetch.mockResolvedValueOnce({
      json: async () => ({
        data: {
          postCollection: { items: [{ slug: 'other1' }, { slug: 'other2' }] },
        },
      }),
    });

    const result = await contentful.getPostAndMorePosts('main', false);

    expect(result.post).toEqual({ slug: 'main', title: 'Main Post' });
    expect(result.morePosts).toEqual([{ slug: 'other1' }, { slug: 'other2' }]);
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  test('getAllPosts lida com resposta inválida sem lançar erro', async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => null,
    });

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const posts = await contentful.getAllPosts(false);
    expect(posts).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
  });
});
