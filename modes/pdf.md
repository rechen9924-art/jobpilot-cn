# 简历导出（jobpilot-cn）

本文件规定如何把简历数据导出为成品。**默认交付可编辑 Word（.docx）**（用户拿去小改最方便、ATS 解析也稳）；需要像素级排版 PDF 时，用 `scripts/render-pdf.mjs` 一键导出。

> **约束**：模板与脚本**不得包含或注入**任何工具署名 / 生成声明 / 版权水印。详见 SKILL.md「产物约束（硬性规则，写死）」。

---

## 流程（默认出 docx）

1. **准备数据**：把定制后的简历写成 JSON（字段见下），或 AI 直接生成。
2. **生成可编辑 Word**：`scripts/build-cv-docx.py <简历.json> <output/<name>.docx> [--minimal|--modern]` 直接产出单栏、微软雅黑、ATS 安全的 .docx（无需浏览器依赖）。支持两种风格——`--minimal`（默认，深蓝灰、克制）与 `--modern`（青色强调、现代感）；**agent 交付前只问用户选哪种，不再询问是否出 PDF**。
3. **（仅用户主动要求时）导出 PDF**：PDF 不是默认交付，agent 不主动询问；若用户明确要 PDF，先用 `scripts/build-cv.mjs` 注入模板生成 `output/<name>.html`，再用 `scripts/render-pdf.mjs` 打印为 A4 PDF。

> **约束**：模板与脚本**不得包含或注入**任何工具署名 / 生成声明 / 版权水印（如“由 jobpilot-cn 生成”“内容基于本人真实经历”等）。详见 SKILL.md「产物约束（硬性规则，写死）」。

```bash
node scripts/build-cv.mjs data/<简历>.json output/<name>.html templates/cv-zh-minimal.html
node scripts/render-pdf.mjs output/<name>.html output/<name>.pdf
```

## 给用户的白话 intake 模板（直接发，别发 JSON）

> agent 把下面这份**大白话**模板直接发给用户填，**严禁**发下面的 JSON（那是 agent 自己用的）。用户看不懂 `core_capabilities` / `summary` 这些词，也看不懂"项目经历"该写啥——所以每个栏目都配了例子。

```
【你是谁】
名字：
想找什么样的工作（一句话，比如：行政 / 销售 / 教师 / 程序员）：
手机号：
邮箱：
所在城市：
（可选）有没有个人主页 / 作品集链接：

【用两三句话介绍下你自己】
（你是干啥的、最擅长什么、想往哪个方向走。比如：性格外向、沟通强，做过两年销售，想往行政方向走。）

【你最拿手的几样本事】（写 6–10 条短话，比如：嘴皮子利索、干活麻利、有某个证、会做表格、会带人）
1.
2.
…

【你工作过的地方】（倒着写，最近的一段写最上面；每段写清楚你干了啥、带来啥结果）
公司：
职位：
时间（比如 2024.07 – 2026.06）：
在哪里：
你干了啥、带来啥结果（最好带数字，比如卖了多少、服务了多少客户、谈下几个大客户；没有数字就实话实说）：
-
-
-

（还有几段就接着写）

【你牵头做成的一件事 / 一个具体成果】（这一栏很多人以为没东西写，其实都有）
说明：凡是你牵头做成、有个结果的一件事，都算"项目"，别空着。普通人能写的例子：
  · 你搞过的一次促销活动 / 地推 / 展会，带来多少客流或成交；
  · 你从 0 到 1 谈下或搭建的一件事（比如开了一个新客户渠道、拉起一个群）；
  · 你带飞 / 培训过的一批学员；
  · 你搞定的一次大客户投诉或危机；
  · 你组织的一次团建 / 比赛 / 志愿活动。
名称：
你扮演的角色（可空）：
时间（可空）：
用到的东西（可空）：
一句话说清：背景 → 你做了啥 → 结果：
结果：
-
-

【上过什么学】
学校：
学历 / 专业：
时间：

【你会哪些本事、用过哪些工具】（按类写）
比如——证书类：XXX 证、XXX 执照；业务类：客户拓展、客情维护；语言沟通类：普通话、表达力强；工具类：Office、某个软件

【你平时有啥爱好 / 副业】（这栏很多人忽略，但其实很重要！）
说明：爱好可能正好是你求职方向要的，说出来我帮你判断放哪块。例子：
  · 爱攀岩 → 说明你抗压、有目标感；
  · 爱拍抖音、自己剪辑 → 说明你会短视频内容创作；
  · 会摄影、做视频剪辑 → 命中内容创作 / 新媒体方向；
  · 写过公众号、搞过副业、带过社团 / 志愿 → 都算。
爱好 / 副业（随便写，我来帮你判断价值）：
```

> 用户填完发回来，agent 按 `schema/resume.schema.json` 整理成 JSON 基础稿（见下）。**整理时把爱好做"迁移价值路由"**：攀岩 → 抗压·目标感（进核心能力），抖音自剪 → 短视频创作（进技能），摄影 / 剪辑 → 进项目 / 技能。`interests` 字段原样存原始爱好。

## 数据 JSON 字段（schema，agent 视角）

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

- **默认交付（可编辑）**：`output/<name>.docx`（由 `scripts/build-cv-docx.py` 生成）
- **PDF 按需导出**：`output/<name>.pdf` + `output/<name>.html`（`scripts/render-pdf.mjs` 一键导出，像素级排版）
- **简历源 JSON / 评估报告 / 追踪表**：`data/`

## 版本管理

- 基础稿：`data/cv-base.json`（简历基础稿）+ 对应 PDF；可选维护 `data/cv-base.md` 人工可读副本
- 定制稿：`data/cv-公司-岗位.json` 与同名 PDF
- 每次改稿生成**新文件**（带版本号或公司名），不覆盖历史
- 投递日期与所用简历登记到 `data/applications.md`（含「简历附件」列，防发错定制简历）
