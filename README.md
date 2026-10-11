# jobpilot-cn（求职流·国内）

> English version: [README.en.md](./README.en.md)

一个**本地优先、零数据上传**的国内求职 AI Skill。把任意 AI 编程 CLI 变成你的求职指挥中心：粘贴 JD → 评估匹配 → 定制中文简历 → 生成触达话术 → 追踪投递。

> 本项目为独立实现的求职辅助工具，采用 MIT 协议开源。
> 本项目为独立开发，无上游代码依赖。

---

## 它解决什么

普通简历是“一份打天下”，但投不同岗位命中率差异巨大。jobpilot-cn 的核心是 **一岗一稿**：

1. **目标定位**（第 0 步）：先明确岗位 / 行业 / 城市 / 社招校招 / 薪资口径，避免写成“什么都能干”的通用简历
2. **事实核验与量化**（第 1 步）：把职责改写成“动作 + 对象 + 结果 + 数字”
3. **按 JD 定制**（第 4 步）：对照岗位重写简历，并给出匹配评分、缺口清单、是否值得投
4. **触达与追踪**（第 5 步）：生成 BOSS / 脉脉 / 猎聘 / 邮件 / 微信话术，维护投递表

完整流程见 [`FLOW.md`](./FLOW.md)。

---

## 环境要求

- **Node.js ≥ 18.17**（推荐 LTS 20 / 22）
- **Playwright**（生成 PDF 时需要，安装时自动下载 Chromium）
- **Python 3.10+ 与 python-docx**（生成可编辑 Word .docx 时需要）
- 操作系统：Windows / macOS / Linux 均支持
- **不需要任何 API key**：核心评估与改写由你本地的 AI CLI 完成

## 安装与初始化

```bash
git clone <你的仓库地址> jobpilot-cn
cd jobpilot-cn
npm install
pip install python-docx   # 生成 Word（.docx）时需要
cp config/profile.example.yml config/profile.yml   # 必填：你的画像
cp config/portals.example.yml config/portals.yml   # 选填：职位发现
# 用 JSON 写简历基础稿：data/cv-base.json（字段契约见 schema/resume.schema.json，可从 schema/example-cv.json 复制起步）
# 可选：再维护一份 data/cv-base.md 人工可读副本（非基础稿，仅备份/对照用）
```

## 常用命令（在 AI CLI 中触发）

| 命令 | 作用 |
|------|------|
| `/jobpilot-cn oferta <JD>` | 评估一个 JD（A–H 框架） |
| `/jobpilot-cn pdf` | 由 `data/cv-base.json` 基础稿生成中文 PDF / Word 简历 |
| `/jobpilot-cn contacto-cn <渠道/场景>` | 生成触达话术草稿 |
| `/jobpilot-cn tracker` | 查看投递追踪表 |

**输出目录**：PDF 在 `output/`（已 gitignore，可随时重生）。

## 你的简历数据（不入仓）

本项目**不包含任何真实简历**。`data/` 与 `output/` 目录均已被 `.gitignore` 忽略，**你的个人简历、投递记录、评估报告永远不会进入 Git 历史或公开仓库**。

使用方式：

1. 复制脱敏示例作为起点：`cp schema/example-cv.json data/cv-base.json`
2. 在 `data/cv-base.json` 中填写你自己的真实信息（该文件被 gitignore，不会上传）
3. 一键出文件（HTML→PDF→DOCX）：`npm run export:cv -- data/cv-base.json 我的简历 templates/cv-zh-minimal.html`
   - 第二参数为输出名（决定 `output/我的简历.pdf` 与 `.docx`），第三参数可选模板（默认 minimal，可选 modern）
   - DOCX 依赖 `python-docx`；未装会跳过并提示
4. 仅看渲染效果（用脱敏示例）：`npm run demo:minimal` / `npm run demo:modern`

## 目录结构

- `modes/`：评估、改写、触达、PDF 等所有 prompt 逻辑
- `templates/`：中文简历 HTML 模板
- `config/`：用户画像与职位发现配置
- `scripts/`：简历构建与 PDF 渲染脚本
- `data/`：你的简历、评估报告、投递追踪表（运行期生成）

