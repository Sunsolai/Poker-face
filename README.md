# Poker Face

<p align="center">
  <img src="assets/poker-face-banner.png" alt="Poker Face — AI Facial Aesthetic Preview" width="100%">
</p>

<p align="center">
  Click <strong>English</strong> or <strong>简体中文</strong> below to switch language on this page.<br>
  点击下方 <strong>English</strong> 或 <strong>简体中文</strong>，在当前页面切换语言。
</p>

<details name="readme-lang" open>
<summary><img src="https://img.shields.io/badge/English-2B2B2B?style=for-the-badge" alt="English"></summary>

<p align="center">
  <a href="#quick-start"><img src="https://img.shields.io/badge/Quick%20Start-Get%20Started-E8A0BF?style=for-the-badge&labelColor=2B2B2B" alt="Quick Start"></a>
  &nbsp;
  <a href="#commands"><img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>
  &nbsp;
  <a href="#mvp--v1-decisions"><img src="https://img.shields.io/badge/Model-gpt--image--2-111111?style=for-the-badge" alt="gpt-image-2"></a>
  &nbsp;
  <a href="#safety-disclaimer"><img src="https://img.shields.io/badge/Simulation-Only-6B7280?style=for-the-badge" alt="Simulation Only"></a>
</p>

Poker Face is a desktop-first web app for women aged 18–55 who want to upload a selfie and privately preview possible facial aesthetic changes before making any real-world decision.

> This is a visualization and education tool — not a medical device, and not a substitute for advice from a licensed professional.

## Space Configuration

| Field | Value |
| --- | --- |
| title | Poker Face |
| emoji | 🃏 |
| colorFrom | pink |
| colorTo | gray |
| sdk | docker |
| app_port | 7860 |
| pinned | false |

## Quick Start

1. Copy `.env.example` to `.env` and fill in your relay API key.
2. Run `python server.py`.
3. Open `http://127.0.0.1:8000`.

No package install is required for the current MVP.

## MVP / V1 Decisions

| Topic | Decision |
| --- | --- |
| Generation | Real AI image generation required |
| Active model | `gpt-image-2` |
| Relay | OpenAI-compatible API |
| Gemini | Kept only as commented reference |
| Platform | Desktop-first web app |
| Gallery | Pinterest-style masonry |
| Accounts | Not required in V1 |
| Storage | Lightweight UI state in `localStorage` only |
| Images | Do **not** store base64 images in `localStorage` |
| Realism | Conservative, identity-preserving edits |

## Current Implementation

- Python standard-library web server in `server.py`
- Static frontend in `static/` (with `public/` for Vercel static serving)
- OpenAI-compatible GPT image edit relay using `gpt-image-2`
- Desktop-first masonry gallery with left-side filter panel
- Per-effect generation status and recoverable error cards
- Frontend timeout of 150 seconds per generated image
- Dev watcher + `/api/dev-version` frontend reload polling

## Commands

| Action | Command |
| --- | --- |
| Dev | `python server.py` |
| Open | `http://127.0.0.1:8000` |
| Python syntax check | `python -m py_compile server.py` |
| JS syntax check | `node --check static\app.js` |
| Install | Not required |
| Build | Not required |
| Lint | Not configured yet |

`python server.py` starts a no-dependency development watcher. It restarts the child app when these files change:

- `server.py`
- `.env`
- `.env.example`
- `README.md`
- `AGENTS.md`
- any file under `static/`

The frontend polls `/api/dev-version` every second and refreshes when the backend restart token changes.

## Environment

Copy `.env.example` into `.env` before running. **Do not commit real API keys.**

Required for real generation:

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

Optional:

- `PORT` — default `8000`
- `POKER_FACE_MODEL` — default `gpt-image-2`
- `POKER_FACE_RELAY_FORMAT` — default `openai`
- `POKER_FACE_RELAY_AUTH` — default `bearer`
- `POKER_FACE_REQUEST_TIMEOUT` — default `120`

## Relay API Contract

Active path uses GPT image generation through an OpenAI-compatible relay.

- `POKER_FACE_RELAY_FORMAT=openai`: multipart image edit request with `model`, `prompt`, `image[]`, `n`, `size`, and `quality`.

`POKER_FACE_RELAY_URL` may be:

- a base URL → appends `/v1/images/edits`
- a `/v1` URL → appends `/images/edits`
- a full endpoint already ending in `/images/edits`

Accepted response formats include OpenAI `b64_json`, direct `url`, or generic base64 fields.

## Backend API

