import { buttonLocations } from "../constants/defaultvalues.js";
let inputBar = document.querySelector(".input"); 
let signs = ['+', '-', '/', '*', '%'];
let userInput = ['0'];
let firstClick = true;

function createButtons()
{
    const buttonContainer = document.getElementById('buttons-container')
    const template = document.getElementById('buttons-template').textContent

    buttonLocations.forEach((obj) => {
        let html = template;

        Object.keys(obj).forEach((key) => {
            const regex = new RegExp('{{value}}','g')
            html = html.replace(regex, obj[key])
        })

        buttonContainer.innerHTML += html
    })
}
createButtons()

function inputSelected(inp)
{
    let length = userInput.length;
    if (inp === "AC")
    {
        userInput = ['0'];
        firstClick = true;
    }
    else if (inp === "BACK") {
        let lastIndex = length - 1;
        let last = userInput[lastIndex];
        console.log(last)
        if (last.includes("."))
        {
            userInput[lastIndex] = last.slice(0, -1);
            if (userInput[lastIndex] === "0") firstClick = true;
        }

        else if (last.length > 1) userInput[lastIndex] = last.slice(0, -1); 
        else 
        {
            if (length > 1) {
                userInput.pop();
            } else {
                userInput[0] = "0";
                firstClick = true;
            }
        }
    }

    else if (inp === "+/-")
    {
        if (!signs.includes(userInput[length - 1]) && userInput[length - 1] != 0)
        {
            userInput[length - 1] = parseFloat(userInput[length - 1]) * -1
        }
    }

    else if (inp === "=")
    {
        if (length === 3) calculate();
    }

    else {
        if (!signs.includes(inp)) {
            let tempIndex = length - 1;
            if (inp === '0' && (userInput[length - 1] === '0' || length === 2))
            {
                firstClick = true;
                return
            }

            else if (length === 2) 
            {
                if (inp === '.') userInput.push("0.");
                else userInput.push(inp);
                
                firstClick = false;
            }
            
            else if (firstClick) {
                if (inp === ".") userInput[tempIndex] = "0.";
                else userInput[tempIndex] = inp;
                
                firstClick = false;
            }

            
            else {
                if (inp === "." && userInput[tempIndex].includes(".")) return;

                userInput[tempIndex] = userInput[tempIndex].toString() + inp.toString();
            }
        }

        else if (signs.includes(inp))
        {
            if (signs.includes(userInput[length - 1])) userInput[length - 1] = inp;
            else userInput.push(inp);
            
            firstClick = true;
        }
    }
    inputBar.innerHTML = userInput.join(" ");
}

function calculate() {
    let i = 0;

    // First pass: handle *, /, %
    while (i < userInput.length) {
        const op = userInput[i];
        if (op === "*" || op === "/" || op === "%") {
            const left = parseFloat(userInput[i - 1]);
            const right = parseFloat(userInput[i + 1]);
            let result;

            if (op === "*") result = multiply(left, right);
            else if (op === "/") result = divide(left, right);
            else result = remainder(left, right);

            if (result === "ERROR") {
                inputBar.innerHTML = "ERROR";
                userInput = ["0"];
                firstClick = true;
                return;
            }

            userInput.splice(i - 1, 3, result.toString());
            i = 0; // reset to start because the array has changed
        } else {
            i++;
        }
    }

    // Second pass: handle +, -
    i = 0;
    while (i < userInput.length) {
        const op = userInput[i];
        if (op === "+" || op === "-") {
            const left = parseFloat(userInput[i - 1]);
            const right = parseFloat(userInput[i + 1]);
            const result = op === "+" ? add(left, right) : sub(left, right);

            userInput.splice(i - 1, 3, result.toString());
            i = 0;
        } else {
            i++;
        }
    }

    let res = parseFloat(userInput[0]);
    res = parseFloat(res.toFixed(10));
    inputBar.innerHTML = res;
    userInput = [res.toString()];
    firstClick = true;
}


function add(left, right)
{
    return left + right;
}

function sub(left, right)
{
    return left - right;
}

function multiply(left, right)
{
    return left * right;
}

function divide(top, bottom)
{
    if (bottom === 0) return "ERROR"
    return top / bottom
}

function remainder(top, bottom)
{
    if (bottom === 0) return "ERROR";
    return Math.abs(top % bottom);
}


window.inputSelected = inputSelected;