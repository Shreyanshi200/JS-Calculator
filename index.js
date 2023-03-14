const Calculator = () => {
  const [display, updateDisplay] = React.useState(0);
  const [calculatorState, updateCalculatorState] = React.useState([Num(0)]);
  
  const ids = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine"
  ];
  
  const handleKeypadPress = (key) => {
    const newTokenArray = insertDigit(calculatorState, key);
    updateCalculatorState(newTokenArray);
    const lastToken = end(newTokenArray);
    updateDisplay(lastToken.value);
  }
  
  const handleOperatorPress = (op) => {
    const newOpArray = insertOperation(calculatorState, op);
    updateCalculatorState(newOpArray);
  };
  
  const handleEval = () => {
    const result = evaluate(calculatorState);
    updateDisplay(result);
    updateCalculatorState([Num(result)]);
  }
  
  const handleClear = () => {
    updateDisplay(0);
    updateCalculatorState([Num(0)]);
  }
  
  const keypad = ids.map((button, i) => (
    <button onClick={() => handleKeypadPress(i)} className={ids[i]} id={ids[i]}>
      {i}
    </button>
  ));
  return (
    <>
      <div className="container">
      <div className="display" id="display">
        {display}
        </div>
        {keypad}
        <button onClick={() => handleClear()} className="clear" id="clear">C</button>
        <button onClick={() => handleEval()} className="equals" id="equals">=</button>
        <button onClick={() => handleOperatorPress("+")} className="add" id="add">+</button>
        <button onClick={() => handleOperatorPress("-")} className="subtract" id="subtract">-</button>
        <button onClick={() => handleOperatorPress("x")} className="multiply" id="multiply">x</button>
        <button onClick={() => handleOperatorPress("/")} className="divide" id="divide">/</button>
        <button onClick={() => handleKeypadPress(".")} className="decimal" id="decimal">.</button>
        <button className="memory-clear">MC</button>
        <button className="memory-reset">MR</button>
        <button className="memory-subtract">M-</button>
        <button className="memory-add">M+</button>
        <button className="all-clear">AC</button>
        <button className="sign-change">+/-</button>
        <button className="kitten">🐱</button>
      </div>
    </>
  );
};

/*
TODOs
- 
- 
*/

// Define Token Types
//   { type: "number", value: 2 }
//   { type: "op", value: "+" }
const Operations = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "x": (a, b) => a * b,
    "/": (a, b) => a / b,
};


const evaluate = (tokens) => {
    let a = Number(tokens[0].value);
    for (let i = 1; i < tokens.length; i += 2) {
        let op = tokens[i].value;
        let b = 0;
        if(i+1 < tokens.length){
          b = Number(tokens[i + 1].value) ?? 0;          
        }

        a = Operations[op]?.(a, b);
    }
    return a;
};

const end = (tokens) => tokens[tokens.length - 1];

const Op = (op) => ({ type: "op", value: op });
const Num = (num) => ({ type: "number", value: `${num}` });

const isOp = (token) => token.type === "op";
const isNum = (token) => token.type === "number";

const replaceLast = (list, item) => [...list.slice(0, -1), item];

//  "5 * - + 5"
const isGoddamnedTerribleFakeNegativeNumberOperator = (token) =>
    token.type === "number" && token.value === "-0";

const insertOperation = (tokens, op) => {
    const lastToken = end(tokens);
    const token = Op(op);

    if (isGoddamnedTerribleFakeNegativeNumberOperator(lastToken))
        return [...tokens.slice(0, -2), token];

    if (isNum(lastToken))
        return [...tokens, token];

    return op === "-"
        ? [...tokens, Num("-0")]
        : replaceLast(tokens, token);
};

const isZero = (token) => token.value === "0" || token.value === "-0";
const getSign = (token) => token.value.startsWith("-") ? "-" : "";

const insertDigit = (tokens, digit) => {
    const lastToken = end(tokens);
    if (isOp(lastToken)) {
        return [...tokens, Num(digit)];
    }

    if (isZero(lastToken) && digit != ".") {
        const sign = getSign(lastToken);
        return replaceLast(tokens, Num(`${sign}${digit}`));
    }

    if (lastToken.value.includes(".") && digit === ".") {
        return tokens;
    }

    const token = Num(`${lastToken.value}${digit}`);
    return replaceLast(tokens, token);
};





ReactDOM.render(<Calculator />, document.getElementById("root"));