### `GET /api/config`

Returns model, relay, readiness, relay format, and storage state.

### `GET /api/dev-version`

Returns the current development reload token.

### `POST /api/generate`

Generates one edited preview image.

Request:

```json
{
  "image": "data:image/png;base64,...",
  "effectId": "under_eye",
  "label": "Under-eye",
  "intensity": "balanced"
}
```

Response:

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

## Target Users

- Women aged 18–55
- People curious about cosmetic or beauty changes
- Users who want a private, low-pressure way to compare looks
- Users preparing for consultation or product decisions

## Core Experience

1. Upload a clear front-facing photo.
2. Choose one or more appearance changes.
3. Generate realistic previews from the uploaded photo.
4. Browse results in a masonry gallery.
5. Select any result as the featured preview.
6. Compare before and after side by side.
7. Save-toggle, delete, regenerate, or clear the local session.

## Result Gallery Layout

- 3-column masonry on smaller screens; 4 columns on desktop
- One larger featured preview by card sizing rules
- Mixed heights, tight gaps, 8px rounded corners
- Edge-to-edge image fills inside each card
- Sticky left sidebar for upload, intensity, filters, actions, and status

## Appearance Changes

Current default selectable set contains **20** effects:

1. Smaller nose
2. Nose bridge
3. Nose tip
4. Lip filler
5. Upper lip
6. Lower lip
7. Fox eye lift
8. Brow lift
9. Eyelid lift
10. Face lift
11. Jawline
12. Chin refinement
13. Cheek volume
14. Cheekbone
15. Forehead smoothing
16. Crow's feet
17. Under-eye
18. Skin tone
19. Skin texture
20. Facial slimming

Progress uses the selected count, e.g. `2 of 3`.

## Gallery Interaction

- Tap a card to select it as featured.
- Compare selected image with the original.
- Adjust prompt intensity before generation.
- Save-toggle, delete, or regenerate single effects.
- Failed effects can be retried without losing successful results.

## Loading And Empty States

**Before generation**

- Show the uploaded image and selected effect count.

**During generation**

- Fill cards progressively.
- Show progress such as `8 of 20`.
- Show current status such as `Generating Under-eye`.

**If generation fails**

- Show which effect failed and allow retry.
- Keep successful results visible.
- Continue remaining effects when the error is recoverable.
- Stop on hard configuration, auth, or model errors.

## Frontend State And Storage

Lightweight state is stored in `localStorage` under:

```text
poker-face-session-v1
```

Stored fields include selected effect IDs, selected card ID, and small result metadata.

Uploaded and generated base64 images are **not** stored in `localStorage`; they stay in browser memory for the active page session.

If saving fails, `safeSaveState()` logs the issue and generation continues.

## Important Product Principles

- Results must be labeled as simulations.
- Do not promise medical accuracy or real procedure outcomes.
- Encourage consulting licensed professionals before procedures.
- Treat uploaded photos as sensitive personal data.
- Avoid language that shames natural facial features.
- Keep the product voice supportive, neutral, and clear.
- Labels must not cover eyes, nose, or lips.

## Privacy Requirements

- Ask for consent before processing photos.
- Make retention rules clear.
- Allow clearing uploaded photos and generated results from the local session.
- Do not use photos for training or marketing without explicit consent.
- Do not commit `.env`, API keys, user photos, generated face images, or logs.

## MVP Acceptance Criteria

- Upload one face photo.
- Choose one or more preview effects.
- Generate realistic previews through the configured relay.
- Show results in a masonry collage.
- Select a featured preview and compare with the original.
- Delete uploaded and generated images from the local session.
- Show a visible simulation disclaimer.
- Do not persist generated images in `localStorage`.

## Future Features

- IndexedDB or temporary backend image storage
- Download generated previews
- Multi-change combinations
- Adjustable intensity sliders
- Saved look collections
- Consultation preparation notes
- Mobile-first camera upload flow

## Git Notes

Runtime files ignored by Git:

- `.env`
- `__pycache__/`
- `*.pyc`
- `server.out.log`
- `server.err.log`

## Safety Disclaimer

Poker Face provides visual simulations only. Results may not match real cosmetic procedures, skincare outcomes, makeup results, or medical treatments. Users should consult qualified professionals before making medical, cosmetic, or financial decisions.

</details>

<details name="readme-lang">
<summary><img src="https://img.shields.io/badge/简体中文-E8A0BF?style=for-the-badge&labelColor=2B2B2B" alt="简体中文"></summary>

