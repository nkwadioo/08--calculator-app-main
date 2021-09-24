"use strict";
const buttons = document.querySelectorAll('.btn');
const screen = document.querySelector('.screen');
const themes = document.querySelectorAll('.theme input');
const themeColor = localStorage.getItem('theme');
const historyBtn = document.querySelector('#history');
const historyPage = document.querySelector('.historyPage')

let variable1 = '';
let variable2 = '';
let operant = '';
let hasOperation = false;

if (themeColor) {
    const radioBtn = document.getElementById(themeColor);
    radioBtn?.click();
    document.body.classList.forEach( list => {
        document.body.classList.remove(list);
    });
    document.body.classList.add(themeColor);
}

const print = (expression) => {
    ;
    const div = document.createElement('div');
    const span = document.createElement('span'); span.innerHTML = `${expression.total}`;
    const small = document.createElement('small'); small.innerHTML = `${expression.equation}`;
    div.appendChild(small);
    div.appendChild(span);
    historyPage.appendChild(div);
    // setTimeout(() => {
        // console.log(historyPage.scrollHeight)
    historyPage.scrollTop = -historyPage.scrollHeight;
    // }, 100);
}

function calculate() {
    if(!variable2) {
        return;
    }
    variable1 = +variable1;
    variable2 = +variable2;
    let expression = {equation: `${variable1} ${operant} ${variable2} =`};
    switch (operant){
        case '+' :
            variable1 = ''+ (variable1 + variable2)
            break;
        case '-' :
            variable1 = ''+ (variable1 - variable2)
            break;
        case 'x' :
            variable1 = ''+ (variable1 * variable2)
            break;
        case '/' :
            if (variable2 === 0) {
                variable1 = '';
                variable2 = '';
                return screen.innerHTML = 'Can\'t divide by zero'
            }
            variable1 = ''+ (variable1 / variable2)
            break;
    }
    expression.total = variable1;
    print(expression);
    variable2 = '';
    screen.innerHTML = variable1;
    // hasOperation = false;
}

function insetValue(value) {
    // use regex to insert , per 1000 units
    // restrict having more than 1 decimal point
    if (!hasOperation) {
        variable1 += value;
        screen.innerHTML = variable1;
    } else {
        variable2 += value;
        screen.innerHTML = variable2;
    }
}

function insetOperation(value) {
    operant = value;
    hasOperation = true;
    if (variable2) {
        calculate();
    }
}

function doAction(value, classList) {
    if (classList.contains('equalTo')) {
        return calculate()
    }

    if (classList.contains('reset')) {
        variable1 = '';
        variable2 = '';
        operant = '';
        hasOperation = false;
        screen.innerHTML = '0';

        historyPage.innerHTML = '';
        return;
    }

    if (classList.contains('del')) {
        // use regex to remove , per 1000 units
        if (variable2 !== '') {
            variable2 = variable2.substring(0, variable2.length - 1);
            return screen.innerHTML = variable2 || '0';
        }
        if (variable1 !== '') {
            variable1 = variable1.substring(0, variable1.length - 1);
            return screen.innerHTML = variable1 || '0';
        }
    }

}

function input(event) {
    const button = event.target;
    button.classList.add('press');
    setTimeout(() => {
        button.classList.remove('press'); 
    }, 100);
    const value = event.target.innerHTML;
    const classList = button.classList;
    if (classList.contains('num')) {
        insetValue(value)
    } else if (classList.contains('op')) {
        insetOperation(value)
    } else {
        doAction(value, classList)
    }
    // console.log(event, classList)
}

function changeTheme(event) {
    const radioButton = event.target;
    const value = radioButton.value;
    document.body.classList.forEach( list => {
        document.body.classList.remove(list);
    });
    document.body.classList.add(value);
    localStorage.setItem('theme', value);
}

buttons.forEach( button => {
    button?.addEventListener('click', input);
});

themes.forEach( radioBtn => {
    radioBtn.addEventListener('click', changeTheme);
})

historyBtn.addEventListener('click', (event) => {
    historyPage.classList.toggle('show');
    historyPage.scrollTop = -historyPage.scrollHeight;
})

// add number and symbol event listers using rgex
document.addEventListener('keydown', (event) => {
    console.log(event);
    const eventCode = event.code.toLocaleLowerCase();
    if (eventCode.includes('digit') || eventCode.includes('numpad') || eventCode == 'enter') {
        insetValue(event.key)
    }
})
