---
title: Poker Face
emoji: 🃏
colorFrom: pink
colorTo: gray
sdk: docker
app_port: 7860
pinned: false
---

<p align="center">
  <img src="assets/poker-face-banner.png" alt="Poker Face — AI Facial Aesthetic Preview" width="100%">
</p>

<p align="center">
  <a href="#quick-start--快速开始"><img src="https://img.shields.io/badge/Quick%20Start-Get%20Started-E8A0BF?style=for-the-badge&labelColor=2B2B2B" alt="Quick Start"></a>
  &nbsp;
  <a href="#commands--常用命令"><img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>
  &nbsp;
  <a href="#mvp--v1-decisions--mvp--v1-决策"><img src="https://img.shields.io/badge/Model-gpt--image--2-111111?style=for-the-badge" alt="gpt-image-2"></a>
  &nbsp;
  <a href="#safety-disclaimer--安全声明"><img src="https://img.shields.io/badge/Simulation-Only-6B7280?style=for-the-badge" alt="Simulation Only"></a>
</p>

<p align="center">
  <a href="#environment--环境配置"><img src="https://img.shields.io/badge/Setup-.env-pink?style=flat-square" alt="Setup"></a>
  <a href="#backend-api--后端-api"><img src="https://img.shields.io/badge/API-/api/generate-lightgrey?style=flat-square" alt="API"></a>
  <a href="#privacy-requirements--隐私要求"><img src="https://img.shields.io/badge/Privacy-Local%20Session-success?style=flat-square" alt="Privacy"></a>
  <a href="#appearance-changes--外观预览效果"><img src="https://img.shields.io/badge/Effects-20+-informational?style=flat-square" alt="Effects"></a>
</p>

# Poker Face | 扑克脸

**EN:** Poker Face is a desktop-first web app for women aged 18–55 who want to upload a selfie and privately preview possible facial aesthetic changes before making any real-world decision.

**中文：** Poker Face 是一款桌面优先的网页应用，面向 18–55 岁女性用户。上传自拍后，即可私密预览可能的面部美学变化，帮助在真实决策前进行可视化探索。

> This is a visualization and education tool — not a medical device, and not a substitute for advice from a licensed professional.  
> 本产品仅为可视化与教育工具，不是医疗器械，也不能替代持证专业人士的建议。

## Quick Start | 快速开始

1. Copy `.env.example` to `.env` and fill in your relay API key.  
   将 `.env.example` 复制为 `.env`，并填入中继 API Key。
2. Run `python server.py`.  
   运行 `python server.py`。
3. Open `http://127.0.0.1:8000`.  
   在浏览器打开 `http://127.0.0.1:8000`。

No package install is required for the current MVP.  
当前 MVP 无需安装第三方 Python 依赖。

## MVP / V1 Decisions | MVP / V1 决策

| Topic 主题 | Decision 决策 |
| --- | --- |
| Generation 生成 | Real AI image generation required / 必须使用真实 AI 生图 |
| Active model 当前模型 | `gpt-image-2` |
| Relay 中继 | OpenAI-compatible API / OpenAI 兼容中继 |
| Gemini | Kept only as commented reference / 仅保留注释参考代码 |
| Platform 平台 | Desktop-first web app / 桌面优先网页应用 |
| Gallery 画廊 | Pinterest-style masonry / Pinterest 风格瀑布流 |
| Accounts 账号 | Not required in V1 / V1 不需要账号 |
| Storage 存储 | Lightweight UI state in `localStorage` only / 仅用 `localStorage` 保存轻量 UI 状态 |
| Images 图片 | Do **not** store base64 images in `localStorage` / **禁止**将 base64 图片写入 `localStorage` |
| Realism 真实感 | Conservative, identity-preserving edits / 保守、保持身份一致的微调 |

## Current Implementation | 当前实现

- Python standard-library web server in `server.py`  
  基于 Python 标准库的 Web 服务：`server.py`
- Static frontend in `static/` (with `public/` for Vercel static serving)  
  静态前端位于 `static/`（Vercel 部署使用 `public/`）
