const plays = require("./plays.json");
const invoices = require("./invoices.json");

//초기 함수
function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 : ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;
    switch (play.type) {
      case "tragedy": //비극
        thisAmount = 40000;
        if (perf.audiences > 30) {
          thisAmount += 1000 * (perf.audiences - 30);
        }
        break;
      case "comedy": //희극
        thisAmount = 30000;
        if (perf.audiences > 20) {
          thisAmount += 10000 + 500 * (perf.audiences - 30);
        }
        thisAmount += 300 * perf.audiences;
        break;
      default:
        throw new Error(`알 수 없는 장르: ${play.type}`);
    }

    //포인트를 적립한다.
    volumeCredits += Math.max(perf.audiences - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audiences / 5);

    //청구 내역을 출력한다.
    result += `  ${play.name} : ${format(thisAmount / 100)} (${
      perf.audiences
    }석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

//console.log(statement(invoices[0], plays));

//1차 리팩토링
//switch문 쪼개기(함수쪼개기)
function amountFor(perf, play) {
  let thisAmount = 0;
  switch (play.type) {
    case "tragedy": //비극
      thisAmount = 40000;
      if (perf.audiences > 30) {
        thisAmount += 1000 * (perf.audiences - 30);
      }
      break;
    case "comedy": //희극
      thisAmount = 30000;
      if (perf.audiences > 20) {
        thisAmount += 10000 + 500 * (perf.audiences - 30);
      }
      thisAmount += 300 * perf.audiences;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }
  return thisAmount;
}

function statement2(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 : ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = amountFor(perf, play);
    //포인트를 적립한다.
    volumeCredits += Math.max(perf.audiences - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audiences / 5);

    //청구 내역을 출력한다.
    result += `  ${play.name} : ${format(thisAmount / 100)} (${
      perf.audiences
    }석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

//console.log(statement2(invoices[0], plays));

//2.변수명 명확하게 바꾸기
function amountFor2(aPerformance, play) {
  let result = 0;
  switch (play.type) {
    case "tragedy": //비극
      result = 40000;
      if (aPerformance.audiences > 30) {
        result += 1000 * (aPerformance.audiences - 30);
      }
      break;
    case "comedy": //희극
      result = 30000;
      if (aPerformance.audiences > 20) {
        result += 10000 + 500 * (aPerformance.audiences - 30);
      }
      result += 300 * aPerformance.audiences;
      break;
    default:
      throw new Error(`알 수 없는 장르: ${play.type}`);
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function statement3(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구 내역 (고객명 : ${invoice.customer})\n`;
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    //const play = playFor(perf); //우변을 함수로 추출
    let thisAmount = amountFor2(perf, playFor(perf));
    //포인트를 적립한다.
    volumeCredits += Math.max(perf.audiences - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === playFor(perf).type)
      volumeCredits += Math.floor(perf.audiences / 5);

    //청구 내역을 출력한다.
    result += `  ${playFor(perf).name} : ${format(thisAmount / 100)} (${
      perf.audiences
    }석)\n`;
    totalAmount += thisAmount;
  }
  result += `총액: ${format(totalAmount / 100)}\n`;
  result += `적립 포인트: ${volumeCredits}점\n`;
  return result;
}

console.log(statement3(invoices[0], plays));
