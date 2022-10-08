import React from 'react';

import './Map.css'

const Map = props => {

  return (
    <div className={`map ${props.className}`} style={props.className}>
        <img alt='MAP' src='https://fdn.gsmarena.com/imgroot/news/21/05/google-maps-updates/-1200/gsmarena_004.jpg'/>
    </div>
  )
}

export default Map