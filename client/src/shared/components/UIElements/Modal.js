import React, { Fragment } from 'react';
import ReactDOM from 'react-dom';
import { CSSTransition } from 'react-transition-group';

import './Modal.css'

const ModalOverlay = props => {
    const content = <div className={`modal ${props.className}`} style={props.style}>
      <header className={`modal__header ${props.headerClassName}`}>
        <h2>{props.header}</h2>
      </header>
      <form onSubmit={props.onSubmit ? props.onSubmit : (e) => e.preventDefault}>
        <div className={`modal__content ${props.contentClassName}`}>
          {props.children}
        </div>
        <footer className={`modal__footer ${props.footerClassName}`}>
          {props.footer}
        </footer>
      </form>
    </div>
    return ReactDOM.createPortal(content, document.getElementById('modal-hook'))
}

const Modal = props => {
  return <Fragment>
          {props.show}
          <CSSTransition 
            in={props.show} 
            mountOnEnter 
            unmountOnExit 
            timeout={200} classNames={'modal'}>
              <ModalOverlay {...props}/>
          </CSSTransition>
        </Fragment>
}


export default Modal