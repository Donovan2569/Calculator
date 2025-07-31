import { buttonLocations } from "../constants/defaultvalues.js";
let inputBar = document.querySelector(".input"); 
let signs = ['+', '-', '/', '*'];
let userInput = [0];
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
    if (inp === "=" || (signs.includes(userInput[1]) && signs.includes(inp)))
    {
        if (userInput.length === 3) 
        {
            if (inp === "=")
                calculate();
            else
            {
                calculate();
                userInput.push(inp);
                inputBar.innerHTML = userInput.join("");
            }
        }
    }
    else
    {
        if (!signs.includes(inp))
        {
            let temp = 0;
            if (firstClick)
            {
                if (userInput.length != 1) userInput.push(inp);
                else {userInput[0] = inp;}

                inputBar.innerHTML = userInput.join("");
                firstClick = false;
            }
            else
            {
                if (userInput.length != 1) temp = userInput.length - 1;
                userInput[temp] = userInput[temp].toString() + inp.toString();
                inputBar.innerHTML = userInput.join("");
            }
        }
        else if (!signs.includes(userInput[1]) && signs.includes(inp))
        {
            userInput.push(inp);
            inputBar.innerHTML = userInput.join("");
            firstClick = true;
        }
    }
}

function calculate()
{
    let res = 0;
    
    for (let part of userInput)
    {
        if (part === "+") res = add();
        else if (part === "-") res = sub();
        else if (part === "*") res = multiply();
        else if (part === "/") res = divide();
    }

    inputBar.innerHTML = res;
    if (res === "ERROR") res = 0;
    userInput = [res];
    firstClick = true;
}

function add()
{
    let left = parseFloat(userInput[0]);
    let right = parseFloat(userInput[userInput.length - 1]);
    return left + right;
}

function sub()
{
    let left = parseFloat(userInput[0]);
    let right = parseFloat(userInput[userInput.length - 1]);
    return left - right;
}

function multiply()
{
    let left = parseFloat(userInput[0]);
    let right = parseFloat(userInput[userInput.length - 1]);

    return left * right;
}

function divide()
{
    let top = parseFloat(userInput[0]);
    let bottom = parseFloat(userInput[userInput.length - 1]);

    if (bottom > 0) return top / bottom
    return "ERROR"
}

window.inputSelected = inputSelected;