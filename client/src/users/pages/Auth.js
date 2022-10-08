import React, { useState, useContext, Fragment } from 'react';

import './Auth.css';

import Card from '../../shared/components/UIElements/Card';
import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from '../../shared/utils/validators';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

import { useForm } from '../../shared/hooks/form-hook';
import { AuthContext } from '../../shared/components/context/auth-context';
import { useHttp } from '../../shared/hooks/http-hook'

const Auth = () => {

    const {isLoading, error , sendRequest , clearError} = useHttp();
    const auth = useContext(AuthContext)
    const [ formState, inputHandler, setFormData ] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false )

    const submitHandler = async (e) => {
        e.preventDefault();
        if(isLoginMode){
            try {
                const resData = await sendRequest('http://localhost:5000/api/users/login',
                'POST',
                JSON.stringify({
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                    }),
                {
                'Content-Type': 'application/json'
                }
                );
                auth.login(resData.userId, resData.token);
            } catch (error) {
                console.log(error)
            }
          
        }else{
            try {
                // Because we can't send images in json format
                const formData = new FormData();
                formData.append('name', formState.inputs.name.value);
                formData.append('email', formState.inputs.email.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);
                const resData = await sendRequest('http://localhost:5000/api/users/sign-up',
                'POST',
                formData
                );
                auth.login(resData.userId, resData.token);
            } catch (error) {
                console.log(error)
            }
            
        }
    };

    const [ isLoginMode, setIsLoginMode ] = useState(true)

    const switchHandler = () => {
        if(!isLoginMode){
            setFormData({
                ...formState.inputs,
                name: undefined,
                image: undefined,
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        }else{
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                },
                image:{
                    value: null,
                    isValid: false
                }
            }, false)
        }
        setIsLoginMode(prevState => !prevState)
    }

    const errorHandler = () => {
        clearError()
    }

  return (
    <Fragment>
    {isLoading && <LoadingSpinner asOverlay/>}
    <ErrorModal error={error} onClear={errorHandler}/>
    <Card className='authentication'>
        
        <h2>Login Required</h2>
        <hr></hr>
        <form onSubmit={submitHandler}>
            { !isLoginMode &&
                <Input element='input'
                id='name'
                type='text'
                label='Name'
                validators={[VALIDATOR_REQUIRE()]}
                error='please enter your name'
                onInput={inputHandler}/>
            }
            { !isLoginMode &&
                <ImageUpload center id='image' onInput={inputHandler} errorText='Please Provide an image'/>
            }
            <Input element='input'
            id='email'
            type='email'
            label='E-mail'
            validators={[VALIDATOR_EMAIL()]}
            error='Please enter a valid email address'
            onInput={inputHandler}/>
            <Input element='input'
            id='password'
            type='password'
            label='Password'
            validators={[VALIDATOR_MINLENGTH(6)]}
            error='Please enter a valid Password'
            onInput={inputHandler}/>
            <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'Login':'Sign up'}</Button>
        </form>
        <Button inverse onClick={switchHandler}>{isLoginMode ? 'Sign up':'Login'}</Button>
    </Card>
    </Fragment>
  )
}

export default Auth