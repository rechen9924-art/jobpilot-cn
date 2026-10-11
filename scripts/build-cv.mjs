// jobpilot-cn · 简历构建脚本
// 读取简历 JSON，注入 templates/cv-zh-minimal.html，输出 HTML。
// 用法: node scripts/build-cv.mjs <简历.json> <输出.html> <模板.html>

import fs from 'node:fs';

const [jsonPath, outHtml, tplPath] = process.argv.slice(2);
if (!jsonPath || !outHtml || !tplPath) {
  console.error('用法: node scripts/build-cv.mjs <简历.json> <输出.html> <模板.html>');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
const tpl = fs.readFileSync(tplPath, 'utf-8');

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// 兼容三种 JSON 结构：扁平字段 / 嵌套 candidate / 嵌套 basics（schema 真源用 basics）
const cand = data.candidate || data.basics || {};
const pick = (k) => (data[k] !== undefined ? data[k] : cand[k]);
const name = pick('name') || '';
const title = pick('title') || '';
const phone = pick('phone') || '';
const email = pick('email') || '';
const wechat = pick('wechat') || '';
const location = pick('location') || '';

const links = Array.isArray(data.basics?.links)
  ? data.basics.links
  : Array.isArray(data.links)
    ? data.links
    : [];
const contact = [
  phone ? `电话：${esc(phone)}` : '',
  email ? `邮箱：${esc(email)}` : '',
  wechat ? `微信：${esc(wechat)}` : '',
  location ? `所在地：${esc(location)}` : '',
  ...links.map((l) => `链接：${esc(l)}`),
]
  .filter(Boolean)
  .map((s) => `<span>${s}</span>`)
  .join('');

const expHtml = (data.experience || [])
  .map(
    (e) => `
  <div class="item">
    <div class="item-head"><span>${esc(e.company)} · ${esc(e.role)}</span><span class="right">${esc(
      e.dates || ''
    )}</span></div>
    ${e.location ? `<div class="item-sub">${esc(e.location)}</div>` : ''}
    <ul>${(e.bullets || []).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </div>`
  )
  .join('');

const projHtml = (data.projects || [])
  .map((p) => {
    const head = [p.name, p.role].filter(Boolean).map(esc).join(' · ');
    return `
  <div class="item">
    <div class="item-head"><span>${head}</span><span class="right">${esc(
      p.dates || ''
    )}</span></div>
    ${p.tech ? `<div class="item-sub">技术栈：${esc(p.tech)}</div>` : ''}
    ${p.description ? `<div class="item-desc">${esc(p.description)}</div>` : ''}
    <ul>${(p.bullets || []).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>
  </div>`;
  })
  .join('');

const eduHtml = (data.education || [])
  .map((e) => {
    const school = e.org || e.school || '';
    const major = e.major || '';
    const degree = e.degree || e.title || '';
    const dates = e.dates || e.year || '';
    return `
  <div class="item">
    <div class="item-head"><span>${esc(school)} · ${esc(degree)}${
      major ? ' · ' + esc(major) : ''
    }</span><span class="right">${esc(dates)}</span></div>
  </div>`;
  })
  .join('');

const skillHtml = (data.skills || [])
  .map(
    (s) =>
      `<div class="skills-row"><span class="skills-cat">${esc(
        s.category
      )}：</span>${esc(s.items)}</div>`
  )
  .join('');

const coreHtml = (data.core_capabilities || [])
  .map((c) => `<span class="core-tag">${esc(c)}</span>`)
  .join('');

const html = tpl
  .replace('{{NAME}}', esc(name))
  .replace('{{TITLE}}', esc(title))
  .replace('{{CONTACT}}', contact)
  .replace('{{SUMMARY}}', esc(data.summary || ''))
  .replace('{{CORE}}', coreHtml)
  .replace('{{EXPERIENCE}}', expHtml)
  .replace('{{PROJECTS}}', projHtml)
  .replace('{{EDUCATION}}', eduHtml)
  .replace('{{SKILLS}}', skillHtml);

fs.writeFileSync(outHtml, html, 'utf-8');
console.log('✅ HTML 已生成:', outHtml);
