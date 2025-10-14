import { describe, test, expect } from 'vitest';

import * as contentful from '../../lib/api';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN, CONTENTFUL_PREVIEW_ACCESS_TOKEN } = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error(
    'Contentful environment variables are missing. Configure CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in .env.local'
  );
}

describe('Contentful API client (integration real)', () => {
  test('getAllPosts retorna posts reais', async () => {
    const posts = await contentful.getAllPosts(false);

    // Deve retornar um array
    expect(Array.isArray(posts)).toBe(true);

    // Se houver posts, verificar estrutura mínima
    if (posts.length > 0) {
      expect(posts[0]).toHaveProperty('slug');
      expect(typeof posts[0].slug).toBe('string');
    }
  });

  test('getPostAndMorePosts retorna post e maisPosts', async () => {
    const allPosts = await contentful.getAllPosts(false);
    if (allPosts.length === 0) return; // evita erro se não houver posts

    const slug = allPosts[0].slug;
    const result = await contentful.getPostAndMorePosts(slug, false);

    expect(result).toHaveProperty('post');
    expect(result.post.slug).toBe(slug);

    expect(result).toHaveProperty('morePosts');
    expect(Array.isArray(result.morePosts)).toBe(true);

    if (result.morePosts.length > 0) {
      expect(result.morePosts[0]).toHaveProperty('slug');
    }
  });

  test('getPreviewPostBySlug retorna post correto em modo preview', async () => {
    const previewPosts = await contentful.getAllPosts(true);
    if (previewPosts.length === 0) return;

    const slug = previewPosts[0].slug;
    const post = await contentful.getPreviewPostBySlug(slug);

    expect(post.slug).toBe(slug);
    expect(post).toHaveProperty('title');
  });
});
