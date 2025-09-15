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

function loadContent(url, link) {
    return fetch(url)
        .then(response => response.text())
        .then(html => {
            document.getElementById('main-content').innerHTML = html;

            // 高亮当前选中导航
            document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));
            if (link) link.classList.add('active');
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

function renderDatasetDetail() {
    const { params } = getHashAndQuery();
    const mdName = params.get('md') || 'demo2';
    const mdPath = `md/${mdName}.md`;
    const root = document.getElementById('md-root');
    const titleEl = document.getElementById('md-title');
    if (!root) return;

    ensureMarkedLoaded()
        .then(() => fetch(mdPath))
        .then(res => {
            if (!res.ok) throw new Error('Markdown 加载失败');
            return res.text();
        })
        .then(text => {
            // 简单取第一行标题作为页面标题
            const firstLine = text.split('\n').find(l => l.trim().startsWith('# '));
            if (titleEl && firstLine) titleEl.textContent = firstLine.replace(/^#\s*/, '').trim();

            if (window.marked && typeof window.marked.parse === 'function') {
                root.innerHTML = window.marked.parse(text, { gfm: true, breaks: true });
            } else {
                root.textContent = text;
            }
        })
        .catch(err => {
            if (root) root.innerHTML = '<p class="text-muted">内容加载失败或文档不存在。</p>';
            console.error(err);
        });
}

function renderFromHash() {
    const { hash } = getHashAndQuery();
    const routeKey = routes[hash] ? hash : (routes[hash.split('?')[0]] ? hash.split('?')[0] : '#home');
    const link = document.querySelectorAll('.nav-link')[routes[routeKey].index];
    loadContent(routes[routeKey].url, link).then(() => {
        if (routeKey === '#dataset-detail') {
            renderDatasetDetail();
        }
    });
}

// 页面加载时按 hash 渲染当前页，且支持前进/后退
document.addEventListener("DOMContentLoaded", function () {
    renderFromHash();
    window.addEventListener('hashchange', renderFromHash);
});