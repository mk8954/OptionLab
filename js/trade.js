/* ==========================
   OPTIONLAB TRADE ENGINE
========================== */


const indices = {


    NIFTY: {
        spot: 24350,
        step: 50,
        lot: 65
    },


    BANKNIFTY: {
        spot: 57400,
        step: 100,
        lot: 35
    },


    FINNIFTY: {
        spot: 25800,
        step: 50,
        lot: 65
    },


    MIDCPNIFTY: {
        spot: 13475,
        step: 25,
        lot: 120
    },


    SENSEX: {
        spot: 80500,
        step: 100,
        lot: 20
    }


};


let currentIndex = "NIFTY";


let selectedStrike = 0;


let tradeType = "CE";


let premium = 0;


let lots = 1;




/* ==========================
INITIALISE
========================== */


window.onload = () => {


    loadIndex(currentIndex);


    bindIndexButtons();


    bindLots();


};




/* ==========================
LOAD INDEX
========================== */


function loadIndex(name){


    currentIndex = name;


    const data = indices[name];


    document.getElementById("selectedIndex").innerText =
        name;


    document.getElementById("spotPrice").innerText =
        data.spot;


    document.getElementById("lotSize").innerText =
        data.lot;


    const atm =
        Math.round(data.spot/data.step)*data.step;


    document.getElementById("atmStrike").innerText =
        atm;


    generateChain(atm,data.step);


}




/* ==========================
INDEX BUTTONS
========================== */


function bindIndexButtons(){


    document
        .querySelectorAll(".index-chip")
        .forEach(btn=>{


            btn.onclick=()=>{


                document
                .querySelectorAll(".index-chip")
                .forEach(x=>x.classList.remove("active"));


                btn.classList.add("active");


                loadIndex(btn.dataset.index);


            };


        });


}




/* ==========================
OPTION CHAIN
========================== */


function generateChain(atm,step){


    selectedStrike = atm;


    let html="";


    for(let i=6;i>=-6;i--){


        const strike = atm-(i*step);


        const diff = strike-atm;


        let callClass="";
        let putClass="";


        let callText="";
        let putText="";


        if(diff<0){


            callClass="green";
            putClass="red";


            callText="+"+Math.abs(diff);
            putText="-"+Math.abs(diff);


        }


        else if(diff>0){


            callClass="red";
            putClass="green";


            callText="-"+Math.abs(diff);
            putText="+"+Math.abs(diff);


        }


        else{


            callClass="zero";
            putClass="zero";


            callText="ATM";
            putText="ATM";


        }


        html+=`


<div class="chain-row ${diff===0?'atm':''}">


<div
class="call-side ${callClass}"
onclick="openTrade(${strike},'CE')">


${callText}


</div>


<div class="strike">


${strike}


</div>


<div
class="put-side ${putClass}"
onclick="openTrade(${strike},'PE')">


${putText}


</div>


</div>


`;


    }


    document
    .getElementById("optionChain")
    .innerHTML=html;


}




/* ==========================
OPEN SHEET
========================== */


function openTrade(strike,type){


    selectedStrike=strike;


    tradeType=type;


    document
    .getElementById("tradeTitle")
    .innerText=
    currentIndex+
    " "+
    strike+
    " "+
    type;


    const sheet =
    document.getElementById("tradeSheet");


    sheet.classList.remove("hidden");


    setTimeout(()=>{


        sheet.classList.add("show");


    },10);


}




/* ==========================
LOTS
========================== */


function bindLots(){


    document
    .getElementById("plusLot")
    .onclick=()=>{


        lots++;


        updateLots();


    };


    document
    .getElementById("minusLot")
    .onclick=()=>{


        if(lots>1){


            lots--;


            updateLots();


        }


    };


}


function updateLots(){


    document
    .getElementById("lotCount")
    .innerText=lots;


}

/* ==========================
PREMIUM CALCULATIONS
========================== */


