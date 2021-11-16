import PageTitle from 'components/PageTitle';
import UserCard from 'components/UserCard';
import React, {useReducer} from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigDown } from 'tabler-icons-react';

const Members = ():JSX.Element => {


    return(
        <>
        <div className="col-md-12 px-0">
            <PageTitle text='Members' />
        </div>
        <div className="bg-white">
        <div className="row  py-4 px-4"> 
            <div className="col-md-6">
                <div className="my-2">
                <UserCard
                    name={'Matt Coal'}
                    userName={'Xi jiping'}
                    time={'22/03/2022'}
                    avatar="https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg"
                    id="2"
                />
                </div>
            </div>
            <div className="col-md-6">
                <div className="my-2">
                <UserCard
                    name={'Matt Coal'}
                    userName={'Xi jiping'}
                    time={'22/03/2022'}
                    avatar="https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg"
                    id="2"
                />
                </div>
            </div>
        </div>
        </div>
       
        </>
    )

};
export default Members;