import './App.css';
import React, { useReducer } from 'react';
import { DigitBtn, OperationBtn, TrigBtn } from './components';

export const ACTIONS = {
  ADD_DIGIT: 'add-digit',
  CHOOSE_OPERATION: 'choose-operation',
  CHOOSE_TRIG: 'choose-trig',
  CLEAR: 'clear',
  DELETE_DIGIT: 'delete-digit',
  EVALUATE: 'evaluate'
}

function reducer(state, { type, payload }) {
  switch(type) {
    case ACTIONS.ADD_DIGIT: 
      if(state.overwrite) {
        return {
          ...state,
          currentOp: payload.digit,
          overwrite: false,
        }
      }
      if (payload.digit === "0" && state.currentOp === "0") {
        return state
      }
      if (payload.digit === "." && state.currentOp.includes(".")) {
        return state
      }
      if (payload.digit === "π") {
        payload.digit = Math.PI;
        return {
          ...state,
          currentOp: `${state.currentOp || ""}${payload.digit}`
        }
      }
      return {
        ...state,
        currentOp: `${state.currentOp || ""}${payload.digit}`,
      }
    case ACTIONS.CHOOSE_OPERATION: 
      if (state.currentOp == null && state.previousOp == null) {
        return state
      }
      if (state.currentOp == null) {
        return {
        ...state,
        operation: payload.operation,
        }
      }
      if (state.previousOp == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOp: state.currentOp,
          currentOp: null,
        }
      }
      return {
        ...state,
        previousOp: evaulate(state),
        operation: payload.operation,
        currentOp: null,
      }
    case ACTIONS.CHOOSE_TRIG:
      if(state.overwrite) {
        return {
          ...state,
          currentOp: payload.trig,
          overwrite: false,
        }
      }
    case ACTIONS.CLEAR: 
      return {}
    case ACTIONS.DELETE_DIGIT:
      if(state.currentOp == null) {
        return state
      }
      if(state.currentOp === 1) {
        return { ...state, currentOp: null }
      }
      return {
        ...state,
        currentOp: state.currentOp.slice(0, -1)
      }
    case ACTIONS.EVALUATE:
      if(state.operation == null ||
        state.currentOp == null ||
        state.previousOp == null) {
          return state
        }
        return {
          ...state,
          overwrite: true,
          previousOp: null, 
          operation: null, 
          currentOp: evaulate(state)
        }
  }
}

function evaulate({ currentOp, previousOp, operation }){
  const prev = parseFloat(previousOp)
  const current = parseFloat(currentOp)
  if(isNaN(prev) || isNaN(current)) {
    return ""
  }
  let computation = ""
  switch (operation) {
    case "+":
      computation = prev + current 
      break
    case "-":
      computation = prev - current
      break 
    case "*":
      computation = prev * current
      break
    case "/":
      computation = prev / current
      break
    case "^":
      computation = prev ** current
      break
    case "sin":
      computation = Math.sin(prev)
      break
    case "cos":
      computation = Math.cos(current)
      break
    case "tan":
      computation = Math.tan(current)
      break
  }
  return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})
function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".")
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOp, previousOp, operation }, dispatch ] = useReducer(reducer, {})

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-op">{formatOperand(previousOp)} {operation}</div>
        <div className="current-op">{formatOperand(currentOp)}</div>
      </div>
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({ type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationBtn operation="/" dispatch={dispatch} />
      <DigitBtn digit="1" dispatch={dispatch} />
      <DigitBtn digit="2" dispatch={dispatch} />
      <DigitBtn digit="3" dispatch={dispatch} />
      <OperationBtn operation="*" dispatch={dispatch} />
      <DigitBtn digit="4" dispatch={dispatch} />
      <DigitBtn digit="5" dispatch={dispatch} />
      <DigitBtn digit="6" dispatch={dispatch} />
      <OperationBtn operation="+" dispatch={dispatch} />
      <DigitBtn digit="7" dispatch={dispatch} />
      <DigitBtn digit="8" dispatch={dispatch} />
      <DigitBtn digit="9" dispatch={dispatch} />
      <OperationBtn operation="-" dispatch={dispatch} />
      <DigitBtn digit="." dispatch={dispatch} />
      <DigitBtn digit="0" dispatch={dispatch} />
      <button className="span-two" onClick={() => dispatch({ type: ACTIONS.EVALUATE })}>=</button>
      <TrigBtn trig="sin" dispatch={dispatch} />
      <TrigBtn trig="cos" dispatch={dispatch} />
      <TrigBtn trig="tan" dispatch={dispatch} />
      <DigitBtn digit="π" dispatch={dispatch} />
      <OperationBtn operation="^" dispatch={dispatch} />
      
    </div>
  );
}

export default App;
