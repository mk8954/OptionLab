/*==========================================================
  OPTIONLAB TRADE.JS V2 (FINAL)
==========================================================*/


const INDEXES = {
    NIFTY: {
        name:"NIFTY 50", spot:24357, change:82, percent:0.42, lot:65,
        expiries: ["01 Aug", "08 Aug", "14 Aug", "22 Aug"]
    },
    BANKNIFTY: {
        name:"BANKNIFTY", spot:56532, change:-105, percent:-0.18, lot:30,
        expiries: ["31 Jul", "07 Aug", "14 Aug", "21 Aug"]
    },
    FINNIFTY: {
        name:"FINNIFTY", spot:26215, change:21, percent:0.08, lot:60,
        expiries: ["30 Jul", "06 Aug", "13 Aug", "20 Aug"]
    },
    MIDCPNIFTY: {
        name:"MIDCPNIFTY", spot:14642, change:-12, percent:-0.09, lot:120,
        expiries: ["29 Jul", "05 Aug", "12 Aug", "19 Aug"]
    },
    SENSEX: {
        name:"SENSEX", spot:82471, change:205, percent:0.24, lot:20,
        expiries: ["02 Aug", "09 Aug", "16 Aug", "23 Aug"]
    }
};


let currentIndex = "NIFTY";
let currentExpiry = INDEXES[currentIndex].expiries[0];
let premium = 125;
let lots = 1;
let tradeType = "CE";
let tradeStrike = 0;


/*==========================================================
  INIT
==========================================================*/
function initTrade() {
    const box = document.getElementById("tickerContainer");
    if (!box) return; // Safety check in case the router hasn't loaded the HTML yet


    buildTicker();
    buildExpiry();
    buildOptionChain();
}


/*==========================================================
  TICKER & EXPIRY
==========================================================*/
function buildTicker() {
    const box = document.getElementById("tickerContainer");
    if (!box) return;


    box.innerHTML = "";
    Object.keys(INDEXES).forEach((key) => {
        const d = INDEXES[key];
        const positive = d.change >= 0;
        box.innerHTML += `
            <div class="ticker-card ${key === currentIndex ? "active" : ""}" onclick="changeIndex('${key}')">
                <div class="card-row">
                    <div class="index-name">${d.name}</div>
                    <div class="expiry-tag">${currentExpiry}</div>
                </div>
                <div class="index-value">${d.spot}</div>
                <div class="index-change ${positive ? "positive" : "negative"}">
                    ${positive ? "▲" : "▼"} ${Math.abs(d.change)} (${positive ? "+" : ""}${d.percent}%)
                </div>
            </div>`;
    });
}


function changeIndex(index) {
    currentIndex = index;
    currentExpiry = INDEXES[currentIndex].expiries[0]; // Reset to nearest expiry
    buildExpiry();
    buildTicker();
    buildOptionChain();
}


function buildExpiry() {
    const bar = document.getElementById("expiryBar");
    if (!bar) return;


    bar.innerHTML = "";
    const indexExpiries = INDEXES[currentIndex].expiries;
    indexExpiries.forEach(exp => {
        bar.innerHTML += `
            <button class="expiry-chip ${exp === currentExpiry ? "active" : ""}"
                    onclick="changeExpiry('${exp}')">${exp}</button>`;
    });
}


function changeExpiry(expiry) {
    currentExpiry = expiry;
    buildExpiry();
    buildTicker();
}


/*==========================================================
  OPTION CHAIN
==========================================================*/
function buildOptionChain() {
    const holder = document.getElementById("optionChain");
    if (!holder) return;


    holder.innerHTML = "";
    const spot = INDEXES[currentIndex].spot;
    const atm = Math.round(spot / 50) * 50;
    const step = 50;


    /* ABOVE ATM */
    for(let i=10; i>=1; i--){
        let strike = atm + (i * step);
        let dist = strike - spot;
        addRow(holder, strike, dist, false);
    }

    /* LIVE MARKET DIVIDER */
    holder.innerHTML += `
        <div class="atm-divider">
            <span>${currentIndex}&nbsp;${spot.toLocaleString()}</span>
        </div>`;


    /* BELOW ATM */
    for(let i=0; i<=10; i++){
        let strike = atm - (i * step);
        let dist = strike - spot;
        addRow(holder, strike, dist, true);
    }
}


