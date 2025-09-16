// function loadContent(url, link) {
//     fetch(url)
//         .then(response => response.text())
//         .then(html => {
//             document.getElementById('main-content').innerHTML = html;

//             // 高亮当前选中导航
//             document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
//             if (link) link.classList.add('active');
//         })
//         .catch(err => {
//             document.getElementById('main-content').innerHTML = "<p>加载失败</p>";
//             console.error(err);
//         });
// }

// // 基于 hash 渲染
// const routes = {
//     '#home': { url: 'content-home.html', index: 0 },
//     '#dataset': { url: 'content-dataset.html', index: 1 },
//     '#about': { url: 'content-about.html', index: 2 },
//     '#contact': { url: 'content-connect_us.html', index: 3 }
// };

// function renderFromHash() {
//     const hash = window.location.hash || '#home';
//     const route = routes[hash] ? hash : '#home';
//     const link = document.querySelectorAll('.nav-link')[routes[route].index];
//     loadContent(routes[route].url, link);
// }

// document.addEventListener("DOMContentLoaded", function () {
//     renderFromHash();
//     window.addEventListener('hashchange', renderFromHash);
// });

// function loadContent(url, link) {
//     return fetch(url)
//         .then(response => response.text())
//         .then(html => {
//             document.getElementById('main-content').innerHTML = html;

//             // 高亮当前选中导航
//             document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
//             if (link) link.classList.add('active');
//         })
//         .catch(err => {
//             document.getElementById('main-content').innerHTML = "<p>加载失败</p>";
//             console.error(err);
//         });
// }

function loadContent(url, link) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;

            // 高亮当前选中导航
            document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
            if (link) link.classList.add('active');

            // 若直接加载了数据集页，确保渲染卡片
            if (typeof renderDatasetList === 'function' && url.indexOf('content-dataset.html') !== -1) {
                renderDatasetList();
            }
        })
        .catch(err => {
            document.getElementById('main-content').innerHTML = "<p>加载失败</p>";
            console.error(err);
        });
}

// 基于 hash 渲染
const routes = {
    '#home': { url: 'content-home.html', index: 0 },
    '#dataset': { url: 'content-dataset.html', index: 1 },
    '#dataset-detail': { url: 'content-dataset-detail.html', index: 1 },
    '#about': { url: 'content-about.html', index: 2 },
    '#contact': { url: 'content-connect_us.html', index: 3 }
};

