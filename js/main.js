"use strict";
const buttons = document.querySelectorAll('.btn');
const screen = document.querySelector('.screen');
const themes = document.querySelectorAll('.theme input');
const themeColor = localStorage.getItem('theme');
let variable1 = '';
let variable2 = '';
let operant = '';
let hasOperation = false;

if (themeColor) {
    if (themeColor !== 'theme1') {
        const radioBtn = document.getElementById(themeColor);
        radioBtn?.click();
        document.body.classList.forEach( list => {
            document.body.classList.remove(list);
        });
        document.body.classList.add(themeColor);
    }
}

function calculate() {
    if(!variable2) {
        return;
    }
    variable1 = +variable1;
    variable2 = +variable2;

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
    variable2 = '';
    screen.innerHTML = variable1;
    // hasOperation = false;
}

function insetValue(value) {
    // console.log(screen)
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
        return;
    }

    if (classList.contains('del')) {
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

// add number and symbol event listers

document.addEventListener('keydown', (event) => {
    console.log(event);
    const eventCode = event.code.toLocaleLowerCase();
    if (eventCode.includes('digit') || eventCode.includes('numpad') || eventCode == 'enter') {
        insetValue(event.key)
    }
})
