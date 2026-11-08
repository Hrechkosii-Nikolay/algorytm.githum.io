#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const siteOrigin = 'https://hrechkosii-nikolay.github.io';
const siteBasePath = '/algorytm.githum.io/';
const siteBaseUrl = `${siteOrigin}${siteBasePath}`;
const ignoredDirectories = new Set(['.git', 'node_modules']);

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  if (entry.name.startsWith('.') && entry.name !== '.well-known') return [];
  if (ignoredDirectories.has(entry.name)) return [];
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});

const relative = absolute => path.relative(root, absolute).split(path.sep).join('/');
const decode = value => value
  .replace(/&amp;/g, '&')
  .replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'")
  .replace(/&lt;/g, '<')
  .replace(/&gt;/g, '>')
  .replace(/&#(\d+);/g, (_, number) => String.fromCodePoint(Number(number)))
  .replace(/&#x([\da-f]+);/gi, (_, number) => String.fromCodePoint(Number.parseInt(number, 16)));
const text = value => decode(value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim());
const first = (source, expression) => source.match(expression)?.[1]?.trim() ?? '';
const attributes = tag => Object.fromEntries([...tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/gs)].map(match => [match[1].toLowerCase(), decode(match[3])]));
const tags = (source, name) => [...source.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
const contentTags = (source, name) => [...source.matchAll(new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'gi'))].map(match => text(match[1]));

const htmlFiles = walk(root).filter(file => file.endsWith('.html')).sort();
const existingFiles = new Set(walk(root).map(relative));

const routeForFile = file => {
  if (file === 'index.html') return '/';
  if (file.endsWith('/index.html')) return `/${file.slice(0, -'index.html'.length)}`;
  return `/${file}`;
};
const publicUrlForFile = file => new URL(routeForFile(file).slice(1), siteBaseUrl).href;
const fileForUrl = (rawUrl, sourceFile = 'index.html') => {
  if (!rawUrl || /^(?:mailto:|tel:|sms:|javascript:|data:)/i.test(rawUrl)) return null;
  let url;
  try {
    url = new URL(rawUrl, new URL(routeForFile(sourceFile).slice(1), siteBaseUrl));
  } catch {
    return null;
  }
  if (url.origin !== siteOrigin || !url.pathname.startsWith(siteBasePath)) return null;
  let target = decodeURIComponent(url.pathname.slice(siteBasePath.length));
  if (!target || target.endsWith('/')) target += 'index.html';
  return { file: target, fragment: decodeURIComponent(url.hash.slice(1)), url };
};

const pages = htmlFiles.map(absolute => {
  const file = relative(absolute);
  const source = fs.readFileSync(absolute, 'utf8');
  const links = tags(source, 'a').map(item => item.href).filter(Boolean);
  const images = tags(source, 'img').filter(item => item.src);
  const meta = tags(source, 'meta');
  const linkTags = tags(source, 'link');
  const description = meta.find(item => item.name?.toLowerCase() === 'description')?.content?.trim() ?? '';
  const robots = meta.find(item => item.name?.toLowerCase() === 'robots')?.content?.toLowerCase() ?? '';
  const metaByName = Object.fromEntries(meta.filter(item => item.name).map(item => [item.name.toLowerCase(), item.content ?? '']));
  const metaByProperty = Object.fromEntries(meta.filter(item => item.property).map(item => [item.property.toLowerCase(), item.content ?? '']));
  const canonical = linkTags.find(item => item.rel?.toLowerCase().split(/\s+/).includes('canonical'))?.href ?? '';
  const hreflang = Object.fromEntries(linkTags.filter(item => item.rel?.toLowerCase().split(/\s+/).includes('alternate') && item.hreflang).map(item => [item.hreflang.toLowerCase(), item.href]));
  const jsonLd = [...source.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1].trim());
  const ids = new Set(tags(source, '[a-z][\\w:-]*').map(item => item.id).filter(Boolean));
  return {
    file,
    source,
    lang: first(source, /<html\b[^>]*\blang=["']([^"']+)["']/i).toLowerCase(),
    title: text(first(source, /<title\b[^>]*>([\s\S]*?)<\/title>/i)),
    description,
    robots,
    metaByName,
    metaByProperty,
    canonical,
    hreflang,
    h1: contentTags(source, 'h1'),
    links,
    images,
    jsonLd,
    ids,
    publicUrl: publicUrlForFile(file),
    indexable: !/(?:^|[\s,])noindex(?:[\s,]|$)/i.test(robots) && file !== '404.html'
  };
});

