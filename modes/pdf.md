# 简历 PDF 生成（jobpilot-cn）

本文件规定如何把简历数据渲染为中文 PDF。

---

## 流程

1. **准备数据**：把定制后的简历写成 JSON（字段见下），或 AI 直接生成。
2. **注入模板**：`scripts/build-cv.mjs` 读取 JSON + 指定模板（`templates/cv-zh-minimal.html` 或 `templates/cv-zh-modern.html`），输出 `output/<name>.html`。
3. **转 PDF**：`scripts/render-pdf.mjs` 用 Playwright 打开 HTML，打印为 A4 PDF 到 `output/<name>.pdf`。

> **约束**：模板与脚本**不得包含或注入**任何工具署名 / 生成声明 / 版权水印（如“由 jobpilot-cn 生成”“内容基于本人真实经历”等）。详见 SKILL.md「产物约束（硬性规则，写死）」。

```bash
node scripts/build-cv.mjs data/<简历>.json output/<name>.html templates/cv-zh-minimal.html
node scripts/render-pdf.mjs output/<name>.html output/<name>.pdf
```

## 数据 JSON 字段（schema）

> 权威字段契约见 [`../schema/resume.schema.json`](../schema/resume.schema.json)，可直接复制 [`../schema/example-cv.json`](../schema/example-cv.json) 作为起点。结构为「`basics` 嵌套基本信息 + 顶层 `summary` / `core_capabilities` / `experience` / `projects` / `education` / `skills` / `extra`」。

```json
{
  "basics": {
    "name": "姓名",
    "title": "求职意向（随 JD 调整，可带方向权重）",
    "phone": "138 0000 0000",
    "email": "a@b.com",
    "wechat": "微信号（可空）",
    "location": "城市",
    "links": ["github.com/you"]
  },
  "summary": "个人简介 2–4 句，含至少 1 个量化亮点",
  "core_capabilities": ["核心能力1", "核心能力2", "核心能力3"],
  "experience": [
    {
      "company": "公司名",
      "role": "职位",
      "dates": "2020.01 – 2023.06",
      "location": "城市（可选）",
      "bullets": ["动作+对象+结果+数字", "成果2"]
    }
  ],
  "projects": [
    { "name": "项目名（可标角色）", "role": "角色（可选）", "tech": "技术栈", "description": "背景→动作→结果（结果可暂空标待补）", "bullets": ["成果1", "成果2"] }
  ],
  "education": [
    { "org": "学校", "title": "学历·专业", "year": "时间", "note": "（可选）GPA/主修" }
  ],
  "skills": [
    { "category": "分类", "items": ["技能1", "技能2"] }
  ],
  "extra": { "certificates": ["证书"], "languages": ["语言"], "awards": ["获奖"] }
}
```

## 模板

- `templates/cv-zh-minimal.html`：极简单栏、ATS 安全，投大厂 / 外企首选
- `templates/cv-zh-modern.html`：深色侧栏 + 青色强调的双栏科技风，投中小公司 / 创业团队

## 输出目录

- **PDF / HTML**：`output/`
- **简历源 JSON / 评估报告 / 追踪表**：`data/`

## 版本管理

- 基础稿：`data/cv-base.json`（简历真源）+ 对应 PDF；可选维护 `data/cv-base.md` 人工可读副本
- 定制稿：`data/cv-公司-岗位.json` 与同名 PDF
- 每次改稿生成**新文件**（带版本号或公司名），不覆盖历史
- 投递日期与所用简历登记到 `data/applications.md`（含「简历附件」列，防发错定制简历）
