//Общий бюджет
const totalBugdetInput = document.querySelector('.totalBugdetInput');
const showTotalBudget = document.querySelector('.showTotalBudget');

const totalBudgetObj = {
    uah: 0,
    usd: 0,
    percent: 0,
    uahCurrent: 0, // курс доллара к гривне, для удобства назвал переменную uah
}

//Берём из API курс валют
gerCurrencies();

async function gerCurrencies() {
    const response = await fetch('https://api.exchangerate.host/latest?/source=ecb&base=${base}');
    const data = await response.json();
    result = await data;
    totalBudgetObj.uahCurrent = result.rates.UAH; //1 доллар = ...грн
}

//При изменении инпута общего бюджета изменяем значения
totalBugdetInput.addEventListener('change', (e) => {
    totalBudgetObj.uah = +e.target.value;
    totalBudgetObj.usd = +(totalBudgetObj.uah / totalBudgetObj.uahCurrent).toFixed(2);
    totalBudgetObj.percent = 100;

    showTotalBudget.innerHTML = `
        <div class="newTotalBudget">
            <h3>${totalBudgetObj.uah}грн. = ${totalBudgetObj.usd}$ = ${totalBudgetObj.percent}% (Остаток общего бюджета)</h3>
        </div>
    `
    e.target.value = "";
    localStorage.setItem("totalBudgetObj", JSON.stringify(totalBudgetObj));
})

//Вычисления

const accetpCalculations = document.querySelector('.accetpCalculations');
const calculations = document.querySelector('.calculations');

const firstPercentInput = document.querySelector('.firstPercentInput');
const firstInvestmentInput = document.querySelector('.firstInvestment');

const secondPercentInput = document.querySelector('.secondPercentInput');
const secondInvestmentInput = document.querySelector('.secondInvestment');

const thirdPercentInput = document.querySelector('.thirdPercentInput');
const thirdInvestmentInput = document.querySelector('.thirdInvestment');

//----------------------------Вычисления-------------------------------

let calcArr = [];

function ShortTerm(percent, money, currency) {
    this.percent = percent;
    this.money = money;
    this.currency = currency;
}

accetpCalculations.addEventListener('click', () => {
    let totalBudgetObjSotrage = JSON.parse(localStorage.getItem("totalBudgetObj"));

    //Если уже вписан общий бюджет, то можно присваивать переменным значения из инпутов
    if(totalBudgetObjSotrage) {
        calcFirstInputs(totalBudgetObjSotrage);
        calSecondInputs(totalBudgetObjSotrage);
        calcThirdInputs(totalBudgetObjSotrage); 

        checkArray();
        
    } else {
        alert("Вы ещё не вписали общий бюджет");
    }
    clearInputs();
    
});

function calcFirstInputs(data) {
    let firstPercent = +firstPercentInput.value;
    let firstMoney = data.uah / 100 * firstPercent;
    let firstInvestment = firstInvestmentInput.value;

    let shortTerm1 = new ShortTerm(firstPercent, firstMoney, firstInvestment);
    calcArr.push(shortTerm1);
}

function calSecondInputs(data) {
    let secondPercent = +secondPercentInput.value;
    let secondMoney = data.uah / 100 * secondPercent;
    let secondInvestment = secondInvestmentInput.value;

    let shortTerm2 = new ShortTerm(secondPercent, secondMoney, secondInvestment);
    calcArr.push(shortTerm2);

}

function calcThirdInputs(data) {
    let thirdPercent = +thirdPercentInput.value;
    let thirdMoney = data.uah / 100 * thirdPercent;
    let thirdInvestment = thirdInvestmentInput.value;

    let shortTerm3 = new ShortTerm(thirdPercent, thirdMoney, thirdInvestment);
    calcArr.push(shortTerm3);
}


function checkArray() {
    let calcArrStorage = JSON.parse(localStorage.getItem("calcArr"));

    if(!calcArrStorage) {
        localStorage.setItem("calcArr", JSON.stringify(calcArr));

        showCalculations();
        updateTotalBudget();
        renderUpdateBudget();
    } else {
        alert("Вы уже добавили информацию в этот блок");
    }
}