const pageByFile = new Map(pages.map(page => [page.file, page]));
const issues = [];
const add = (severity, code, file, detail) => issues.push({ severity, code, file, detail });

for (const page of pages) {
  if (!page.lang) add('P1', 'missing-lang', page.file, 'Missing html[lang].');
  if (!page.metaByName.viewport) add('P1', 'missing-viewport', page.file, 'Missing viewport metadata.');
  if (!page.title) add('P1', 'missing-title', page.file, 'Missing title.');
  if (!page.description && page.indexable) add('P1', 'missing-description', page.file, 'Missing meta description.');
  if (!page.canonical && page.indexable) add('P0', 'missing-canonical', page.file, 'Missing canonical URL.');
  if (page.h1.length === 0 && page.indexable) add('P1', 'missing-h1', page.file, 'Missing H1.');
  if (page.h1.length > 1) add('P1', 'multiple-h1', page.file, `${page.h1.length} H1 elements.`);
  if (page.file !== '404.html' && /(?:^|[\s,])noindex(?:[\s,]|$)/i.test(page.robots)) add('P0', 'accidental-noindex', page.file, page.robots);

  if (page.indexable && fileForUrl(page.canonical, page.file)?.file === page.file) {
    for (const property of ['og:title', 'og:description', 'og:url', 'og:image']) if (!page.metaByProperty[property]) add('P2', 'missing-open-graph', page.file, property);
    for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) if (!page.metaByName[name]) add('P2', 'missing-twitter-card', page.file, name);
    if (!tags(page.source, 'link').some(item => item.rel?.toLowerCase().split(/\s+/).some(rel => rel === 'icon' || rel === 'shortcut'))) add('P2', 'missing-favicon', page.file, 'No favicon link.');
  }

  if (page.canonical) {
    const target = fileForUrl(page.canonical, page.file);
    if (!target || !pageByFile.has(target.file)) add('P0', 'canonical-target', page.file, `Canonical target is not a local page: ${page.canonical}`);
    else if (page.indexable && page.file !== 'amp/index.html' && target.file !== page.file) add('P0', 'non-self-canonical', page.file, `Canonical points to ${target.file}.`);
  }

  for (const [language, rawUrl] of Object.entries(page.hreflang)) {
    const target = fileForUrl(rawUrl, page.file);
    if (!target || !pageByFile.has(target.file)) {
      add('P0', 'broken-hreflang', page.file, `${language}: ${rawUrl}`);
      continue;
    }
    const targetPage = pageByFile.get(target.file);
    if (language !== 'x-default' && !targetPage.lang.startsWith(language)) add('P1', 'hreflang-language', page.file, `${language} targets lang=${targetPage.lang || '(missing)'} at ${target.file}.`);
    if (language !== 'x-default') {
      const reciprocal = Object.values(targetPage.hreflang).some(value => fileForUrl(value, target.file)?.file === page.file);
      if (!reciprocal) add('P1', 'hreflang-reciprocity', page.file, `${target.file} does not link back.`);
    }
  }

  for (const rawUrl of page.links) {
    const target = fileForUrl(rawUrl, page.file);
    if (!target) continue;
    if (!existingFiles.has(target.file)) {
      add('P1', 'broken-link', page.file, rawUrl);
      continue;
    }
    if (target.fragment && target.file.endsWith('.html')) {
      const targetPage = pageByFile.get(target.file);
      if (targetPage && !targetPage.source.includes(`id="${target.fragment}"`) && !targetPage.source.includes(`id='${target.fragment}'`)) add('P2', 'broken-fragment', page.file, rawUrl);
    }
  }

  for (const image of page.images) {
    const target = fileForUrl(image.src, page.file);
    if (target && !existingFiles.has(target.file)) add('P1', 'missing-image', page.file, image.src);
    if (!Object.hasOwn(image, 'alt')) add('P2', 'missing-alt-attribute', page.file, image.src);
  }

  page.jsonLd.forEach((value, index) => {
    try { JSON.parse(value); } catch (error) { add('P1', 'invalid-jsonld', page.file, `Block ${index + 1}: ${error.message}`); }
  });
}

