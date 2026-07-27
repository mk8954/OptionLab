// ===========================
// INDEX TABS
// ===========================


const INDEXES = {
    NIFTY: {
        name: "NIFTY 50",
        spot: 24350,
        lot: 65
    },
    BANKNIFTY: {
        name: "BANKNIFTY",
        spot: 56500,
        lot: 30
    },
    FINNIFTY: {
        name: "FINNIFTY",
        spot: 26250,
        lot: 60
    },
    MIDCPNIFTY: {
        name: "MIDCPNIFTY",
        spot: 14650,
        lot: 120
    },
    SENSEX: {
        name: "SENSEX",
        spot: 82500,
        lot: 20
    }
};
let selectedSide ="";
let selectedStrike =0;
let startY = 0;
let currentY = 0;
let isDragging = false;
let currentIndex = "NIFTY";


function buildIndexTabs() {


    console.log("Index tabs ready");


}
// ===========================
// EXPIRY TABS
// ===========================


const EXPIRIES = [
    "24 Jul",
    "31 Jul",
    "07 Aug",
    "28 Aug"
];


let currentExpiry = EXPIRIES[0];


function createExpiryTabs() {


    console.log("Expiry tabs ready");


}
// ===========================
// LOAD INDEX
// ===========================


function loadIndex(index) {


    currentIndex = index;


    const data = INDEXES[index];


    document.getElementById("indexName").innerText = data.name;
    document.getElementById("spotPrice").innerText = data.spot;
    document.getElementById("atmStrike").innerText = data.spot;
    document.getElementById("lotSize").innerText = data.lot;


    console.log("Loaded:", index);


}
// ===========================
// OPTION CHAIN
// ===========================


function generateOptionChain() {


    const holder = document.getElementById("optionRows");


    if (!holder) return;


    holder.innerHTML = "";


    const atm = INDEXES[currentIndex].spot;


    const step = 50;


    for (let i = 8; i >= -8; i--) {


        const strike = atm + (i * step);


        let callText = "";
        let putText = "";


        let callClass = "";
        let putClass = "";


        if (i > 0) {


            callText = "+" + (i * step);
            putText = "-" + (i * step);


            callClass = "call-green";
            putClass = "put-red";


        }
        else if (i < 0) {


            callText = "-" + (Math.abs(i) * step);
            putText = "+" + (Math.abs(i) * step);


            callClass = "call-red";
            putClass = "put-green";


        }
        else {


            callText = "ATM";
            putText = "ATM";


            callClass = "atm-chip";
            putClass = "atm-chip";


        }

        if (strike === atm) {


    holder.innerHTML += `
        <div class="spot-divider">
            <span>${INDEXES[currentIndex].name} ${INDEXES[currentIndex].spot}</span>
        </div>
    `;
    }
    else
    {holder.innerHTML += `


        <div class="chain-row ${i===0 ? "atm-row" : ""}">


            <div class="distance-chip ${callClass}"
                 onclick="selectStrike('CALL',${strike})">


                 ${callText}


            </div>


            <div class="strike-text">


                 ${strike}


            </div>


            <div class="distance-chip ${putClass}"
                 onclick="selectStrike('PUT',${strike})">


                 ${putText}


            </div>


        </div>


        `;
    }

    }


}
function selectStrike(side, strike){

    console.log(side + " " + strike);
    openTradeSheet(side, strike);
}

function openTradeSheet(side, strike){


    selectedSide = side;
    selectedStrike = strike;


    const option = side === "CALL" ? "CE" : "PE";


    document.getElementById("sheetTypeIcon").textContent =
        side === "CALL" ? "🟢" : "🔴";


    document.getElementById("sheetInstrument").textContent =
        `${currentIndex} ${strike} ${option}`;


    document.getElementById("sheetExpiry").textContent =
        currentExpiry;


    document.getElementById("sheetLot").textContent =
        `Lot ${INDEXES[currentIndex].lot}`;


    document.getElementById("tradeSheet")
        .classList.add("show");


}
function closeTradeSheet(){


    document
        .getElementById("tradeSheet")
        .classList.remove("show");


}
function enableSheetSwipe(){


    const sheet = document.getElementById("tradeSheet");


    sheet.addEventListener("touchstart",(e)=>{


        startY = e.touches[0].clientY;
        isDragging = true;


    });


    sheet.addEventListener("touchmove",(e)=>{


        if(!isDragging) return;


        currentY = e.touches[0].clientY;


        let diff = currentY - startY;


        if(diff > 0){


            sheet.style.transform = `translateY(${diff}px)`;


        }


    });


    sheet.addEventListener("touchend",()=>{


        isDragging = false;


        let diff = currentY - startY;


        if(diff > 120){


            closeTradeSheet();


        }


        sheet.style.transform = "translateY(0)";


    });


}
function bindOptionClicks() {


    document.querySelectorAll(".call-cell,.put-cell").forEach(cell => {


        cell.onclick = () => {


            const strike = cell.dataset.strike;
            const type = cell.dataset.type;


            console.log("Selected", type, strike);


            // Trade popup will open here later
        };


    });


}

function initTrade() {


    currentIndex = "NIFTY";


    buildIndexTabs();


    createExpiryTabs();


    loadIndex(currentIndex);

    enableSheetSwipe();
    generateOptionChain();

    console.log("INIT TRADE RUNNING")


}


window.initTrade = initTrade;
