// =========================
// OPTIONLAB APP.JS
// =========================

window.onload = () => {
    loadPage("dashboard");
};

async function loadPage(page) {

    try {

        const response = await fetch(`pages/${page}.html`);
        const html = await response.text();

        document.getElementById("app").innerHTML =
            html + navbar(page);

        // Run page initialization
        switch (page) {

            case "dashboard":
                if (typeof initDashboard === "function")
                    initDashboard();
                break;

            case "trade":
                if (typeof generateOptionChain === "function")
                    generateOptionChain();
                break;

            case "positions":
                if (typeof initPositions === "function")
                    initPositions();
                break;

            case "analytics":
                if (typeof initAnalytics === "function")
                    initAnalytics();
                break;

            case "profile":
                if (typeof initProfile === "function")
                    initProfile();
                break;

        }

    } catch (err) {

        console.error(err);

        document.getElementById("app").innerHTML =
            "<h2 style='padding:30px;color:white'>Page not found</h2>";

    }

}
