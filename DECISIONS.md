# Decisions

| ID | 状态 | 决定 | 理由 | 替代 |
|---|---|---|---|---|
| D-001 | ACCEPTED | 采用 L1 治理，叠加 enterprise-governance（控制面）+ ai-requirement-to-ship（执行面） | 多角色协作 + 真实契约/持久化，需要控制面；执行面保证交付质量 | - |
| D-002 | ACCEPTED | 技术栈：Node.js 零依赖 http + node:test + 原生 HTML/JS | 零依赖、可复现、跨平台；练习项目无需框架 | Express/Fastify |
| D-003 | ACCEPTED | 模块划分：src/api（后端）+ src/web（只读看板），契约单一事实源 contracts/openapi.yaml | 分权边界清晰；契约先行防接口漂移 | 单体混杂 |
| D-004 | ACCEPTED | 部署方式：pm2 于 125.77.25.229，端口 3000，ufw 放行 3000/tcp | 服务器已有 pm2/Node22；演示用途无真实数据 | Docker / nginx 反代 |
