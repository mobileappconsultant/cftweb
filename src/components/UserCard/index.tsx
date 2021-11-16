import React, {useReducer} from 'react';
import { Link } from 'react-router-dom';
import './usercard.scss';
interface propsObject {
    name : string;
    userName? : string;
    time? : string;
    avatar? : string;
    id? : string;
    role?: string;
  }
const UserCard = (props: propsObject):JSX.Element => {
    const {name, userName, time, role, avatar} = props;
    return(
        <div className={`card user-card w-100 p-3 mb-3`}>   
            <div className="d-flex align-items-center">
                <div className="">
                    <img src={avatar} className="user-profile-img" />
                </div>
                <div className="user-details">
                    <div className="name mb-1">{name}</div>
                    {userName && (<div className="user-name">username:&nbsp;{userName}</div>)}
                    {role && (<div className="user-name">role:&nbsp;{role}</div>)}
                    <div className="small user-name text-muted mt-2">Registered just now</div>
                </div>
            </div>
            <div className="d-flex justify-content-end">
                <div className="mr-3">
                    <Link to="#">
                        View
                    </Link>
                </div>
                <div>
                    <Link to="#">
                        Update
                    </Link>
                </div>
                
            </div>
        </div>
    );

};
export default UserCard;