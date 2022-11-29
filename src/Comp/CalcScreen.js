import React, { useState } from 'react';
import { FiDelete } from "react-icons/fi";
import { GrFormAdd, GrFormSubtract } from "react-icons/gr";
import { TbSquareRoot2 } from 'react-icons/tb';
import './CalcStyle.css';

export default function CalcScreen() {

    const [calcButton, setCalcButton] = useState([                                          // calc face dispaly
        [   { name: 'clear', value: 'CE', id: 10 },
            { name: 'del', value: 'C' },
            { name: 'delOne', value: 'D' },
            { name: 'precantage', value: '%' },

        ],

        [   { name: 'divByone', value: '1/X' },
            { name: 'pow2', value: 'X2' },
            { name: 'squ', value: '\u221A' },
            { name: 'multi', value: '*' },

        ],

        [
            { name: 'number', value: '7' },
            { name: 'number', value: '8' },
            { name: 'number', value: '9' },
            { name: 'sub', value: '-' }
        ],

        [
            { name: 'number', value: '4' },
            { name: 'number', value: '5' },
            { name: 'number', value: '6' },
            { name: 'add', value: '+' }
        ],

        [
            { name: 'number', value: '1' },
            { name: 'number', value: '2' },
            { name: 'number', value: '3' },
            { name: 'divide', value: '/' }
        ],
        
        [   
            { name: 'numSign', value: '+/-' },
            { name: 'number', value: '0' },
            { name: 'dot', value: '.' },
            { name: 'calculate', value: '=' }
        ]
        
    ]);
    const [userInputDisplay, setUserInputDisplay] = useState('0');                          // user input
    const [calculationDisplay, setCalculationDisplay] = useState('');                       // display screen var
    const [calculationHistory, setCalcHistory] = useState([]);                              // calculator history
    const [isSimbolPress, setIsSimbolPressed] = useState(false);                            // was opreator pressed
    const [isDot, setIsDot] = useState(false);                                              // user placed dot
    const [isSolved, setIsSolved] = useState(false);                                        // user already pressed equal
    const [isNegative, setIsNegative] = useState(false);                                    // user changed the value pos/neg
    const [lastChar, setLastChar] = useState();

    //display calculator
    const calcFace = () => {
        return (
            <table className='butt_Table'>
                <tbody>
                    { calcButton.map((row, i) => {
                    return (
                        <tr key={`row_${i}`}>
                            {row.map((cell,j) => {
                                return (
                                    <td 
                                        onClick={ () => addButtonPress(cell.value) } 
                                        key={`button_${i}${j}`} 
                                        className='button_Box'
                                    >
                                        { iconDisplay(cell.value) }
                                    </td>
                                )
                            })}
                        </tr>
                        )
                     })}
                </tbody>
            </table> 
        )

    };

    const iconDisplay = (val) => {
        if ( val === 'D' ) { return <FiDelete /> }
        if ( val === '+/-' ) { 
            if ( userInputDisplay.charAt(0) === '-' && isNegative === true || userInputDisplay.charAt(userInputDisplay.lastIndexOf(' ') + 1) === '-' && isNegative === true ) {
                return <GrFormAdd />
            } else if ( userInputDisplay.length > 2 && userInputDisplay.charAt(userInputDisplay.length-1) === '-' ) {
                return <GrFormAdd />
            } else {
                return <GrFormSubtract />
            }
        }
        if ( val === '\u221A' ) { return <div><sup>y</sup>&#8730;x</div> } {/* return <TbSquareRoot2 /> */}
        if ( val === 'X2' ) { return <div>X<sup>2</sup></div> }
        if ( val === '1/X' ) { return <div><sup>1</sup>/x</div>}
        if ( val !== 'D' && val !== '+/-' ) { return val}
        

    };

    // button press display on screen 
    const addButtonPress = (x) => {
        let num = ['1','2','3','4','5','6','7','8','9','0'];
        let oper = ['+', '-', '*', '/', '%', '\u221A'];
        let squr = ['1/X', 'X2'];
        let clean = ['CE', 'C', 'D'];
        let numVal = num.filter((cell) => cell == x);                                                                   // find what user pressed
        let calcVal = oper.filter((cell) => cell == x);
        let sqVal = squr.filter((cell) => cell == x);
        let cleanVal = clean.filter((cell) => cell == x);
        let int = userInputDisplay + x;
        let last = int.charAt(int.length-1);
        setLastChar(last);
        switch (true) {
            // user pressed number
            case ( numVal.length === 1 ):
                if ( isSolved ) {
                    setUserInputDisplay(x);
                    setIsSolved(false);
                } else {
                    userInputDisplay === '0' ? setUserInputDisplay(x) : setUserInputDisplay(userInputDisplay + x);
                }                
                break;
            // user pressed operator
            case ( calcVal.length === 1 ):
                if ( userInputDisplay === '0' ) {
                    setUserInputDisplay('0');
                    setIsSolved(false);
                }
                else if ( isSimbolPress === false && userInputDisplay.charAt(userInputDisplay.length - 1) !== '.' && userInputDisplay.charAt(userInputDisplay.length - 1) !== '-') {
                    setUserInputDisplay(`${ userInputDisplay } ${x} `);
                    setIsSimbolPressed(true);
                    setIsDot(false);
                    setIsNegative(false);
                    setIsSolved(false);
                }
                // add issimboled presses ==>
                else if ( isSimbolPress === true ) {
                    // if opreator already pressed/ shown
                    if ( (oper.filter((cell) => cell === lastChar)).length === 1 ) {
                        delOptions('D', x);
                    } else { runCalculation(x) } 
                }
                break;
            // user pressed one of the squre operators
            case ( sqVal.length === 1 ):
                if ( userInputDisplay == 0 ) {
                    setUserInputDisplay('0');
                    setIsSolved(false);
                }
                else if ( x === '1/X' || x === 'X2' ) {
                    runSQCrunch(x);
                }
                break;
            // user pressed clear option
            case ( cleanVal.length === 1 ):
                delOptions(x);
                break;
            // user added .
            case ( x === '.' ): 
                if ( isDot === false ) {
                    userInputDisplay === 0 
                        ? setUserInputDisplay('0' + '.') 
                            : userInputDisplay.charAt(userInputDisplay.length - 1) === ' ' 
                            ? setUserInputDisplay(userInputDisplay + '0.') 
                        :  setUserInputDisplay(userInputDisplay + '.');
                    setIsDot(true);
                }
                break;
            // user changed to positive/negative
            case ( x === '+/-' ):
                // number before operator 
                if ( userInputDisplay.indexOf(' ') === -1 ) {   
                    if ( isNegative === false ) {
                        userInputDisplay === '0' ? setUserInputDisplay('-') : setUserInputDisplay('-' + userInputDisplay);
                        setIsNegative(true);
                    }
                    else { 
                        userInputDisplay === '-' ? setUserInputDisplay('0') : setUserInputDisplay(userInputDisplay.slice(1, userInputDisplay.length));
                        setIsNegative(false);
                    }
                }
                // number after operator
                else {
                    if ( isNegative === false ) {
                        userInputDisplay.charAt(userInputDisplay.length - 1) === ' ' 
                            ? setUserInputDisplay(userInputDisplay + '-') 
                            : setUserInputDisplay(userInputDisplay.slice(0, userInputDisplay.lastIndexOf(' ')) + ' -' + userInputDisplay.slice(userInputDisplay.lastIndexOf(' ') + 1));
                        setIsNegative(true);
                    }
                    else { 
                        userInputDisplay.charAt(userInputDisplay.length - 1) === '-' 
                            ? setUserInputDisplay(userInputDisplay)
                            : setUserInputDisplay(userInputDisplay.slice(0, userInputDisplay.lastIndexOf(' ')) + ' ' + userInputDisplay.slice(userInputDisplay.lastIndexOf(' ') + 2));
                        
                        setIsNegative(false);
                    }
                }
                break;
            // user pressed solve
            case ( x === '=' && isSimbolPress === true ):
                runCalculation(x);
                break;
            default:
                break;
        }
        
    };

    // user pressed one of the delete options
    const delOptions = (del, x) => {
        switch (true) {
            case del === 'D':
                switch (true) {
                    case ( userInputDisplay.length === 1 ):
                        setUserInputDisplay('0');
                        setIsNegative(false);
                        break;
                    case ( userInputDisplay.length !== 1 && userInputDisplay.charAt(userInputDisplay.length - 1) !== ' ' ):
                        if ( userInputDisplay.charAt(userInputDisplay.length-1) === '.' ) { setIsDot(false) };
                        setUserInputDisplay(userInputDisplay.slice(0, userInputDisplay.length-1));
                        setIsNegative(false);
                        break;
                    case ( x === undefined ):
                        setUserInputDisplay(userInputDisplay.slice(0, userInputDisplay.length-3));                          // deleting opreator? 
                        setIsSimbolPressed(false);
                        break;
                    case ( x !== undefined ):
                        setUserInputDisplay(userInputDisplay.slice(0, userInputDisplay.length-3) +  ` ${x} ` );              // replacing opreator? 
                        setIsDot(false);
                        setIsSimbolPressed(true);
                        break;
                    default:
                        break;
                }
                // if ( userInputDisplay.charAt(userInputDisplay.length-1) !== ' ' ) {
                //     // if ( userInputDisplay.charAt(userInputDisplay.length-1) === '.' ) { setIsDot(false) }; 

                //     // userInputDisplay.length !== 1 ? setUserInputDisplay(userInputDisplay.slice(0, userInputDisplay.length-1)) : setUserInputDisplay('0'), setIsNegative(false);
                // }
                // else if ( x === undefined ) {
                //     setUserInputDisplay(userInputDisplay.slice(0, userInputDisplay.length-3));              // deleting opreator? 
                //     setIsSimbolPressed(false);
                // }
                // else  if ( x !== undefined ) { 
                //     setUserInputDisplay(userInputDisplay.slice(0, userInputDisplay.length-3) +  ` ${x} ` );              // replacing opreator? 
                //     setIsDot(false);
                // }
                break;
            case del === 'C':
                setUserInputDisplay('0');
                setIsSimbolPressed(false);
                setIsDot(false);
                setIsNegative(false);
                break;
            case del === 'CE':
                setUserInputDisplay('0');
                setCalculationDisplay('');
                setIsSimbolPressed(false);
                setIsDot(false);
                setIsNegative(false);
                break;
            default:
                break;
        }
    };

    // calculate
    const runCalculation = (x) => {
        setIsSimbolPressed(false);
        let firstSpace = userInputDisplay.indexOf(' ');
        let secondSpace = userInputDisplay.indexOf(' ', userInputDisplay.indexOf(' ') + 1);
        let firstNum = userInputDisplay.slice(0, firstSpace);
        let secondNum = userInputDisplay.slice(secondSpace + 1);
        let opreator = (userInputDisplay.slice(firstSpace + 1, secondSpace).charAt(0));
        let ans = crunch(firstNum, secondNum, opreator);
        if ( firstNum.charAt(0) === '-' ) { firstNum = `(${firstNum})`};
        if ( secondNum.charAt(0) === '-' ) { secondNum = `(${secondNum})`};
        if ( Math.sign(ans) < 0 ) { ans = `${ans}`};
        // setCalculationDisplay(`${firstNum} ${calculation} ${secondNum} = ${ans}`);      // the equastion to display
        // setCalculationDisplay(`${firstNum}${opreator} ${secondNum}`);      // the equastion to display
        setCalculationDisplay(firstNum + ' ' + opreator + ' ' + secondNum);      // the equastion to display
        setCalcHistory([...calculationHistory, {id: calculationHistory.length+1, exp: `${firstNum} ${opreator} ${secondNum} = ${ans}`} ]);       // save in history
        switch(true) {
            case x === '=':
                setUserInputDisplay(`${ans}`);
                setIsSolved(true);
                Math.sign(ans) > 0 ? setIsNegative(false) : setIsNegative(true);
                setIsDot(false);
            break;
            case x !== '=':
                setUserInputDisplay(`${ans} ${x} ` );
                setIsSimbolPressed(true);
                setIsDot(false);
            break;
            default:
                break;
        }
        
    };

    // check opreator and solve
    const crunch = (x,y,z) => {
        switch (true) {
            case ( z === '+' ):
                return parseFloat(x) + parseFloat(y);
            case ( z === '-' ):
                return parseFloat(x) - parseFloat(y);
            case ( z === '*' ):
                return parseFloat(x) * parseFloat(y);
            case ( z === '/' ):
                return parseFloat(x) / parseFloat(y);
            case ( z === '%' ):
                debugger
                let ans = ((parseFloat(y) * 100 ) / parseFloat(x)).toFixed(8);

                while ( ans.charAt(ans.length - 1) === '0' ) {
                    ans = ans.slice(0, ans.length -1);
                }
                ans.charAt(ans.length -1) === '.' ? ans = ans.slice(0, ans.length -1) : ans = ans;
                return ans;

            case ( z === '\u221A' ):
                return (Math.pow(parseFloat(y), 1/parseFloat(x)));
            default:
                break;
        }
    
    };

    const runSQCrunch = (sq) => {
        let ans;
        switch (true) {
            case ( sq === 'X2' ):
                ans = Math.pow(parseFloat(userInputDisplay), 2);
                setCalculationDisplay({num: userInputDisplay, op: '^', of: '2'});
                setCalcHistory([...calculationHistory, { id: calculationHistory.length+1, exp: `${userInputDisplay} ^ 2`}]);
                setUserInputDisplay(ans.toString());
                setIsSolved(true);
                break;
            case ( sq === '1/X' ):
                ans = 1/parseFloat(userInputDisplay);
                setCalculationDisplay({num: '1', op: '/', of: userInputDisplay});
                setCalcHistory([...calculationHistory, { id: calculationHistory.length+1, exp: `1 / ${userInputDisplay}`}]);
                setUserInputDisplay(ans.toString());
                setIsSolved(true);
                break;
            default:
                break;
        }
        
    }

  return (
    <div className='calc_Container'>
        <div className='displayContainer' style={{ userSelect: 'none' }}>
            <input 
                value={ typeof calculationDisplay === 'string' ? calculationDisplay : calculationDisplay.num + calculationDisplay.op + calculationDisplay.of } 
                className='outPut calOutputField' 
                readOnly 
            />
            <input value={ userInputDisplay } className='outPut displayField' readOnly/>
        </div>
        <div className='butt_Container'>
        { calcFace() }
        </div>
    </div>
  )
};
