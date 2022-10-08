import React from 'react'
import { Link } from 'react-router-dom'

// Style
import './UserItem.css'

// Pages needed
import Avatar from '../../shared/components/UIElements/Avatar'
import Card from '../../shared/components/UIElements/Card'

const UserItem = props => {
  return (
    <li className='user-item'>
        <Card className='user-item__content'>
            <Link to={`/${props.id}/places`}>
                <div className='user-item__image'>
                    <Avatar image={`http://localhost:5000/${props.image}`} alt='' width='' className=''/>
                </div>
                <div className='user-item__info'>
                    <h2>{props.name}</h2>
                    { props.places.length > 0 &&
                    <h3>
                        {props.places.length} {props.places.length === 1 ? 'Place':'places' }
                    </h3>
                    }
                </div>
            </Link>
        </Card>
    </li>
  )
}

export default UserItem