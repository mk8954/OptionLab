function navbar(active = "home") {
    return `
    <nav class="bottom-nav">

        <button class="${active==="home"?"active":""}" onclick="loadPage('dashboard')">
            <span class="material-symbols-outlined">home</span>
            <small>Home</small>
        </button>

        <button class="${active==="trade"?"active":""}" onclick="loadPage('trade')">
            <span class="material-symbols-outlined">trending_up</span>
            <small>Trade</small>
        </button>

        <button class="${active==="positions"?"active":""}" onclick="loadPage('positions')">
            <span class="material-symbols-outlined">work</span>
            <small>Positions</small>
        </button>

        <button class="${active==="analytics"?"active":""}" onclick="loadPage('analytics')">
            <span class="material-symbols-outlined">analytics</span>
            <small>Analytics</small>
        </button>

        <button class="${active==="profile"?"active":""}" onclick="loadPage('profile')">
            <span class="material-symbols-outlined">person</span>
            <small>Profile</small>
        </button>

    </nav>
    `;
}
