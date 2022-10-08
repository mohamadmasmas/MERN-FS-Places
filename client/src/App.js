import React from 'react';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

// Pages needed
import MainNavigation from './shared/components/Navigation/MainNavigation';
import Users from './users/pages/Users';
import NewPlace from './places/pages/NewPlace';
import UserPlaces from './places/pages/UserPlaces';
import UpdatePlace from './places/pages/UpdatePlace';
import Auth from './users/pages/Auth';
import { AuthContext } from './shared/components/context/auth-context';

import { useAuth } from './shared/hooks/auth-hook';

function App() {

  const { login, logout, token, userId } = useAuth()

  let routes;

  if (token){
    routes = (
      <Switch>
        <Route exact path='/'>
          <Users/>
        </Route>
        <Route exact path='/:userId/places'>
          <UserPlaces/>
        </Route>
        <Route exact path='/places/new'>
          <NewPlace/>
        </Route>
        <Route exact path='/places/:placeId'>
          <UpdatePlace/>
        </Route>
        <Redirect to='/'/>
      </Switch>
    )
  }else{
    routes = (
      <Switch>
        <Route exact path='/'>
          <Users/>
        </Route>
        <Route exact path='/:userId/places'>
          <UserPlaces/>
        </Route>
        <Route exact path='/auth'>
          <Auth/>
        </Route>
        <Redirect to='/auth'/>
      </Switch>
    )
  }

  return (
    <AuthContext.Provider value={{userId: userId , isLoggedIn: !!token, token: token, login:login, logout:logout}}>
    <Router>
      <MainNavigation/>
      <main>
        { routes }
      </main>
    </Router>
    </AuthContext.Provider>
  );
}

export default App;
