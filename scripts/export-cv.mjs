// 一键出文件：JSON（真源）→ HTML → PDF → DOCX
// 用法：
//   node scripts/export-cv.mjs <input.json> <outputName> [template]
//   template 可选：templates/cv-zh-minimal.html（默认）| templates/cv-zh-modern.html
// 例：
//   node scripts/export-cv.mjs data/cv-base.json 个人简历模板 templates/cv-zh-modern.html
// 也可用 npm 脚本：npm run export:cv -- data/cv-base.json 个人简历
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const [input, outputName = 'resume', template = 'templates/cv-zh-minimal.html'] = process.argv.slice(2);
if (!input) {
  console.error('用法: node scripts/export-cv.mjs <input.json> <outputName> [template]');
  process.exit(1);
}

const inJson = resolve(root, input);
const tpl = resolve(root, template);
const htmlOut = resolve(root, `output/${outputName}.html`);
const pdfOut = resolve(root, `output/${outputName}.pdf`);
const docxOut = resolve(root, `output/${outputName}.docx`);

// 1) JSON → HTML
execFileSync('node', ['scripts/build-cv.mjs', inJson, htmlOut, tpl], { cwd: root, stdio: 'inherit' });
// 2) HTML → PDF
execFileSync('node', ['scripts/render-pdf.mjs', htmlOut, pdfOut], { cwd: root, stdio: 'inherit' });
// 3) JSON → DOCX（需 python-docx，可选；未装则跳过并提示）
try {
  execFileSync('python3', ['scripts/build-cv-docx.py', inJson, docxOut], { cwd: root, stdio: 'inherit' });
} catch {
  try {
    execFileSync('python', ['scripts/build-cv-docx.py', inJson, docxOut], { cwd: root, stdio: 'inherit' });
  } catch {
    console.warn('⚠️ DOCX 已跳过（未检测到 python / python-docx；按需 `pip install python-docx` 后重跑此步）');
  }
}
console.log(`\n✅ 已生成：\n  ${pdfOut}\n  ${docxOut}`);
