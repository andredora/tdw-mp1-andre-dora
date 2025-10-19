import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { getAllPosts } from '../../lib/api';
import dotenv from 'dotenv';

if (!process.env.GITHUB_ACTIONS) {
  dotenv.config({ path: '.env.local' });
}

const { CONTENTFUL_SPACE_ID, CONTENTFUL_ACCESS_TOKEN } = process.env;

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  throw new Error('Contentful environment variables are missing');
}

const canRunIntegration = !!CONTENTFUL_ACCESS_TOKEN;

function PostRenderer({ post }) {
  return (
    <div data-testid="post-content">
      <h1>{post.title}</h1>
      <div data-testid="post-excerpt">{post.excerpt}</div>
      <div data-testid="post-body">
        {documentToReactComponents(post.content.json)}
      </div>
      <img
        src={post.coverImage.url}
        alt={post.coverImage.title}
        data-testid="cover-image"
      />
      <div data-testid="author-info">Por: {post.author.name}</div>
      <time data-testid="post-date">{post.date}</time>
    </div>
  );
}

describe('Renderização do Conteúdo do Contentful', () => {
  let allPosts: any[] = [];

  beforeAll(async () => {
    if (!canRunIntegration) return;
    allPosts = await getAllPosts(false);
  });

  if (!canRunIntegration) return;

  it('deve renderizar o título do post corretamente', async () => {
    const post = allPosts[0];
    render(<PostRenderer post={post} />);
    const titleElement = screen.getByRole('heading', { level: 1 });
    expect(titleElement).toBeInTheDocument();
    expect(titleElement.textContent).toBe(post.title);
  });

  it('deve renderizar o excerpt visível para o usuário', async () => {
    const post = allPosts[0];
    render(<PostRenderer post={post} />);
    const excerptElement = screen.getByTestId('post-excerpt');
    expect(excerptElement).toBeInTheDocument();
    expect(excerptElement.textContent).toBeTruthy();
    expect(excerptElement).toBeVisible();
  });

  it('deve renderizar o conteúdo markdown como HTML', async () => {
    const post = allPosts[0];
    render(<PostRenderer post={post} />);
    const contentElement = screen.getByTestId('post-body');
    expect(contentElement).toBeInTheDocument();
    const paragraphs = contentElement.querySelectorAll('p');
    expect(paragraphs.length).toBeGreaterThan(0);
    expect(contentElement).toBeVisible();
  });

  it('deve renderizar a imagem de capa com atributos corretos', async () => {
    const post = allPosts[0];
    render(<PostRenderer post={post} />);
    const image = screen.getByTestId('cover-image');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', post.coverImage.url);
    expect(image).toBeVisible();
  });

  it('deve renderizar informações do autor corretamente', async () => {
    const post = allPosts[0];
    render(<PostRenderer post={post} />);
    const authorInfo = screen.getByTestId('author-info');
    expect(authorInfo).toBeInTheDocument();
    expect(authorInfo.textContent).toContain(post.author.name);
    expect(authorInfo).toBeVisible();
  });
});

describe('Renderização Rich Text', () => {
  let allPosts: any[] = [];

  beforeAll(async () => {
    if (!canRunIntegration) return;
    allPosts = await getAllPosts(false);
  });

  if (!canRunIntegration) return;

  it('deve renderizar diferentes tipos de blocos de conteúdo', async () => {
    const post = allPosts[0];
    render(<PostRenderer post={post} />);
    const contentElement = screen.getByTestId('post-body');
    const hasParagraphs = contentElement.querySelector('p') !== null;
    const hasHeadings =
      contentElement.querySelector('h1, h2, h3, h4, h5, h6') !== null;
    expect(hasParagraphs || hasHeadings).toBe(true);
  });
});
