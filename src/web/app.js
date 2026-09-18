const API = 'http://127.0.0.1:3000';
const rows = document.getElementById('rows');
const msg = document.getElementById('msg');
async function refresh() {
  const res = await fetch(API + '/assets');
  const assets = await res.json();
  rows.innerHTML = assets.map((a) => `<tr><td>${a.id}</td><td>${a.name}</td><td>${a.category}</td><td>${a.owner}</td><td>${a.status}</td><td>${a.createdAt}</td></tr>`).join('');
}
document.getElementById('create').addEventListener('submit', async (e) => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const body = { name: fd.get('name'), category: fd.get('category'), owner: fd.get('owner') };
  const res = await fetch(API + '/assets', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  msg.textContent = res.status === 201 ? '已创建' : '创建失败：' + (await res.text());
  if (res.status === 201) { e.target.reset(); await refresh(); }
});
refresh();
