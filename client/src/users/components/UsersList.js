import React from 'react'
// Style
import './UsersList.css'
// Pages needed
import UserItem from './UserItem'
import Card from '../../shared/components/UIElements/Card'

const UsersList = props => {
    if (props.users.length === 0){
        return <div className='center'>
                    <Card className='not-found'>
                        <h2>No Users Found.</h2>
                    </Card>
                </div>
    }
    return <ul className='users-list'>
        {props.users.map((user) => {
            return <UserItem 
                    key={user._id} 
                    id={user._id}
                    name={user.name}
                    image={user.image}
                    places={user.places}/>
        })}
    </ul>
}

export default UsersList