import React, { Fragment, useState }  from 'react';
import { Link } from 'react-router-dom';

//  Style
import './MainNavigation.css'
// Pages needed
import MainHeader from './MainHeader'
import NavLinks from './NavLinks';
import SlideDrawer from './SlideDrawer';
import BackDrop from '../UIElements/Backdrop'


const MainNavigation = props => {
  const [DrawerIsOpen, setDrawerIsOpen] = useState(false)

  const onClickHandler = (e) => {
    setDrawerIsOpen(!DrawerIsOpen)
  }
  return (
    <Fragment>
      {DrawerIsOpen && <BackDrop onClick={onClickHandler}/>} 
      <SlideDrawer show={DrawerIsOpen}>
        <nav className='main-navigation__drawer-nav' onMouseLeave={onClickHandler}>
          <NavLinks/>
        </nav>
      </SlideDrawer>
      <MainHeader>
          <button className='main-navigation__menu-btn' onClick={onClickHandler}>
              <span />
              <span />
              <span />
          </button>
          <h1 className='main-navigation__title'>
              <Link to='/'>Your Places</Link> 
          </h1>
          <nav className='main-navigation__header-nav'>
              <NavLinks/>
          </nav>
      </MainHeader>
    </Fragment>
  )
}

export default MainNavigation