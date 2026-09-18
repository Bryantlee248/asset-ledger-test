# 实施工作包（IWP）· IWP-001

## 目标与价值
交付资产台账最小垂直切片：一条从「写入资产」到「列表/详情查看」的端到端链路，验证 API 契约 + 只读看板的可行性。

## 范围与非目标
- 范围：`POST /assets` 创建；`GET /assets` 列表；`GET /assets/{id}` 详情；`GET /healthz`；只读看板（列表页 + 详情页）。
- 非目标：认证/授权、编辑/删除、多环境部署、真实生产数据、搜索/分页（首版可后置）。

## 架构与契约
- 后端 `src/api/`（Node.js，零依赖 http + node:test）；前端 `src/web/`（原生 HTML/JS，只读投影）。
- 数据：`src/api/data/assets.json`（合成数据，JSON 文件持久化）。
- 契约单一事实源：`contracts/openapi.yaml`（实施必须据此实现，验收按此核对）。

## 测试与验收
- 单测：node:test（CRUD + 校验）。
- E2E：Playwright 走查（创建 → 列表 → 详情）。
- 验收：`validate-governance.mjs` 绿 + 契约测试绿 + 用户旅程级 E2E 绿。

## 依赖、批准与回滚
- 依赖：无（零依赖 Node）。
- 批准点：人工授权 W-001 启动；架构评审 R2 批准。
- 回滚：`git revert`；数据为合成，可重建。

## 文件所有权（分权）
- Primary（实施AI）：`src/api/`、`src/web/`、`test/`、`package.json`
- Verifier（验证AI）：`work/verifications/W-001/`（只读复现，不改 Primary 路径）
- 架构AI：控制面（PROJECT.json / GOVERNANCE / ROADMAP / DECISIONS / WORKLOG / scripts / contracts / work/packages / docs / .github）
