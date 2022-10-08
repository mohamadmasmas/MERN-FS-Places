import React, { Fragment, useState, useEffect } from 'react';

// Pages needed
import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttp } from '../../shared/hooks/http-hook';

const Users = () => {

 
  const [ loadedUsers, setLoadedUsers ] = useState([]);
  const {error, isLoading, sendRequest, clearError} = useHttp()

  useEffect(() => {
    const sendHttpRequest = async () => {
      try {
        const resData = await sendRequest('http://localhost:5000/api/users/');
        setLoadedUsers(resData);
      } catch (error) {
          
      }
    }
    
    sendHttpRequest();
  },[sendRequest]);

  return (
      <Fragment>
        <ErrorModal error={error} onClear={clearError}/>
        {isLoading ? <LoadingSpinner asOverlay/>:
        <UsersList users={loadedUsers}/>
        }
      </Fragment>
  )
}

export default Users