- OpenAI-compatible GPT image edit relay using `gpt-image-2`  
  通过 OpenAI 兼容中继调用 `gpt-image-2` 进行图片编辑
- Desktop-first masonry gallery with left-side filter panel  
  桌面优先瀑布流画廊 + 左侧效果筛选面板
- Per-effect generation status and recoverable error cards  
  按效果展示生成状态，可恢复错误卡
- Frontend timeout of 150 seconds per generated image  
  前端单张生成超时 150 秒
- Dev watcher + `/api/dev-version` frontend reload polling  
  开发热重载监视器 + 前端轮询 `/api/dev-version`

## Commands | 常用命令

| Action 操作 | Command 命令 |
| --- | --- |
| Dev 开发启动 | `python server.py` |
| Open 打开应用 | `http://127.0.0.1:8000` |
| Python syntax check Python 语法检查 | `python -m py_compile server.py` |
| JS syntax check JS 语法检查 | `node --check static\app.js` |
| Install 安装依赖 | Not required / 当前无需安装 |
| Build 构建 | Not required / 当前无需构建 |
| Lint 代码检查 | Not configured yet / 暂未配置 |

`python server.py` starts a no-dependency development watcher. It restarts the child app when these files change:  
`python server.py` 会启动无依赖开发监视器，下列文件变更时自动重启子进程：

- `server.py`
- `.env`
- `.env.example`
- `README.md`
- `AGENTS.md`
- any file under `static/` / `static/` 下任意文件

The frontend polls `/api/dev-version` every second and refreshes when the backend restart token changes.  
前端每秒轮询 `/api/dev-version`，后端重启令牌变化时自动刷新页面。

## Environment | 环境配置

Copy `.env.example` into `.env` before running. **Do not commit real API keys.**  
运行前将 `.env.example` 复制为 `.env`。**请勿提交真实 API Key。**

Required for real generation / 真实生成所需：

- `POKER_FACE_RELAY_URL`
- `POKER_FACE_RELAY_API_KEY`

```bash
PORT=8000
POKER_FACE_MODEL=gpt-image-2
POKER_FACE_RELAY_URL=https://deepsy.top
POKER_FACE_RELAY_API_KEY=replace-with-your-relay-api-key
POKER_FACE_RELAY_FORMAT=openai
POKER_FACE_RELAY_AUTH=bearer
POKER_FACE_REQUEST_TIMEOUT=120
```

Optional / 可选：

- `PORT` — default `8000` / 默认 `8000`
- `POKER_FACE_MODEL` — default `gpt-image-2` / 默认 `gpt-image-2`
- `POKER_FACE_RELAY_FORMAT` — default `openai` / 默认 `openai`
- `POKER_FACE_RELAY_AUTH` — default `bearer` / 默认 `bearer`
- `POKER_FACE_REQUEST_TIMEOUT` — default `120` / 默认 `120`

## Relay API Contract | 中继 API 约定

Active path uses GPT image generation through an OpenAI-compatible relay.  
当前路径通过 OpenAI 兼容中继调用 GPT 图片生成。

- `POKER_FACE_RELAY_FORMAT=openai`: multipart image edit request with `model`, `prompt`, `image[]`, `n`, `size`, and `quality`.  
  发送包含 `model`、`prompt`、`image[]`、`n`、`size`、`quality` 的 multipart 图片编辑请求。

`POKER_FACE_RELAY_URL` may be:

- a base URL → appends `/v1/images/edits`  
  基础 URL → 自动追加 `/v1/images/edits`
- a `/v1` URL → appends `/images/edits`  
  `/v1` URL → 自动追加 `/images/edits`
- a full endpoint already ending in `/images/edits`  
  已完整指向 `/images/edits` 的端点

Accepted response formats include OpenAI `b64_json`, direct `url`, or generic base64 fields.  
支持 OpenAI `b64_json`、直接 `url`，或其他通用 base64 字段。

## Backend API | 后端 API

### `GET /api/config`

Returns model, relay, readiness, relay format, and storage state.  
返回模型、中继、就绪状态、中继格式与存储状态。

### `GET /api/dev-version`

Returns the current development reload token.  
返回当前开发热重载令牌。