## 简历模板

内置两套中文简历模板，通过 `build-cv.mjs` 的第三个参数切换（或一键 demo 命令）：

| 模板 | 文件 | 风格 |
|------|------|------|
| minimal（默认） | `templates/cv-zh-minimal.html` | 单栏 · 沉稳 navy 标题 · 灰色能力标签 |
| modern | `templates/cv-zh-modern.html` | 双栏 · 深色侧栏 + 青色强调 · 科技/创业风 |

一键生成两版示例 PDF（基于脱敏示例 `schema/example-cv.json`）：

```bash
npm run demo:minimal   # → output/example-minimal.pdf
npm run demo:modern    # → output/example-modern.pdf
```

手动指定模板：

```bash
node scripts/build-cv.mjs <简历.json> <输出.html> <模板.html>
node scripts/render-pdf.mjs <输出.html> <输出.pdf>
```

## 合规与免责声明

- **平台扫描**：国内招聘平台（BOSS 直聘 / 猎聘 / 智联 / 前程无忧 / 拉勾 / 牛客 / 脉脉）普遍强反爬、需登录态且用户协议禁止自动化抓取。**本项目不提供登录态爬取**，仅建议用公开搜索方式发现职位；任何登录态抓取风险自负，并遵守各平台 ToS 与当地法律。
- **触达**：AI 只生成话术**草稿**，由你人工发送；不提供自动群发脚本（违反平台 ToS 且封号风险极高）。
- **风险识别不构成法律建议**：Block G 的招聘骗局信号仅为经验提示，重大决策请咨询专业人士。
- **简历真实性**：你对自己简历内容的真实性负责；本工具只改写表达，不虚构经历。

## 第三方依赖

本项目源码均为独立实现，版权归 jobpilot-cn 所有。唯一运行时依赖是 **Playwright**（微软开源库，Apache-2.0 / MIT，用于将中文 HTML 渲染为 PDF）：

- 它**不随本仓库分发**：`node_modules/` 已被 `.gitignore` 忽略，clone 本项目不会包含任何第三方代码或版权声明。
- 它**只存在于你本机**：执行 `npm install` 时下载到本地 `node_modules/`，是临时安装的工具，不属于本项目源码。
- 其许可证要求的版权声明仅保留在它**自己的文件**内，不影响本项目的 MIT 版权归属。

如需完全离线、零依赖运行，可改用系统已安装的 Chromium 驱动渲染（见 `scripts/render-pdf.mjs` 注释），但默认方案以 Playwright 依赖声明为准。

## 许可

MIT 协议。详见 [`LICENSE`](./LICENSE)。本仓库不含任何第三方受版权保护的源码或文档。

---

## FAQ / 排错

**Q：生成的 PDF 中文乱码或显示为方块（豆腐块）？**
A：这是本机缺少中文字体导致的——Playwright 用系统字体把 HTML 渲染成 PDF。请先安装一款中文字体（Windows 自带「微软雅黑 / 宋体」、macOS 自带「苹方 / 华文」；Linux 可装 `fonts-noto-cjk` 或 `wqy-zenhei`），安装后重跑 `npm run export:cv` 即可正常。

**Q：简历里的电话 / 邮箱图标没显示？**
A：本项目已改用纯文本标签（电话：/ 邮箱：/ 微信：/ 所在地：/ 链接：），不依赖 emoji 字体，正常情况下不会出现图标缺失。若仍看到异常，请确认模板未被改动。

**Q：没装 python-docx，能生成 Word 吗？**
A：不能生成 .docx，但 PDF 仍可正常生成；脚本会跳过 DOCX 并提示。装好依赖后重跑即可：`pip install python-docx`。

**Q：运行 `npm install` 很慢或失败？**
A：Playwright 会下载 Chromium，体积较大。请确认网络可用；国内可配置 npm 镜像。Chromium 下载失败时可参考 `scripts/render-pdf.mjs` 注释改用系统已装的 Chromium。
