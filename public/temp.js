function updateInputBar()
{
    let length = userInput.length;
    
    if (inp === "AC")
    {
        userInput = ["0"];
        firstClick = true;
        inputBar.innerHTML = userInput.join(" ");
        return;
    }

    if (inp === "BACK")
    {
        let lastIndex = length - 1;
        let last = userInput[lastIndex];
        console.log(last, last.length)
        // Handle negative numbers && ERROR
        if((last.charAt(0) === "-" && last.length > 1) || last === "ERROR")
        {
            if (last.length > 2) userInput[lastIndex] = last.slice(0, -1);
            else 
            {
                userInput[length - 1] = "0";
                firstClick = true;
            }
        }

        // Handle floating point numbers
        else if (last.includes("."))
        {
            userInput[lastIndex] = last.slice(0, -1);
            if (last === "0") firstClick = true;
        }

        // Handle numbers > 9
        else if (last.length > 1) userInput[lastIndex] = last.slice(0, -1);
        // Handle all other cases
        else 
        {
            if (length > 1) userInput.pop();
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
    else if (inp === "+/-" && length % 2 != 0)
    {
        userInput[length - 1] = (parseFloat(userInput[length - 1]) * -1).toString();
        inputBar.innerHTML = userInput.join(" ");
        return;
    }

    else if (inp === "=")
    {
        if (length % 2 != 0 && length > 1) calculate();
        return;
    }


    if (!signs.includes(inp)) 
        {
            if (inp === '0' && (userInput[length - 1] === '0'))
            {
                firstClick = true;
                return;
            }

            else if (length % 2 === 0) 
            {
                if (inp === '.') userInput.push("0.");
                else userInput.push(inp);
                
                firstClick = false;
            }
            
            else if (firstClick) {
                if (inp === ".") userInput[length - 1] = "0.";
                else userInput[length - 1] = inp;
                
                firstClick = false;
            }

            else {
                if (inp === "." && userInput[length - 1].includes(".")) return;

                userInput[length - 1] = userInput[length - 1].toString() + inp.toString();
            }
            inputBar.innerHTML = userInput.join(" ");
            return;
        }

        else if (signs.includes(inp))
        {
            if (userInput[0] === "ERROR") return;
            if (signs.includes(userInput[length - 1])) userInput[length - 1] = inp;
            else 
            {
                if (userInput[length - 1].charAt(userInput[length - 1].length - 1) === ".") userInput[userInput.length - 1] = userInput[userInput.length - 1].toString() + '0';
                userInput.push(inp);
            }
            firstClick = true;
            
            inputBar.innerHTML = userInput.join(" ");
            return;
        }
}