import { useState, useCallback, useEffect } from "react";

let logOutTimer;

export const useAuth = () => {
    const [ token , setToken ] =  useState(false);
    const [ userId, setUserId ] = useState(null);
    const [ tokenExpiry, setTokenExpiry ] = useState()
  
    const login = useCallback((uid, token, expiration_date) => {
        setToken(token);
        const expirationDate = expiration_date || new Date(new Date().getTime() + (1000 * 60 * 60));
        setTokenExpiry(expirationDate);
        localStorage.setItem('userData', JSON.stringify({
          userId: uid,
          token: token,
          expiration: expirationDate.toISOString()
        }))
        setUserId(uid);
    }, [])
  
    const logout = useCallback(() => {
      setToken(null);
      setUserId(null);
      setTokenExpiry(null);
      localStorage.removeItem('userData')
    }, []);
  
    useEffect(() => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if(userData){
        if( userData.token &&
        new Date(userData.expiration) > new Date()){
        login(userData.userId, userData.token, new Date(userData.expiration));
      }}
    }, [login]);
  
    useEffect(() => {
      if(token && tokenExpiry){
        const remainingTime = tokenExpiry.getTime() - new Date().getTime()
        logOutTimer = setTimeout(logout, remainingTime);
      }else{
        clearTimeout(logOutTimer)
      }
    },[token, logout, tokenExpiry]);

    return { login, logout, token, userId }
}