document.getElementById("premium").addEventListener("input", updateSummary);
document.getElementById("sl").addEventListener("input", updateSummary);
document.getElementById("target").addEventListener("input", updateSummary);


function updateSummary(){


    const data = indices[currentIndex];


    premium = parseFloat(document.getElementById("premium").value) || 0;


    const slPercent =
        parseFloat(document.getElementById("sl").value) || 0;


    const targetPercent =
        parseFloat(document.getElementById("target").value) || 0;


    const investment =
        premium * data.lot * lots;


    const brokerage =
        calculateBrokerage(investment);


    const risk =
        investment * slPercent / 100;


    const reward =
        investment * targetPercent / 100;


    document.getElementById("investment").innerText =
        "₹"+investment.toFixed(2);


    document.getElementById("charges").innerText =
        "₹"+brokerage.toFixed(2);


    document.getElementById("riskAmount").innerText =
        "₹"+risk.toFixed(2);


    document.getElementById("rewardAmount").innerText =
        "₹"+reward.toFixed(2);


    updateRiskMeter(risk,reward,investment);


}


/* ==========================
BROKERAGE
========================== */


function calculateBrokerage(value){


    let brokerage = 20;


    brokerage += value * 0.0005;


    brokerage += brokerage * 0.18;


    return brokerage;


}


/* ==========================
RISK METER
========================== */


function updateRiskMeter(risk,reward,investment){


    let score = 50;


    if(reward>risk)
        score+=20;


    if(reward>=risk*2)
        score+=15;


    if(investment<10000)
        score+=10;


    if(lots===1)
        score+=5;


    if(score>100)
        score=100;


    document.getElementById("riskFill").style.width =
        score+"%";


    let text="";


    if(score>=80)
        text="🟢 Excellent";


    else if(score>=65)
        text="🟢 Good";


    else if(score>=45)
        text="🟡 Moderate";


    else
        text="🔴 High Risk";


    document.getElementById("riskText").innerText =
        text+" ("+score+"/100)";


}


/* ==========================
QUICK TAGS
========================== */


document.querySelectorAll(".tag").forEach(tag=>{


    tag.onclick=()=>{


        tag.classList.toggle("active");


    };


});


/* ==========================
BUY TRADE
========================== */


document.getElementById("buyTrade").onclick=function(){


    const trade={


        index:currentIndex,


        strike:selectedStrike,


        type:tradeType,


        premium:premium,


        lots:lots,


        investment:
            document.getElementById("investment").innerText,


        charges:
            document.getElementById("charges").innerText,


        risk:
            document.getElementById("riskAmount").innerText,


        reward:
            document.getElementById("rewardAmount").innerText,


        reason:
            document.getElementById("tradeReason").value,


        tags:
            [...document.querySelectorAll(".tag.active")]
            .map(t=>t.innerText),


        entryDate:
            new Date().toLocaleDateString(),


        entryTime:
            new Date().toLocaleTimeString(),


        day:
            new Date().toLocaleDateString(
                "en-US",
                {weekday:"long"}
            ),


        session:
            getSession(),


        status:"OPEN"


    };


    let trades =
        JSON.parse(localStorage.getItem("optionlabTrades")) || [];


    trades.push(trade);


    localStorage.setItem(
        "optionlabTrades",
        JSON.stringify(trades)
    );


    alert("Trade Added Successfully");


    closeTradeSheet();


};


/* ==========================
SESSION
========================== */


function getSession(){


    const h = new Date().getHours();


    if(h<10)
        return "Opening";


    if(h<12)
        return "Morning";


    if(h<14)
        return "Mid Day";


    return "Closing";


}


/* ==========================
CLOSE SHEET
========================== */


function closeTradeSheet(){


    const sheet =
        document.getElementById("tradeSheet");


    sheet.classList.remove("show");


    setTimeout(()=>{


        sheet.classList.add("hidden");


    },300);


}
