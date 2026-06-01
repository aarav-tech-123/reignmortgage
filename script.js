const propertyValue = document.getElementById("propertyValue");
const propertyValueRange = document.getElementById("propertyValueRange");

const downPayment = document.getElementById("downPayment");
const downPaymentRange = document.getElementById("downPaymentRange");

const downPercent = document.getElementById("downPercent");
const downPercentRange = document.getElementById("downPercentRange");

const interestRate = document.getElementById("interestRate");

const amortization = document.getElementById("amortization");

function formatMoney(number) {
    return "$" + number.toLocaleString(undefined, {
        maximumFractionDigits: 2
    });
}

function calculate() {

    let property = parseFloat(propertyValue.value);
    let down = parseFloat(downPayment.value);

    let mortgage = property - down;

    let insuranceRate = 0;

    let dpPercent = (down / property) * 100;

    if (dpPercent < 20) {

        if (dpPercent >= 15)
            insuranceRate = 2.8;

        else if (dpPercent >= 10)
            insuranceRate = 3.1;

        else
            insuranceRate = 4.0;
    }

    let insurance = mortgage * insuranceRate / 100;

    mortgage += insurance;

    let annualRate = parseFloat(interestRate.value) / 100;

    let years = parseInt(amortization.value);

    let monthlyRate = annualRate / 12;

    let totalPayments = years * 12;

    let monthly =
        mortgage *
        monthlyRate *
        Math.pow(1 + monthlyRate, totalPayments)
        /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

    document.getElementById("mortgageAmount").innerHTML =
        formatMoney(mortgage);

    document.getElementById("monthlyPayment").innerHTML =
        formatMoney(monthly);

    document.getElementById("biweekly").innerHTML =
        formatMoney(monthly * 12 / 26);

    document.getElementById("weekly").innerHTML =
        formatMoney(monthly * 12 / 52);

    document.getElementById("semiMonthly").innerHTML =
        formatMoney(monthly / 2);

    document.getElementById("accWeekly").innerHTML =
        formatMoney(monthly / 4);

    document.getElementById("insuranceDollar").innerHTML =
        formatMoney(insurance);

    document.getElementById("insurancePercent").innerHTML =
        insuranceRate + "%";

    document.getElementById("closingCost").innerHTML =
        formatMoney(property * 0.015);

    document.getElementById("minimumDown").innerHTML =
        formatMoney(property * 0.05);
}

propertyValueRange.addEventListener("input", () => {

    propertyValue.value = propertyValueRange.value;

    let percent =
        (downPayment.value / propertyValue.value) * 100;

    downPercent.value = percent.toFixed(2);
    downPercentRange.value = percent;

    calculate();
});

downPaymentRange.addEventListener("input", () => {

    downPayment.value = downPaymentRange.value;

    let percent =
        (downPayment.value / propertyValue.value) * 100;

    downPercent.value = percent.toFixed(2);
    downPercentRange.value = percent;

    calculate();
});

downPercentRange.addEventListener("input", () => {

    downPercent.value = downPercentRange.value;

    let amount =
        propertyValue.value *
        downPercent.value / 100;

    downPayment.value = amount.toFixed(0);
    downPaymentRange.value = amount;

    calculate();
});

document.querySelectorAll("input,select")
    .forEach(el => {
        el.addEventListener("input", calculate);
    });

calculate();