### `POST /api/generate`

Generates one edited preview image.  
生成一张编辑后的预览图。

Request / 请求：

```json
{
  "image": "data:image/png;base64,...",
  "effectId": "under_eye",
  "label": "Under-eye",
  "intensity": "balanced"
}
```

Response / 响应：

```json
{
  "result": {
    "id": "under_eye-1784172558294",
    "effectId": "under_eye",
    "label": "Under-eye",
    "image": "data:image/png;base64,...",
    "createdAt": 1784172558,
    "prompt": "..."
  }
}
```

## Target Users | 目标用户

- Women aged 18–55 / 18–55 岁女性
- People curious about cosmetic or beauty changes / 对美容或外观变化好奇的用户
- Users who want a private, low-pressure way to compare looks / 希望私密、低压力对比效果的用户
- Users preparing for consultation or product decisions / 咨询前或消费前希望先看效果的用户

## Core Experience | 核心体验

1. Upload a clear front-facing photo. / 上传清晰正脸照片。
2. Choose one or more appearance changes. / 选择一个或多个外观预览效果。
3. Generate realistic previews from the uploaded photo. / 基于上传照片生成真实感预览。
4. Browse results in a masonry gallery. / 在瀑布流画廊中浏览结果。
5. Select any result as the featured preview. / 将任意结果设为精选预览。
6. Compare before and after side by side. / 左右对比原图与效果图。
7. Save-toggle, delete, regenerate, or clear the local session. / 收藏切换、删除、重新生成，或清空本地会话。

## Result Gallery Layout | 结果画廊布局

- 3-column masonry on smaller screens; 4 columns on desktop  
  小屏约 3 列瀑布流；桌面端 4 列
- One larger featured preview by card sizing rules  
  通过卡片尺寸规则突出精选预览
- Mixed heights, tight gaps, 8px rounded corners  
  高低错落、间隙紧凑、圆角 8px
- Edge-to-edge image fills inside each card  
  图片铺满卡片边缘
- Sticky left sidebar for upload, intensity, filters, actions, and status  
  左侧粘性栏：上传、强度、筛选、操作与状态

## Appearance Changes | 外观预览效果

Current default selectable set contains **20** effects:  
当前默认可选集包含 **20** 个效果：

1. Smaller nose / 缩小鼻子  
2. Nose bridge / 鼻梁塑形  
3. Nose tip / 鼻头精修  
4. Lip filler / 丰唇  
5. Upper lip / 上唇增强  
6. Lower lip / 下唇增强  
7. Fox eye lift / 狐狸眼提升  
8. Brow lift / 眉部提升  
9. Eyelid lift / 眼睑提升  
10. Face lift / 面部提升  
11. Jawline / 下颌线  
12. Chin refinement / 下巴精修  
13. Cheek volume / 面颊丰盈  
14. Cheekbone / 颧骨轮廓  
15. Forehead smoothing / 前额抚平  
16. Crow's feet / 鱼尾纹淡化  
17. Under-eye / 眼下提亮  
18. Skin tone / 肤色调整  
19. Skin texture / 肤质平滑  
20. Facial slimming / 面部瘦脸  

Progress uses the selected count, e.g. `2 of 3`.  
进度按所选数量显示，例如 `2 of 3`。

## Gallery Interaction | 画廊交互

- Tap a card to select it as featured. / 点击卡片设为精选。
- Compare selected image with the original. / 对比选中图与原图。
- Adjust prompt intensity before generation. / 生成前可调节提示强度。
- Save-toggle, delete, or regenerate single effects. / 可收藏、删除或单效果重生成。
- Failed effects can be retried without losing successful results. / 失败效果可重试，不影响已成功结果。

## Loading And Empty States | 加载与空状态

**Before generation / 生成前**

- Show the uploaded image and selected effect count. / 显示已上传图片与所选效果数量。

**During generation / 生成中**

- Fill cards progressively. / 结果逐步填入卡片。
- Show progress such as `8 of 20`. / 显示进度，如 `8 of 20`。
- Show current status such as `Generating Under-eye`. / 显示当前状态，如 `Generating Under-eye`。

