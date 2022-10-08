import React, { Fragment, useEffect, useState, useContext } from 'react';
import { useHistory, useParams } from 'react-router-dom';


import './PlaceForm.css'

import Input from '../../shared/components/FormElements/Input';
import Button from '../../shared/components/FormElements/Button';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/utils/validators';
import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { AuthContext } from '../../shared/components/context/auth-context';

import { useForm } from '../../shared/hooks/form-hook';
import { useHttp } from '../../shared/hooks/http-hook';

const UpdatePlace = () => {

    const auth = useContext(AuthContext)
    const placeId = useParams().placeId;
    const { error, isLoading, clearError, sendRequest} = useHttp();
    const histoty = useHistory()

    const [ formState, inputHandler, setFormData ] = useForm({
        title: {
          value: '',
          isValid: false
        },
        description: {
          value: '',
          isValid: false
        }
    }, false);

    const [loadedPlace, setLoadedPlace ] = useState();
    useEffect(() => {
        const sendHttpRequest = async () => {
            try {
                const resData = await sendRequest(`http://localhost:5000/api/places/${placeId}`);

                if(resData){
                    setLoadedPlace(resData);
                    setFormData({
                        title: {
                            value: resData.title,
                            isValid: true
                        },
                        description: {
                            value: resData.descripetion,
                            isValid: true
                        }
                    }, true);
                }
            } catch (error) {
                  
              }
        };
        sendHttpRequest()
    }, [sendRequest, placeId ,setFormData]);


    const onSubmitHandler = async e => {
        e.preventDefault();
        try {
            await sendRequest(`http://localhost:5000/api/places/${placeId}`,
            "PATCH",
            JSON.stringify({
                title: formState.inputs.title.value,
                descripetion: formState.inputs.description.value
            }),{
                "Content-Type": "application/json",
                "authorization": `Bearer ${auth.token}`
            });
            histoty.push(`/${loadedPlace.creator}/places`)
          } catch (error) {
              
          }
        }
    

    if(!loadedPlace){
        return (
            <Fragment>
                {!isLoading ?
                <div className='center'>
                    <Card>
                        <h2>Could not find place</h2>
                    </Card>
                </div>:
                <LoadingSpinner asOverlay/>}
            </Fragment>
        )
    }


  return (
    <Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {!isLoading ? <form className='place-form' onSubmit={onSubmitHandler}>
            <Input 
            id='title' 
            element='input' 
            type='text' 
            label='Title'
            validators={[VALIDATOR_REQUIRE()]}
            errortext='Please enter a valid title'
            onInput={inputHandler}
            value={formState.inputs.title.value}
            valid={formState.inputs.title.isValid}/>
            <Input 
            id='description' 
            element='textarea' 
            label='Description'
            validators={[VALIDATOR_MINLENGTH(5)]}
            errortext='Please enter a valid descreption, at least 5 characters'
            onInput={inputHandler}
            value={formState.inputs.description.value}
            valid={formState.inputs.description.isValid}/> 
            <Button type="submit" disabled={!formState.isValid}>
                Update Place
            </Button>
        </form> :
        <LoadingSpinner asOverlay/>}
    </Fragment>
  )
}

export default UpdatePlace