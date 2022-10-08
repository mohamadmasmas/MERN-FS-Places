import React, { Fragment, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';
import { useHttp } from '../../shared/hooks/http-hook';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = props => {

    const { error, isLoading, sendRequest, clearError} = useHttp();
    const userId = useParams().userId;
    
    const [ loadedPlaces, setLoadedPlaces ] = useState([]);

    useEffect(() => {
        const sendHttpRequest = async () => {
            try {
              const resData = await sendRequest(`http://localhost:5000/api/places/users/${userId}`);
              setLoadedPlaces(resData);
            } catch (error) {
                
            }
          }
          
        sendHttpRequest();
    },[sendRequest, userId]);

    const placeDeletedHandler = (placeId) => {
      setLoadedPlaces(prevPlaces => prevPlaces.filter(p => p._id !== placeId))
    }
    

  return <Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {isLoading ? <LoadingSpinner asOverlay/>:
            <PlaceList places={loadedPlaces} onDelete={placeDeletedHandler}/>}
        </Fragment>
  
}

export default UserPlaces