function ensureMarkedLoaded() {
    return new Promise((resolve, reject) => {
        if (window.marked) {
            resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/marked/marked.min.js';
        script.onload = () => resolve();
        script.onerror = (e) => reject(e);
        document.head.appendChild(script);
    });
}

function getHashAndQuery() {
    const hashFull = window.location.hash || '#home';
    const [hash, query = ''] = hashFull.split('?');
    const params = new URLSearchParams(query);
    return { hash, params };
}

// function renderDatasetDetail() {
//     const { params } = getHashAndQuery();
//     const mdName = params.get('md') || 'demo2';
//     const mdPath = `md/${mdName}.md`;
//     const root = document.getElementById('md-root');
//     const titleEl = document.getElementById('md-title');
//     if (!root) return;

//     const rootRef = root; // 防止过程中节点被替换

//     Promise.all([
//         ensureMarkedLoaded(),
//         fetch(mdPath).then(res => {
//             if (!res.ok) throw new Error('Markdown 加载失败');
//             return res.text();
//         })
//     ])
//         .then(([_, text]) => {
//             const firstLine = text.split('\n').find(l => l.trim().startsWith('# '));
//             const html = (window.marked && typeof window.marked.parse === 'function')
//                 ? window.marked.parse(text, { gfm: true, breaks: true })
//                 : text.replace(/[&<>]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[s]));

//             if (!document.body.contains(rootRef)) return; // 页面已切换则不写入
//             if (titleEl && firstLine) titleEl.textContent = firstLine.replace(/^#\s*/, '').trim();
//             rootRef.innerHTML = html;
//         })
//         .catch(err => {
//             if (document.body.contains(rootRef)) {
//                 rootRef.innerHTML = '<p class="text-muted">内容加载失败或文档不存在。</p>';
//                 if (titleEl) titleEl.textContent = '';
//             }
//             console.error(err);
//         });
// }

function renderDatasetDetail() {
    const { params } = getHashAndQuery();
    const mdName = params.get('md') || 'demo2';
    const mdPath = `md/${mdName}.md`;
    const root = document.getElementById('md-root');
    const titleEl = document.getElementById('md-title');
    const mainContent = document.querySelector('.main-content');

    if (!root || !mainContent) return;

    // 整体隐藏
    mainContent.classList.add('loading');

    Promise.all([
        ensureMarkedLoaded(),
        fetch(mdPath).then(res => {
            if (!res.ok) throw new Error('Markdown 加载失败');
            return res.text();
        })
    ])
        .then(([_, text]) => {
            const firstLine = text.split('\n').find(l => l.trim().startsWith('# '));
            const html = (window.marked && typeof window.marked.parse === 'function')
                ? window.marked.parse(text, { gfm: true, breaks: true })
                : text.replace(/[&<>]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[s]));

            if (!document.body.contains(root)) return;

            if (titleEl && firstLine) {
                titleEl.textContent = firstLine.replace(/^#\s*/, '').trim();
            }
            root.innerHTML = html;

            // 显示整个 main-content
            mainContent.classList.remove('loading');
        })
        .catch(err => {
            if (document.body.contains(root)) {
                root.innerHTML = '<p class="text-muted">内容加载失败或文档不存在。</p>';
                if (titleEl) titleEl.textContent = '';
            }
            console.error(err);

            // 即使失败也要显示
            mainContent.classList.remove('loading');
        });
}




// function renderFromHash() {
//     const { hash } = getHashAndQuery();
//     const routeKey = routes[hash] ? hash : (routes[hash.split('?')[0]] ? hash.split('?')[0] : '#home');
//     const link = document.querySelectorAll('.nav-link')[routes[routeKey].index];
//     loadContent(routes[routeKey].url, link).then(() => {
//         if (routeKey === '#dataset-detail') {
//             renderDatasetDetail();
//         }
//     });
// }

function renderFromHash() {
    const { hash } = getHashAndQuery();
    const routeKey = routes[hash] ? hash : (routes[hash.split('?')[0]] ? hash.split('?')[0] : '#home');
    const link = document.querySelectorAll('.nav-link')[routes[routeKey].index];
    loadContent(routes[routeKey].url, link).then(() => {
        if (routeKey === '#dataset-detail') {
            renderDatasetDetail();
        }
        if (routeKey === '#dataset') {
            renderDatasetList();
        }
    });
}

// 页面加载时按 hash 渲染当前页，且支持前进/后退
document.addEventListener("DOMContentLoaded", function () {
    renderFromHash();
    window.addEventListener('hashchange', renderFromHash);
});

function renderDatasetList() {
    const grid = document.querySelector('.dataset-grid');
    if (!grid) return;

    grid.innerHTML = '<div class="text-muted px-2">正在加载数据集...</div>';

    fetch('config/datasets.json')
        .then(res => {
            if (!res.ok) throw new Error('数据集配置加载失败');
            return res.json();
        })
        .then(data => {
            const list = Array.isArray(data.datasets) ? data.datasets : [];
            if (!list.length) {
                grid.innerHTML = '<div class="text-muted px-2">暂无数据集。</div>';
                return;
            }

            grid.innerHTML = list.map(ds => {
                const href = `#dataset-detail?md=${encodeURIComponent(ds.mdFile || ds.id || '')}`;
                const img = ds.image || '';
                const alt = ds.imageAlt || ds.name || '数据集示意图';
                const title = ds.name || ds.id || '未命名数据集';
                const desc = ds.description || '';

                return `
            <div class="col">
                <div class="card dataset-card h-100">
                    <a href="${href}">
                        <img src="${img}" class="card-img-top" alt="${alt}">
                    </a>
                    <div class="card-body">
                        <h5 class="card-title">
                            <a href="${href}" class="card-title-link">${title}</a>
                        </h5>
                        <p class="card-text">${desc}</p>
                    </div>
                    <div class="card-footer bg-transparent border-0">
                        <a href="${href}" class="btn btn-primary">查看详情</a>
                    </div>
                </div>
            </div>`;
            }).join('');
        })
        .catch(err => {
            console.error(err);
            grid.innerHTML = '<div class="text-muted px-2">数据集加载失败。</div>';
        });
}