function addRow(parent, strike, distance, isBelow) {
    let callClass = isBelow ? "call-red" : "call-green";
    let putClass = isBelow ? "put-green" : "put-red";

    if (distance === 0) {
        callClass = "call-green";
        putClass = "put-green";
    }


    const callText = distance === 0 ? "ATM" : (distance > 0 ? `+${distance}` : distance);
    const putText = distance === 0 ? "ATM" : (distance > 0 ? distance : `+${Math.abs(distance)}`);


    parent.innerHTML += `
        <div class="chain-row ${distance === 0 ? "atm" : ""}">
            <div class="call-cell ${callClass}" onclick="openTrade('${currentIndex}', ${strike}, 'CE')">${callText}</div>
            <div class="strike-cell">${strike}</div>
            <div class="put-cell ${putClass}" onclick="openTrade('${currentIndex}', ${strike}, 'PE')">${putText}</div>
        </div>`;
}


/*==========================================================
  TRADE SHEET OPEN & CLOSE
==========================================================*/
function openTrade(index, strike, type) {
    tradeStrike = strike;
    tradeType = type;

    let calcPremium = Math.max(5, Math.round((Math.abs(INDEXES[index].spot - strike) / 4) + 40));

    document.getElementById("sheetTitle").innerHTML = `${index} ${strike} ${type}`;
    document.getElementById("sheetSubtitle").innerHTML = `${currentExpiry} • Lot ${INDEXES[index].lot}`;
    document.getElementById("premiumInput").value = calcPremium.toFixed(2);

    lots = 1;
    updateTrade();

    document.getElementById("tradeSheet").classList.add("show");
    document.getElementById("sheetOverlay").classList.add("show");
}


function closeTrade() {
    document.getElementById("tradeSheet").classList.remove("show");
    document.getElementById("sheetOverlay").classList.remove("show");
}


function changeLots(value) {
    lots += value;
    if(lots < 1) lots = 1;
    updateTrade();
}


/*==========================================================
  STEPPERS & REASON LOGIC
==========================================================*/
function changeSL(val) {
    let sl = parseFloat(document.getElementById("slPercent").value) || 0;
    sl += val;
    if(sl < 0) sl = 0;
    document.getElementById("slPercent").value = sl;
    updateTrade();
}


function changeTG(val) {
    let tg = parseFloat(document.getElementById("tgPercent").value) || 0;
    tg += val;
    if(tg < 0) tg = 0;
    document.getElementById("tgPercent").value = tg;
    updateTrade();
}


function selectReason(chip) {
    document.getElementById("customReason").value = "";
    document.querySelectorAll(".reason-chip").forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
}


function clearChips() {
    document.querySelectorAll(".reason-chip").forEach(c => c.classList.remove("active"));
}


/*==========================================================
  UPDATE MATH & CHARGES
==========================================================*/
function updateTrade() {
    premium = parseFloat(document.getElementById("premiumInput").value) || 0;

    const lotSize = INDEXES[currentIndex].lot;
    const qty = lotSize * lots;

    document.getElementById("lotCount").innerHTML = lots;
    document.getElementById("qtyValue").innerHTML = qty;
    document.getElementById("lotSizeValue").innerHTML = lotSize;


    /* SL & TARGET */
    const slPercent = parseFloat(document.getElementById("slPercent").value) || 0;
    const slPremium = premium - (premium * slPercent / 100);
    document.getElementById("slPremium").innerHTML = "₹" + slPremium.toFixed(2);


    const tgPercent = parseFloat(document.getElementById("tgPercent").value) || 0;
    const tgPremium = premium + (premium * tgPercent / 100);
    document.getElementById("tgPremium").innerHTML = "₹" + tgPremium.toFixed(2);


    /* CAPITAL */
    const capital = premium * qty;
    document.getElementById("capitalUsed").innerHTML = "₹" + capital.toFixed(2);


    /* RISK / REWARD */
    const risk = (premium - slPremium) * qty;
    const reward = (tgPremium - premium) * qty;
    document.getElementById("riskAmount").innerHTML = "₹" + Math.max(0, risk).toFixed(0);
    document.getElementById("rewardAmount").innerHTML = "₹" + Math.max(0, reward).toFixed(0);

    const rr = risk > 0 ? (reward / risk) : 0;
    document.getElementById("rrRatio").innerHTML = "1:" + rr.toFixed(2);


    /* RISK BAR */
    let riskWidth = risk + reward > 0 ? (risk / (risk + reward) * 100) : 50;
    document.getElementById("riskFill").style.width = riskWidth + "%";
    document.getElementById("rewardFill").style.width = (100 - riskWidth) + "%";


    updateCharges(qty);
}


