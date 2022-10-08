import React from 'react'

import './PlaceList.css'

import PlaceItem from './PlaceItem';
import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';

const PlaceList = props => {

    if (props.places.length === 0 ){
        return <div className='place-list center'>
            <Card className='empty'>
                <h2>No Places Found.</h2>
                <Button to='/places/new'>Share a Place</Button>
            </Card>
        </div>
    }

  return (
    <ul>
        {   
        props.places.map((place) => {
            return <PlaceItem 
                key={place._id} 
                id={place._id} 
                image={place.image} 
                title={place.title} 
                address={place.address}
                description={place.descripetion}
                creatorId={place.creator}
                coordinates={place.location}
                onDelete={props.onDelete}>
            </PlaceItem>
        })
        }
    </ul>
  )
}

export default PlaceList