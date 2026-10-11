// jobpilot-cn · PDF 渲染脚本
// 用 Playwright 把 HTML 打印为 A4 PDF。
// 用法: node scripts/render-pdf.mjs <输入.html> <输出.pdf>

import fs from 'node:fs';
import { chromium } from 'playwright';

const [htmlPath, pdfPath] = process.argv.slice(2);
if (!htmlPath || !pdfPath) {
  console.error('用法: node scripts/render-pdf.mjs <输入.html> <输出.pdf>');
  process.exit(1);
}

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + fs.realpathSync(htmlPath), { waitUntil: 'networkidle' });
await page.pdf({
  path: pdfPath,
  format: 'A4',
  printBackground: true,
  margin: { top: '0', bottom: '0', left: '0', right: '0' },
});
await browser.close();
console.log('✅ PDF 已生成:', pdfPath);
