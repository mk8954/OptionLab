// ===========================
// OPTIONLAB TRADE ENGINE
// Part 1
// ===========================

let optionChain = [];

const underlyingPrice = 24350;
const strikeGap = 50;

// Create dummy option chain
function generateOptionChain() {

    optionChain = [];

    for (let strike = 23850; strike <= 24850; strike += strikeGap) {

        const distance = strike - underlyingPrice;

        optionChain.push({

            strike,

            distance,

            callPremium: Math.max(5,
                Math.round(220 - Math.abs(distance) * 0.45)
            ),

            putPremium: Math.max(5,
                Math.round(220 - Math.abs(distance) * 0.45)
            )

        });

    }

    renderOptionChain(optionChain);

}

function renderOptionChain(data) {

    const table = document.getElementById("optionChain");

    if (!table) return;

    table.innerHTML = "";

    data.forEach(item => {

        const atm = item.distance === 0 ? "atm-row" : "";

        table.innerHTML += `

        <div class="chain-row ${atm}">

            <button class="buy-call"
                onclick="buyOption('CALL',${item.strike})">

                BUY
            </button>

            <div class="call-distance">

                ${item.distance > 0 ? "+" : ""}
                ${item.distance}

            </div>

            <div class="strike">

                ${item.strike}

            </div>

            <div class="put-distance">

                ${item.distance > 0 ? "+" : ""}
                ${item.distance}

            </div>

            <button class="buy-put"
                onclick="buyOption('PUT',${item.strike})">

                BUY
            </button>

        </div>

        `;

    });

}

function buyOption(type, strike){

    const sheet = document.getElementById("tradeSheet");

    document.getElementById("sheetTitle").innerText =
        `NIFTY ${strike} ${type === "CALL" ? "CE" : "PE"}`;

    const badge = document.querySelector(".call-badge");

    badge.innerText = type;

    badge.className =
        type === "CALL"
        ? "call-badge"
        : "put-badge";

    sheet.classList.remove("hidden");

    setTimeout(() => {

        sheet.classList.add("show");

    },10);

}

function closeTradeSheet(){

    const sheet = document.getElementById("tradeSheet");

    sheet.classList.remove("show");

    setTimeout(()=>{

        sheet.classList.add("hidden");

    },300);

}

document.addEventListener("DOMContentLoaded", () => {

    generateOptionChain();

});