for (const property of ['title', 'description']) {
  const groups = new Map();
  for (const page of pages.filter(item => item.indexable && item[property] && fileForUrl(item.canonical, item.file)?.file === item.file)) {
    const key = page[property].toLowerCase();
    groups.set(key, [...(groups.get(key) ?? []), page.file]);
  }
  for (const files of groups.values()) if (files.length > 1) files.forEach(file => add('P1', `duplicate-${property}`, file, files.join(', ')));
}

const inbound = new Map(pages.map(page => [page.file, 0]));
for (const page of pages) for (const rawUrl of page.links) {
  const target = fileForUrl(rawUrl, page.file);
  if (target && target.file !== page.file && inbound.has(target.file)) inbound.set(target.file, inbound.get(target.file) + 1);
}
for (const page of pages.filter(item => item.indexable && fileForUrl(item.canonical, item.file)?.file === item.file && item.file !== 'index.html' && item.file !== 'en/index.html')) {
  if (inbound.get(page.file) === 0) add('P1', 'orphan-page', page.file, 'No internal HTML link points to this page.');
}

const sitemapSource = fs.existsSync(path.join(root, 'sitemap.xml')) ? fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8') : '';
const sitemapUrls = [...sitemapSource.matchAll(/<loc>(.*?)<\/loc>/gs)].map(match => decode(match[1].trim()));
const sitemapFiles = new Map();
for (const url of sitemapUrls) {
  const target = fileForUrl(url);
  if (!target || !pageByFile.has(target.file)) add('P1', 'sitemap-invalid-url', 'sitemap.xml', url);
  else sitemapFiles.set(target.file, (sitemapFiles.get(target.file) ?? 0) + 1);
}
for (const [file, count] of sitemapFiles) if (count > 1) add('P1', 'sitemap-duplicate', 'sitemap.xml', `${file} appears ${count} times.`);
for (const page of pages) {
  const canonicalTarget = page.canonical ? fileForUrl(page.canonical, page.file)?.file : null;
  const shouldBeListed = page.indexable && canonicalTarget === page.file;
  if (shouldBeListed && !sitemapFiles.has(page.file)) add('P1', 'sitemap-missing', page.file, 'Indexable canonical page is absent from sitemap.');
  if (!shouldBeListed && sitemapFiles.has(page.file)) add('P1', 'sitemap-extra', page.file, 'Non-canonical or non-indexable page is in sitemap.');
}

const counts = issues.reduce((result, issue) => ({ ...result, [issue.severity]: (result[issue.severity] ?? 0) + 1 }), {});
const report = {
  generatedAt: new Date().toISOString(),
  siteBaseUrl,
  pages: pages.map(({ source, ids, links, images, jsonLd, metaByName, metaByProperty, ...page }) => ({ ...page, inboundLinks: inbound.get(page.file), jsonLdBlocks: jsonLd.length })),
  sitemapUrls,
  counts,
  issues
};

const jsonArgument = process.argv.find(argument => argument.startsWith('--json='));
if (jsonArgument) fs.writeFileSync(path.resolve(root, jsonArgument.slice('--json='.length)), `${JSON.stringify(report, null, 2)}\n`);

console.log(`SEO audit: ${pages.length} HTML pages, ${sitemapUrls.length} sitemap URLs.`);
console.log(`Issues: ${Object.entries(counts).map(([key, value]) => `${key}=${value}`).join(', ') || 'none'}.`);
for (const issue of issues) console.log(`${issue.severity}\t${issue.code}\t${issue.file}\t${issue.detail}`);
process.exitCode = issues.some(issue => issue.severity === 'P0' || issue.severity === 'P1') ? 1 : 0;