<p align="center">
  <a href="#快速开始"><img src="https://img.shields.io/badge/快速开始-开始使用-E8A0BF?style=for-the-badge&labelColor=2B2B2B" alt="快速开始"></a>
  &nbsp;
  <a href="#常用命令"><img src="https://img.shields.io/badge/Python-3.x-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>
  &nbsp;
  <a href="#mvp--v1-决策"><img src="https://img.shields.io/badge/Model-gpt--image--2-111111?style=for-the-badge" alt="gpt-image-2"></a>
  &nbsp;
  <a href="#安全声明"><img src="https://img.shields.io/badge/仅限模拟-6B7280?style=for-the-badge" alt="仅限模拟"></a>
</p>

Poker Face 是一款桌面优先的网页应用，面向 18–55 岁女性用户。上传自拍后，即可私密预览可能的面部美学变化，帮助在真实决策前进行可视化探索。

> 本产品仅为可视化与教育工具，不是医疗器械，也不能替代持证专业人士的建议。

## Space 配置

| 字段 | 值 |
| --- | --- |
| title | Poker Face |
| emoji | 🃏 |
| colorFrom | pink |
| colorTo | gray |
| sdk | docker |
| app_port | 7860 |
| pinned | false |

## 快速开始

1. 将 `.env.example` 复制为 `.env`，并填入中继 API Key。
2. 运行 `python server.py`。
3. 在浏览器打开 `http://127.0.0.1:8000`。

当前 MVP 无需安装第三方 Python 依赖。

## MVP / V1 决策

| 主题 | 决策 |
| --- | --- |
| 生成 | 必须使用真实 AI 生图 |
| 当前模型 | `gpt-image-2` |
| 中继 | OpenAI 兼容 API |
| Gemini | 仅保留注释参考代码 |
| 平台 | 桌面优先网页应用 |
| 画廊 | Pinterest 风格瀑布流 |
| 账号 | V1 不需要账号 |
| 存储 | 仅用 `localStorage` 保存轻量 UI 状态 |
| 图片 | **禁止**将 base64 图片写入 `localStorage` |
| 真实感 | 保守、保持身份一致的微调 |

## 当前实现

- 基于 Python 标准库的 Web 服务：`server.py`
- 静态前端位于 `static/`（Vercel 部署使用 `public/`）
- 通过 OpenAI 兼容中继调用 `gpt-image-2` 进行图片编辑
- 桌面优先瀑布流画廊 + 左侧效果筛选面板
- 按效果展示生成状态，可恢复错误卡
- 前端单张生成超时 150 秒
- 开发热重载监视器 + 前端轮询 `/api/dev-version`

## 常用命令

| 操作 | 命令 |
| --- | --- |
| 开发启动 | `python server.py` |
| 打开应用 | `http://127.0.0.1:8000` |
| Python 语法检查 | `python -m py_compile server.py` |
| JS 语法检查 | `node --check static\app.js` |
| 安装依赖 | 当前无需安装 |
| 构建 | 当前无需构建 |
| 代码检查 | 暂未配置 |

`python server.py` 会启动无依赖开发监视器，下列文件变更时自动重启子进程：

- `server.py`
- `.env`
- `.env.example`
- `README.md`
- `AGENTS.md`
- `static/` 下任意文件

前端每秒轮询 `/api/dev-version`，后端重启令牌变化时自动刷新页面。

## 环境配置

运行前将 `.env.example` 复制为 `.env`。**请勿提交真实 API Key。**

真实生成所需：

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

可选：

- `PORT` — 默认 `8000`
- `POKER_FACE_MODEL` — 默认 `gpt-image-2`
- `POKER_FACE_RELAY_FORMAT` — 默认 `openai`
- `POKER_FACE_RELAY_AUTH` — 默认 `bearer`
- `POKER_FACE_REQUEST_TIMEOUT` — 默认 `120`

## 中继 API 约定

当前路径通过 OpenAI 兼容中继调用 GPT 图片生成。

- `POKER_FACE_RELAY_FORMAT=openai`：发送包含 `model`、`prompt`、`image[]`、`n`、`size`、`quality` 的 multipart 图片编辑请求。

`POKER_FACE_RELAY_URL` 可以是：

- 基础 URL → 自动追加 `/v1/images/edits`
- `/v1` URL → 自动追加 `/images/edits`
- 已完整指向 `/images/edits` 的端点

支持 OpenAI `b64_json`、直接 `url`，或其他通用 base64 字段。

## 后端 API

### `GET /api/config`

