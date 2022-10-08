import React, {Fragment, useContext} from 'react';
import { useHistory } from 'react-router-dom';

import './PlaceForm.css'

import Button from '../../shared/components/FormElements/Button';
import Input from '../../shared/components/FormElements/Input';
import { VALIDATOR_REQUIRE, VALIDATOR_MINLENGTH } from '../../shared/utils/validators';
import { AuthContext } from '../../shared/components/context/auth-context';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ImageUpload from '../../shared/components/FormElements/ImageUpload';

// custom Hooks
import { useForm } from '../../shared/hooks/form-hook';
import { useHttp } from '../../shared/hooks/http-hook';

const NewPlace = () => {

  const auth = useContext(AuthContext);
  const {  isLoading, error , sendRequest , clearError } = useHttp();
  const [ formState, inputHandler ] = useForm({
    title: {
      value: '',
      isValid: false
    },
    description: {
      value: '',
      isValid: false
    },
    address: {
      value: '',
      isValid: false
    },
    image: {
      value: null,
      isValid: false
    }
  }, false);

  const history = useHistory();

  const onSubmitHandler = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', formState.inputs.title.value);
    formData.append('descripetion', formState.inputs.description.value);
    formData.append('address', formState.inputs.address.value);
    formData.append('image', formState.inputs.image.value);
    try {
      await sendRequest('http://localhost:5000/api/places/',
      'POST',
      formData,
      {
        authorization: "Bearer "+auth.token
      });
      history.push('/')
    } catch (error) { 
    }
  }

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError}/>
      { isLoading && <LoadingSpinner asOverlay/>}
      <form className='place-form' onSubmit={onSubmitHandler}>
        <Input 
          id='title'
          element='input' 
          type='text' 
          label='Title' 
          validators={[VALIDATOR_REQUIRE()]} 
          error='Please enter a valid value'
          onInput={inputHandler}/>
        <ImageUpload 
          center 
          id='image' 
          onInput={inputHandler} 
          errorText='Please Provide an image'/>
        <Input 
          id='description'
          element='textarea' 
          label='Desciption' 
          validators={[VALIDATOR_MINLENGTH(5)]} 
          error='Please enter a valid description at least five character'
          onInput={inputHandler}/>
        <Input 
          id='address'
          element='input' 
          label='Address' 
          validators={[VALIDATOR_REQUIRE()]} 
          error='Please enter a valid address'
          onInput={inputHandler}/>
        <Button type='submit' disabled={!formState.isValid}>Add Place</Button>
      </form>
    </Fragment>
  )
}

export default NewPlace