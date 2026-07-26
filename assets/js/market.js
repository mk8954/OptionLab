// ==========================================
// OptionLab - Market Module
// ==========================================


const MARKETS = {


    NIFTY: {
        name: "NIFTY 50",
        spot: 24350,
        step: 50,
        lot: 75
    },


    BANKNIFTY: {
        name: "BANKNIFTY",
        spot: 56200,
        step: 100,
        lot: 35
    },


    FINNIFTY: {
        name: "FINNIFTY",
        spot: 26750,
        step: 50,
        lot: 65
    },


    MIDCPNIFTY: {
        name: "MIDCPNIFTY",
        spot: 14325,
        step: 25,
        lot: 120
    },


    SENSEX: {
        name: "SENSEX",
        spot: 75600,
        step: 100,
        lot: 20
    }


};


let currentMarket = "NIFTY";


function initMarket() {


    bindMarketTabs();


    loadMarket(currentMarket);


}


function bindMarketTabs() {


    document
        .querySelectorAll(".index-tab")
        .forEach(button => {


            button.addEventListener("click", () => {


                document
                    .querySelectorAll(".index-tab")
                    .forEach(tab => tab.classList.remove("active"));


                button.classList.add("active");


                currentMarket = button.dataset.market;


                loadMarket(currentMarket);


            });


        });


}


function loadMarket(market) {


    const data = MARKETS[market];


    document.getElementById("indexName").textContent = data.name;


    document.getElementById("spotPrice").textContent = data.spot;


    document.getElementById("atmStrike").textContent = data.spot;


    document.getElementById("lotSize").textContent = data.lot;


}