返回模型、中继、就绪状态、中继格式与存储状态。

### `GET /api/dev-version`

返回当前开发热重载令牌。

### `POST /api/generate`

生成一张编辑后的预览图。

请求：

```json
{
  "image": "data:image/png;base64,...",
  "effectId": "under_eye",
  "label": "Under-eye",
  "intensity": "balanced"
}
```

响应：

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

## 目标用户

- 18–55 岁女性
- 对美容或外观变化好奇的用户
- 希望私密、低压力对比效果的用户
- 咨询前或消费前希望先看效果的用户

## 核心体验

1. 上传清晰正脸照片。
2. 选择一个或多个外观预览效果。
3. 基于上传照片生成真实感预览。
4. 在瀑布流画廊中浏览结果。
5. 将任意结果设为精选预览。
6. 左右对比原图与效果图。
7. 收藏切换、删除、重新生成，或清空本地会话。

## 结果画廊布局

- 小屏约 3 列瀑布流；桌面端 4 列
- 通过卡片尺寸规则突出精选预览
- 高低错落、间隙紧凑、圆角 8px
- 图片铺满卡片边缘
- 左侧粘性栏：上传、强度、筛选、操作与状态

## 外观预览效果

当前默认可选集包含 **20** 个效果：

1. 缩小鼻子
2. 鼻梁塑形
3. 鼻头精修
4. 丰唇
5. 上唇增强
6. 下唇增强
7. 狐狸眼提升
8. 眉部提升
9. 眼睑提升
10. 面部提升
11. 下颌线
12. 下巴精修
13. 面颊丰盈
14. 颧骨轮廓
15. 前额抚平
16. 鱼尾纹淡化
17. 眼下提亮
18. 肤色调整
19. 肤质平滑
20. 面部瘦脸

进度按所选数量显示，例如 `2 of 3`。

## 画廊交互

- 点击卡片设为精选。
- 对比选中图与原图。
- 生成前可调节提示强度。
- 可收藏、删除或单效果重生成。
- 失败效果可重试，不影响已成功结果。

## 加载与空状态

**生成前**

- 显示已上传图片与所选效果数量。

**生成中**

- 结果逐步填入卡片。
- 显示进度，如 `8 of 20`。
- 显示当前状态，如 `Generating Under-eye`。

**若生成失败**

- 标明失败效果并允许重试。
- 保留已成功结果。
- 可恢复错误时继续其余效果。
- 配置、鉴权或模型硬错误时停止。

## 前端状态与存储

轻量状态保存在 `localStorage`，键名为：

```text
poker-face-session-v1
```

保存字段包括所选效果 ID、选中卡片 ID，以及少量结果元数据。

上传图与生成图的 base64 **不会**写入 `localStorage`，仅保存在当前页面会话的浏览器内存中。

若保存失败，`safeSaveState()` 会记录问题，生成流程仍继续。

## 重要产品原则

- 结果必须标注为模拟效果。
- 不承诺医疗准确性或真实手术效果。
- 鼓励术前咨询持证专业人士。
- 将上传照片视为敏感个人数据。
- 避免羞辱自然面部特征的措辞。
- 产品语气应支持、中立、清晰。
- 标签不得遮挡眼、鼻、唇等关键区域。

## 隐私要求

- 处理照片前征求同意。
- 明确保留规则。
- 允许清空本地会话中的上传图与生成结果。
- 未经明确同意，不得将照片用于训练或营销。
- 勿提交 `.env`、API Key、用户照片、生成人脸图或日志。

## MVP 验收标准

- 可上传一张人脸照片。
- 可选择一个或多个预览效果。
- 通过已配置中继生成真实感预览。
- 以瀑布流拼贴展示结果。
- 可选精选预览并与原图对比。
- 可从本地会话删除上传图与生成图。
- 页面可见模拟免责声明。
- 生成图不持久化到 `localStorage`。

## 未来功能

- IndexedDB 或后端临时图片存储
- 下载生成预览
- 多效果组合预览
- 可调强度滑杆
- 已保存造型合集
- 咨询准备笔记
- 移动端优先拍照上传流程

## Git 说明

Git 已忽略的运行时文件：

- `.env`
- `__pycache__/`
- `*.pyc`
- `server.out.log`
- `server.err.log`

## 安全声明

Poker Face 仅提供视觉模拟效果。结果可能与真实医美手术、护肤、化妆或医疗结果不一致。用户在做出医疗、美容或财务决策前，应咨询合格专业人士。

</details>