function updateCharges(qty) {
    const turnover = premium * qty;
    const brokerage = 20;
    const exchange = turnover * 0.000495;
    const sebi = turnover * 0.000001;
    const stt = turnover * 0.001;
    const stamp = turnover * 0.00003;
    const gst = (brokerage + exchange + sebi) * 0.18;
    const total = brokerage + exchange + sebi + stt + stamp + gst;


    document.getElementById("brokerage").innerHTML = "₹" + brokerage.toFixed(2);
    document.getElementById("exchange").innerHTML = "₹" + exchange.toFixed(2);
    document.getElementById("sebi").innerHTML = "₹" + sebi.toFixed(2);
    document.getElementById("stt").innerHTML = "₹" + stt.toFixed(2);
    document.getElementById("stamp").innerHTML = "₹" + stamp.toFixed(2);
    document.getElementById("gst").innerHTML = "₹" + gst.toFixed(2);
    document.getElementById("totalCharges").innerHTML = total.toFixed(2);


    /* TRUE UNDERLYING BREAKEVEN LOGIC */
    const totalCostPerQty = premium + (total / qty);
    let breakEven = 0;
    let activeStrike = parseInt(tradeStrike);


    if (tradeType === "CE") {
        breakEven = activeStrike + totalCostPerQty;
    } else if (tradeType === "PE") {
        breakEven = activeStrike - totalCostPerQty;
    }

    document.getElementById("breakEven").innerHTML = breakEven > 0 ? "₹" + breakEven.toFixed(2) : "₹0.00";
}


function toggleCharges() {
    const body = document.getElementById("chargesBody");
    const icon = document.getElementById("chargeArrow");
    if(body.style.display === "block"){
        body.style.display = "none";
        icon.innerHTML = "▼";
    } else {
        body.style.display = "block";
        icon.innerHTML = "▲";
    }
}


function buyTrade() {
    const customReason = document.getElementById("customReason").value.trim();
    const activeChip = document.querySelector(".reason-chip.active");
    const finalReason = customReason ? customReason : (activeChip ? activeChip.innerHTML : "");


    const trade = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        index: currentIndex,
        expiry: currentExpiry,
        strike: tradeStrike,
        type: tradeType,
        premium: premium,
        lots: lots,
        qty: lots * INDEXES[currentIndex].lot,
        sl: document.getElementById("slPremium").innerHTML,
        target: document.getElementById("tgPremium").innerHTML,
        breakEven: document.getElementById("breakEven").innerHTML,
        reason: finalReason,
        status: "OPEN"
    };


    let trades = JSON.parse(localStorage.getItem("optionlabTrades")) || [];
    trades.push(trade);
    localStorage.setItem("optionlabTrades", JSON.stringify(trades));

    alert("Trade Saved Successfully!");
    closeTrade();
}


/*==========================================================
  SWIPE DOWN TO CLOSE
==========================================================*/
let startY = 0;
// We attach swipe listener dynamically so it works even if loaded via router later
document.addEventListener("touchstart", (e) => {
    if (e.target.closest("#tradeSheet")) {
        startY = e.touches[0].clientY;
    }
}, {passive: true});


document.addEventListener("touchmove", (e) => {
    const sheet = document.getElementById("tradeSheet");
    if (sheet && sheet.classList.contains("show") && e.target.closest("#tradeSheet")) {
        const diff = e.touches[0].clientY - startY;
        if (diff > 120) closeTrade();
    }
}, {passive: true});


/*==========================================================
  SPA AUTO-INITIALIZER (Fixes blank screen issue)
==========================================================*/
const observer = new MutationObserver(() => {
    const box = document.getElementById("tickerContainer");
    if (box && box.innerHTML.trim() === "") {
        initTrade();
    }
});
observer.observe(document.body, { childList: true, subtree: true });


// Run once immediately in case it's not an SPA load
initTrade();