function clearInputs() {
    firstPercentInput.value = "";
    secondPercentInput.value = "";
    thirdPercentInput.value = "";

    firstInvestmentInput.value = "";
    secondInvestmentInput.value = "";
    thirdInvestmentInput.value = "";
}

const clearButton = document.querySelector('.clearButton button');

clearButton.addEventListener('click', () => {
    clearPage();
})

function clearPage() {
    const calcArrStorage = JSON.parse(localStorage.getItem("calcArr"));
    const totalBudgetSotrage = JSON.parse(localStorage.getItem("totalBudgetObj"));

    if(calcArrStorage && totalBudgetSotrage) {
        localStorage.removeItem("calcArr");
        localStorage.removeItem("totalBudgetObj");
        location.reload();
        return
    }

}

const shortTermInfo = {
    percent: 0,
    money: 0,
}
// Обновление общего бюджета

function updateTotalBudget() {
    const calcArrStorage = JSON.parse(localStorage.getItem("calcArr"));
    const totalBudgetSotrage = JSON.parse(localStorage.getItem("totalBudgetObj"));

    if(calcArrStorage && totalBudgetSotrage) {
        calcArrStorage.map(item => {
            shortTermInfo.percent += item.percent;
            shortTermInfo.money += item.money;
        })
        totalBudgetSotrage.percent -= shortTermInfo.percent;
        totalBudgetSotrage.uah -= (shortTermInfo.money).toFixed(2);
        totalBudgetSotrage.usd =  +(totalBudgetSotrage.uah / totalBudgetSotrage.uahCurrent).toFixed(2);

        localStorage.setItem("totalBudgetObj", JSON.stringify(totalBudgetSotrage));
        
        console.log(shortTermInfo);
        
    }
    
}

function renderUpdateBudget() {
    const totalBudgetSotrage = JSON.parse(localStorage.getItem("totalBudgetObj"));

    if(totalBudgetSotrage) {
        showTotalBudget.innerHTML = `
        <div class="newTotalBudget">
            <h3>${totalBudgetSotrage.uah}грн. = ${totalBudgetSotrage.usd}$ = ${totalBudgetSotrage.percent}% (Остаток общего бюджета)</h3>
        </div>
    `
    }
}

// Рендер
function showCalculations() {
    const calcArrStorage = JSON.parse(localStorage.getItem("calcArr"));
    if(calcArrStorage) {
        calculations.innerHTML = "";
        calcArrStorage.map(item => {
            calculations.innerHTML += `
                <div class="showCalc">
                    <div class="showCalcPercent">
                        <h3>${item.percent}%</h3>
                    </div>

                    <div class="showCalcMoney">
                        <h3>${item.money}грн.</h3>
                    </div>

                    <div class="showCalcInvest">
                        <h3>(${item.currency})</h3>
                    </div>
                
                </div>

            `
        })
    }
}

//Проверяем, есть ли уже инфа в localStorage и отрисовываем её
onLoadPage();
function onLoadPage() {
    const calcArrStorage = JSON.parse(localStorage.getItem("calcArr"));
    const totalBudgetSotrage = JSON.parse(localStorage.getItem("totalBudgetObj"));

    if(totalBudgetSotrage) {
        showTotalBudget.innerHTML = `
        <div class="newTotalBudget">
            <h3>${totalBudgetSotrage.uah}грн. = ${totalBudgetSotrage.usd}$ = ${totalBudgetSotrage.percent}% (Остаток общего бюджета)</h3>
        </div>
    `
    }

    if(calcArrStorage) {
        calcArrStorage.map(item => {
            calculations.innerHTML += `
                <div class="showCalc">
                    <div class="showCalcPercent">
                        <h3>${item.percent}%</h3>
                    </div>

                    <div class="showCalcMoney">
                        <h3>${item.money}грн.</h3>
                    </div>

                    <div class="showCalcInvest">
                        <h3>(${item.currency})</h3>
                    </div>
                    
                </div>
            `
        })
    }
}