**If generation fails / 若生成失败**

- Show which effect failed and allow retry. / 标明失败效果并允许重试。
- Keep successful results visible. / 保留已成功结果。
- Continue remaining effects when the error is recoverable. / 可恢复错误时继续其余效果。
- Stop on hard configuration, auth, or model errors. / 配置、鉴权或模型硬错误时停止。

## Frontend State And Storage | 前端状态与存储

Lightweight state is stored in `localStorage` under:  
轻量状态保存在 `localStorage`，键名为：

```text
poker-face-session-v1
```

Stored fields include selected effect IDs, selected card ID, and small result metadata.  
保存字段包括所选效果 ID、选中卡片 ID，以及少量结果元数据。

Uploaded and generated base64 images are **not** stored in `localStorage`; they stay in browser memory for the active page session.  
上传图与生成图的 base64 **不会**写入 `localStorage`，仅保存在当前页面会话的浏览器内存中。

If saving fails, `safeSaveState()` logs the issue and generation continues.  
若保存失败，`safeSaveState()` 会记录问题，生成流程仍继续。

## Important Product Principles | 重要产品原则

- Results must be labeled as simulations. / 结果必须标注为模拟效果。
- Do not promise medical accuracy or real procedure outcomes. / 不承诺医疗准确性或真实手术效果。
- Encourage consulting licensed professionals before procedures. / 鼓励术前咨询持证专业人士。
- Treat uploaded photos as sensitive personal data. / 将上传照片视为敏感个人数据。
- Avoid language that shames natural facial features. / 避免羞辱自然面部特征的措辞。
- Keep the product voice supportive, neutral, and clear. / 产品语气应支持、中立、清晰。
- Labels must not cover eyes, nose, or lips. / 标签不得遮挡眼、鼻、唇等关键区域。

## Privacy Requirements | 隐私要求

- Ask for consent before processing photos. / 处理照片前征求同意。
- Make retention rules clear. / 明确保留规则。
- Allow clearing uploaded photos and generated results from the local session. / 允许清空本地会话中的上传图与生成结果。
- Do not use photos for training or marketing without explicit consent. / 未经明确同意，不得将照片用于训练或营销。
- Do not commit `.env`, API keys, user photos, generated face images, or logs. / 勿提交 `.env`、API Key、用户照片、生成人脸图或日志。

## MVP Acceptance Criteria | MVP 验收标准

- Upload one face photo. / 可上传一张人脸照片。
- Choose one or more preview effects. / 可选择一个或多个预览效果。
- Generate realistic previews through the configured relay. / 通过已配置中继生成真实感预览。
- Show results in a masonry collage. / 以瀑布流拼贴展示结果。
- Select a featured preview and compare with the original. / 可选精选预览并与原图对比。
- Delete uploaded and generated images from the local session. / 可从本地会话删除上传图与生成图。
- Show a visible simulation disclaimer. / 页面可见模拟免责声明。
- Do not persist generated images in `localStorage`. / 生成图不持久化到 `localStorage`。

## Future Features | 未来功能

- IndexedDB or temporary backend image storage / IndexedDB 或后端临时图片存储
- Download generated previews / 下载生成预览
- Multi-change combinations / 多效果组合预览
- Adjustable intensity sliders / 可调强度滑杆
- Saved look collections / 已保存造型合集
- Consultation preparation notes / 咨询准备笔记
- Mobile-first camera upload flow / 移动端优先拍照上传流程

## Git Notes | Git 说明

Runtime files ignored by Git / Git 已忽略的运行时文件：

- `.env`
- `__pycache__/`
- `*.pyc`
- `server.out.log`
- `server.err.log`

## Safety Disclaimer | 安全声明

**EN:** Poker Face provides visual simulations only. Results may not match real cosmetic procedures, skincare outcomes, makeup results, or medical treatments. Users should consult qualified professionals before making medical, cosmetic, or financial decisions.

**中文：** Poker Face 仅提供视觉模拟效果。结果可能与真实医美手术、护肤、化妆或医疗结果不一致。用户在做出医疗、美容或财务决策前，应咨询合格专业人士。
