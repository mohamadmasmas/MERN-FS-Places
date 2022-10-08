import React, { useRef, useState, useEffect } from 'react';
import Button from './Button';

import './ImageUpload.css'

const ImageUpload = (props) => {

    const [ file, setFile ] = useState();
    const [ preview , setPreview ] = useState();
    const [ isValid, setIsValid ] = useState(false);
    const filePickerRef = useRef();
    const pickImageHandler = () => {
        filePickerRef.current.click()
    };
    useEffect(() => {
        if (!file){
            return
        };
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreview(fileReader.result);
        }
        fileReader.readAsDataURL(file)
    }, [file])

    const pickedHandler = e => {
        let pickedFile;
        let fileIsValid
        if (e.target.files && e.target.files.length === 1){
            pickedFile = e.target.files[0];
            setFile(pickedFile);
            setIsValid(true);
            fileIsValid = true;
        }else{
            setIsValid(false);
            fileIsValid= false
        }
        props.onInput(props.id, pickedFile, fileIsValid)
    }

  return (
    <div className='form-control'>
        <input 
        id={props.id} 
        type='file' 
        ref={filePickerRef}
        style={{display: 'none'}} 
        accept='.jpg,.png,.jpeg'
        onChange={pickedHandler}/>
        <div className={`image-upload ${props.center && 'center'}`}>
            <div className='image-upload__preview'>
                { preview && <img src={preview} alt="Preview"/>}
                { !preview && <p>Please Pick An Image</p>}
            </div>
            <Button type="button" onClick={pickImageHandler}>Pick Image</Button>
        </div>
        { !isValid && <p className='image-upload center'>{props.errorText}</p>}
    </div>
  )
}

export default ImageUpload