import React, { useReducer, useEffect } from 'react';

import './Input.css';

import { validate } from '../../utils/validators';

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.value,
                isValid: validate(action.value, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };
        default:
            return state;
    }
}

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.value || '',
        isTouched: false,
        isValid: props.valid || false
    });

    const { id, onInput } = props
    const { value, isValid } = inputState

    useEffect(() => {
        onInput(id, value, isValid)
    },[ id , value , isValid , onInput ])

// Handlers-----------------------
    const changeHandler = (e) => {
        dispatch({
            type: 'CHANGE',
            value: e.target.value,
            validators: props.validators
            
        })
    }
    const touchHandler = () => {
        dispatch({
            type: 'TOUCH'
        })
    }

    const element = props.element === 'input' ? 
    ( <input 
        id={props.id} 
        type={props.type} 
        placeholder={props.placeholder} 
        onBlur={touchHandler}
        onChange={changeHandler} 
        value={inputState.value}/> ) 
    : 
    ( <textarea 
        id={props.id} 
        row={props.row || 3} 
        onBlur={touchHandler}
        onChange={changeHandler} 
        value={inputState.value}/> )

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
        <label htmlFor={props.id}>{props.label}</label>
        {element}
        {!inputState.isValid && inputState.isTouched && <p>{props.error}</p>}
    </div>
  )
}

export default Input