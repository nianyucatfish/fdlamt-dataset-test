// 统一接管 # 路由点击，确保 hash 正确更新
document.body.addEventListener('click', function (e) {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;

    const href = a.getAttribute('href') || '';
    // 仅处理定义在 routes 中的路由以及详情页路由
    if (routes[href] || href.startsWith('#dataset-detail')) {
        e.preventDefault();
        if (window.location.hash !== href) {
            window.location.hash = href; // 触发 hashchange → renderFromHash
        } else {
            // 若与当前 hash 相同，主动重渲染一次
            renderFromHash();
        }
    }
});
