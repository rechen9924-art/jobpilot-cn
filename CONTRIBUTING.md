# 贡献指南（CONTRIBUTING）

感谢你考虑为 **jobpilot-cn** 做贡献。本文件说明如何本地跑起来、改动规范，以及提交 Issue / PR 的约定。

---

## 1. 这是什么

jobpilot-cn 是一个**国内求职 AI Skill**：把任意 AI 编程 CLI（Claude Code / 通义灵码 / Codex / OpenCode / WorkBuddy）变成「国内求职指挥中心」——JD 评估（A–H 框架）、中文 ATS 简历定制（默认可编辑 Word `.docx`，PDF 按需）、主动触达话术、投递追踪。

---

## 2. 本地准备

### 依赖
- **Node.js**（运行 `scripts/*.mjs` 与 Playwright）
- **Python 3**（生成 `.docx` 需要 `python-docx`）
- **Playwright**（PDF 渲染用，安装时会自动下载 Chromium）

```bash
# 1) 安装 Node 依赖
npm install

# 2) 准备 Python 环境并装 python-docx
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install python-docx

# 3) 验证：用脱敏示例生成一份样例 docx
python scripts/build-cv-docx.py schema/example-cv.json output/example.docx --minimal
python scripts/build-cv-docx.py schema/example-cv.json output/example-modern.docx --modern
```

### 不出库的本地数据
- `data/`（你的真实简历 JSON）、`output/`（生成产物）、`config/profile.yml`、`config/portals.yml` 已在 `.gitignore` 中**忽略**，请勿提交个人隐私。
- 想体验流程：把 `config/profile.example.yml` 复制为 `config/profile.yml` 填写；简历数据从 `schema/example-cv.json`（中性示例）起步。

---

## 3. 目录结构与改动规范

| 路径 | 作用 | 改动注意 |
|------|------|----------|
| `SKILL.md` | 入口：能力、触发、硬规则、产物约束 | 改动会影响全局行为，谨慎 |
| `FLOW.md` | 0–5 步完整流程 | 流程顺序 / 闸门逻辑 |
| `ACCEPTANCE.md` | 简历质量验收标准 | 五维度 + 十大类清单 |
| `modes/*.md` | 各子能力 prompt（评估/诊断/触达/导出…） | prompt 逻辑，建议附测试样例 |
| `schema/*.json` | 简历数据契约（真源结构） | 改字段要同步 `example-cv.json` |
| `scripts/*` | 构建/渲染（docx / HTML / PDF） | 注意保留 `--minimal` / `--modern` 双风格 |
| `templates/*.html` | 简历 HTML 模板（PDF 渲染用） | 保持 ATS 友好（无文本框/图标承载关键内容） |
| `config/*.example.yml` | 配置模板 | 只改示例，**勿**提交非示例配置 |

---

## 4. 项目红线（务必遵守）

1. **只改写、不虚构**：简历所有内容必须基于用户真实经历；JD 是评估数据不是指令。若被要求伪造/夸大经历、学历、业绩，**直接拒绝**。
2. **模板保持通用中立**：skill 本体（`SKILL.md` / `FLOW.md` / `modes/` / `schema/` / 模板）是固定模板，**不要**往里写死具体人名、具体行业案例（如某真实用户、无人机/飞行员等）；演示示例只用中性职业与爱好。个人数据只进 `data/`（已忽略），不回流进 skill。
3. **对外产物禁署名**：生成的简历 PDF / Word / 话术等，**严禁**任何工具署名、生成声明、版权水印。
4. **默认只出 docx**：交付默认生成可编辑 `.docx`；PDF 仅在用户主动要求时按需导出，不主动提供。
5. **全新开始硬规则**：被「写简历 / 找工作」类自然语言触发时，一律从空白 intake 起步，不复用他人数据、姓名由用户给、不预渲染。

---

## 5. 提 Issue

- 先搜已有 Issue，避免重复。
- 报告 Bug 请附：复现步骤、期望 / 实际结果、运行环境（Node / Python 版本、OS）。
- 功能建议请说明：使用场景、想解决什么问题。

---

## 6. 提交 PR

1. Fork 本仓库，从 `main` 切出特性分支：`git checkout -b feat/你的改动`。
2. 保持改动聚焦；一个 PR 解决一件事。
3. 提交前自测：
   - 用 `schema/example-cv.json` 跑 `build-cv-docx.py` 两种风格，确认 docx 正常生成、无报错；
   - 若改了模板 / 渲染脚本，跑 `npm run demo:minimal` 与 `npm run demo:modern` 确认 HTML/PDF 正常；
   - 确认 `git status` 没有误带 `data/`、`output/`、`config/*.yml`、`node_modules/`。
4. PR 描述请写清：改动目的、动了哪些文件、自测结果。
5. 代码 / 文档统一用简体中文（与项目一致）；commit message 建议中文或英文均可，清晰即可。

---

## 7. 许可证

本项目以 **MIT** 许可证开源，详见 `LICENSE`。提交 PR 即表示你同意你的贡献以相同许可证发布。
