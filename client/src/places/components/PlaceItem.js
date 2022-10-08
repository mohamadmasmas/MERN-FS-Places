import React, { Fragment, useState, useContext } from 'react'

import './PlaceItem.css'

// Pages needed
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Backdrop from '../../shared/components/UIElements/Backdrop';
import Maps from '../../shared/components/UIElements/Map';
import { AuthContext } from '../../shared/components/context/auth-context';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';

import { useHttp } from '../../shared/hooks/http-hook';

const PlaceItem = props => {

    const auth = useContext(AuthContext);
    const { error, sendRequest, clearError, isLoading} = useHttp();
    const [showMap, setShowMap] = useState(false);
    const [showWarning, setShowWarning] = useState(false);

    const openMapHandler = () => {
        setShowMap(true)
    }

    const closeMapHandler = (e) => {
        e.preventDefault()
        setShowMap(false)
    }

    const showWarningHandler = (e) => {
        e.preventDefault()
        setShowWarning(true)
    }

    const closeWarningHandler = (e) => {
        e.preventDefault()
        setShowWarning(false)
    }

    const confirmDeleteHandler = async (e) => {
        e.preventDefault();
        try {
            await sendRequest(`http://localhost:5000/api/places/${props.id}`,
            "DELETE", null, {
                "authorization": `Bearer ${auth.token}`
            });
            props.onDelete(props.id);
          } catch (error) {
              
          }
    }
    
  return (  
    <Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {showMap && <Backdrop/>}
        <Modal 
            show={showMap} 
            // this line (47) need fixing
            onHide={closeMapHandler}  
            header={props.address} 
            contentClassName={'place-item__modal-content'}
            footerClassName={'place-item__modal-actions'}
            footer={<Button onClick={closeMapHandler}>Close</Button>}>
                <div className='map-container'>
                    <Maps center={props.coordinates} zoom={16}/>
                </div>
        </Modal>
        <Modal 
            show={showWarning} 
            onHide={closeWarningHandler} 
            header='Warning' 
            footerClassName={'place-item__modal-actions'}
            footer={<Fragment>
                <Button onClick={confirmDeleteHandler} danger>DELETE</Button>
                <Button onClick={closeWarningHandler} inverse>CANCEL</Button>
            </Fragment>}>
                <p>Are you sure you want to delete this picture</p>
        </Modal>
        { isLoading && <LoadingSpinner asOverlay/>}
        <li className='place-item'>
            <Card className='place-item__content'>
                <div className='place-item__image'>
                    <img src={`http://localhost:5000/${props.image}`} alt={props.title}></img>
                </div>
                <div className='place-item__info'>
                    <h2>{props.title}</h2>
                    <h3>{props.address}</h3>
                    <p>{props.description}</p>
                </div>
                <div className='place-item__actions'>
                    <Button inverse onClick={openMapHandler}>VIEW ON MAP</Button>
                    { auth.isLoggedIn && auth.userId === props.creatorId && 
                    <Fragment>
                        <Button to={`/places/${props.id}`}>Edit</Button>
                        <Button danger onClick={showWarningHandler}>Delete</Button>   
                    </Fragment>
                    }
                </div>
            </Card>
        </li>
    </Fragment>
  )
}

export default PlaceItem