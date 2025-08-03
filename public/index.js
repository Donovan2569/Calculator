const buttonLocations = [
    {value: 'AC'}, {value: '+/-'}, {value: '%'}, {value: "BACK"},
    {value: '7'}, {value: '8'}, {value: '9'}, {value: "/"},
    {value: '4'}, {value: '5'}, {value: '6'}, {value: "*"},
    {value: '1'}, {value: '2'}, {value: '3'}, {value: "-"},
    {value: '0'}, {value: '.'}, {value: '='}, {value: "+"},
]

let inputBar = document.querySelector(".input"); 
let body = document.body;
let modeLabel = document.getElementById("color-mode");

let signs = ['+', '-', '/', '*', '%'];
let keyBoardSigns = {"enter": "=", "backspace": "BACK", "+":"+", "=": "=", '-':'-', '/':'/', '*':'*', '%':'%', ".":"."};
let userInput = ['0'];
let firstClick = true;
let solved  = false;

function createButtons()
{
    const buttonContainer = document.getElementById('buttons-container');
    const template = document.getElementById('buttons-template').textContent;

    buttonLocations.forEach((obj) => {
        let html = template;

        Object.keys(obj).forEach((key) => {
            const regex = new RegExp(`{{${key}}}`,'g');
            html = html.replace(regex, obj[key]);
        })

        buttonContainer.innerHTML += html;
    })
}

createButtons();

function switchMode()
{
    body.classList.toggle("light-mode");
    const isLight = body.classList.contains("light-mode");
    modeLabel.textContent = isLight ? "Dark Mode" : "Light Mode";
}

function updateInputBar(inp)
{    
    solved = false;
    // Allow whole expretion deletion
    if (inp === "AC")
    {
        userInput = ["0"];
        firstClick = true;
        inputBar.innerHTML = userInput.join(" ");
        return;
    }
    
    // Allow single character deletion
    if (inp === "BACK")
    {
        if (firstClick)
        {
            userInput = ["0"];
            inputBar.innerHTML = userInput.join(" ");
            return;
        }
        let lastIndex = userInput.length - 1;
        let last = userInput[lastIndex];
        // Handle negative numbers && ERROR
        if((last.charAt(0) === "-" && last != "-") || last === "ERROR")
        {
            if (last.length > 2 && last != "ERROR") userInput[lastIndex] = last.slice(0, -1);
            else 
            {
                userInput[userInput.length - 1] = "0";
                firstClick = true;
            }
        }

        // Handle floating point numbers
        else if (last.includes("."))
        {
            userInput[lastIndex] = last.slice(0, -1);
            if (userInput[lastIndex] === "0") firstClick = true;
        }
        // Handle numbers > 9
        else if (last.length > 1) userInput[lastIndex] = last.slice(0, -1);

        // Handle all other cases
        else 
        {
            if (userInput.length > 1) userInput.pop();
            else 
            {
                userInput[0] = "0";
                firstClick = true;
            }
        }        
        
        inputBar.innerHTML = userInput.join(" ");
        return;
    }

    // Reverse signage
    if (inp === "+/-")
    {
        if (userInput.length % 2 === 0) return;
        
        userInput[userInput.length - 1] = (parseFloat(userInput[userInput.length - 1]) * -1).toString();
        inputBar.innerHTML = userInput.join(" ");
        return;
    }
    
    // Calculate completed expression (number op number)
    if (inp === "=")
    {
        if (userInput.length % 2 != 0 && userInput.length > 1) calculate();
        return;
    }


    if (!signs.includes(inp)) 
        {
            const last = userInput[userInput.length - 1]
            
            if (last.length == 30) return; // Limit number size to 30 digits
            if (inp === '0' && last === '0')
            {
                firstClick = true;
                return;
            }

            if (userInput.length % 2 === 0) 
            {
                userInput.push(inp === "." ? "0." : inp);                
                firstClick = false;
            }
            
            else if (firstClick) 
            {
                userInput[userInput.length - 1] = inp === "." ? "0." : inp;
                firstClick = false;
            }

            else 
            {
                if (inp === "." && last.includes(".")) return;
                userInput[userInput.length - 1] += inp.toString();
            }
            inputBar.innerHTML = userInput.join(" ");
            return;
        }

    else
    {
        let last = userInput[userInput.length - 1];
        if (userInput[0] === "ERROR") return;
        if (signs.includes(last)) userInput[userInput.length - 1] = inp;
        else 
        {
            if (last.charAt(last.length - 1) === ".") userInput[userInput.length - 1] = last.toString() + '0';
            userInput.push(inp);
        }
        firstClick = false;
            
        inputBar.innerHTML = userInput.join(" ");
        return;
    }
}

function calculate() {
    // Calculate multiplication, division, and remainder
    let i = 0;
    while (i < userInput.length) 
    {
        const op = userInput[i];
        if (op === "*" || op === "/" || op === "%")
        {
            const left = parseFloat(userInput[i - 1]);
            const right = parseFloat(userInput[i + 1]);
            let result;

            if (op === "*") result = multiply(left, right);
            else if (op === "/") result = divide(left, right);
            else result = remainder(left, right);
            if (result === "ERROR") 
            {
                userInput = ["ERROR"];
                inputBar.innerHTML = result;
                firstClick = true;
                return;
            }

            userInput.splice(i - 1, 3, result.toString());
            i = 0; 
        } 
        else i++;
    }

    // Calculate addition and subtraction
    i = 0;
    while (i < userInput.length) 
    {
        const op = userInput[i];
        if (op === "+" || op === "-") 
        {
            const left = parseFloat(userInput[i - 1]);
            const right = parseFloat(userInput[i + 1]);
            const result = op === "+" ? left + right : left - right;

            userInput.splice(i - 1, 3, result.toString());
            i = 0;
        } 
        else  i++;
    }

    let res = parseFloat(userInput[0]);
    res = Number.isInteger(res) ? res : parseFloat(res.toFixed(10));

    inputBar.innerHTML = res;
    userInput = [res.toString()];

    firstClick = true;
    solved = true
}

function multiply(left, right)
{
    return left * right;
}

function divide(numerator, denominator)
{
    const result = numerator / denominator;    
    return Number.isFinite(result) ? result : "ERROR";
}

function remainder(numerator, denominator)
{
    const result = numerator % denominator;
    
    return Number.isFinite(result) ? Math.abs(result) : "ERROR";
}
function copyAnswer() {
    if (solved) {
        navigator.clipboard.writeText(inputBar.innerHTML).then(() => {
            showCopyMessage();
        });
    }
}

function showCopyMessage() {
    const message = document.createElement("div");
    message.textContent = "Copied!";
    message.className = "copy-msg";
    inputBar.parentElement.appendChild(message);

    setTimeout(() => {
        message.remove();
    }, 1000);
}


// Allow for user keyboard interaction
document.addEventListener('keydown', function(event) {
    const isDigit = (char) => /^\d$/.test(char);
    let key = event.key.toLowerCase();
    if (key === "shift") return;
    else if (isDigit(key)) return updateInputBar(key);
    else if (key in keyBoardSigns) updateInputBar(keyBoardSigns[key]);

});

window.updateInputBar = updateInputBar;
window.switchMode = switchMode;
window.copyAnswer = copyAnswer;
;
