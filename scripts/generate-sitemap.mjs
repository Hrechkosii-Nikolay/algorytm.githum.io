#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const baseUrl = 'https://hrechkosii-nikolay.github.io/algorytm.githum.io/';
const sitemapPath = path.join(root, 'sitemap.xml');

const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  if (entry.name === '.git' || entry.name === 'node_modules' || entry.name.startsWith('.')) return [];
  const absolute = path.join(directory, entry.name);
  return entry.isDirectory() ? walk(absolute) : [absolute];
});
const relative = absolute => path.relative(root, absolute).split(path.sep).join('/');
const route = file => file === 'index.html' ? '' : file.endsWith('/index.html') ? file.slice(0, -'index.html'.length) : file;
const first = (source, expression) => source.match(expression)?.[1]?.trim() ?? '';

const previous = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf8') : '';
const previousLastmod = new Map([...previous.matchAll(/<url>\s*<loc>(.*?)<\/loc>(?:\s*<lastmod>(.*?)<\/lastmod>)?\s*<\/url>/gs)].map(match => [match[1].trim(), match[2]?.trim()]));

const urls = walk(root)
  .filter(file => file.endsWith('.html'))
  .map(file => {
    const name = relative(file);
    const source = fs.readFileSync(file, 'utf8');
    const canonical = first(source, /<link\b[^>]*\brel=["']canonical["'][^>]*\bhref=["']([^"']+)["']/i)
      || first(source, /<link\b[^>]*\bhref=["']([^"']+)["'][^>]*\brel=["']canonical["']/i);
    const robots = first(source, /<meta\b[^>]*\bname=["']robots["'][^>]*\bcontent=["']([^"']+)["']/i).toLowerCase();
    const expectedCanonical = new URL(route(name), baseUrl).href;
    return name !== '404.html' && !/(?:^|[\s,])noindex(?:[\s,]|$)/.test(robots) && canonical === expectedCanonical ? canonical : null;
  })
  .filter(Boolean)
  .sort((left, right) => left.localeCompare(right, 'en'));

const entries = urls.map(url => {
  const lastmod = previousLastmod.get(url);
  return `  <url>\n    <loc>${url}</loc>${lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : ''}\n  </url>`;
});
const generated = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`;

if (process.argv.includes('--write')) {
  fs.writeFileSync(sitemapPath, generated);
  console.log(`Wrote ${urls.length} canonical URLs to sitemap.xml.`);
} else if (previous === generated) {
  console.log(`sitemap.xml is current (${urls.length} canonical URLs).`);
} else {
  console.error('sitemap.xml differs from generated output. Run with --write after reviewing page metadata.');
  process.exitCode = 1;
}
