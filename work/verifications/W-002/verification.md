# 部署验证 · W-002

## 验证范围
- 对象：资产台账部署到 125.77.25.229（pm2，端口 3000，ufw 放行 3000/tcp）
- 方式：公网 HTTP 实测

## 验证结果
- GET http://125.77.25.229:3000/healthz → 200 {"status":"ok"}
- GET http://125.77.25.229:3000/ → 200（看板页面，title/h1 正确）
- POST /assets → 201（创建 edge-firewall-01）
- GET /assets → 200（列表含新资产，已持久化）
- pm2 status: online（pid 4081790）

## 结论
VERIFIED（公网可访问，读写正常）
