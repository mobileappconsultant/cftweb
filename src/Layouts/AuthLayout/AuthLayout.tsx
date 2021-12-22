import React, {useReducer} from 'react';
import authImage from 'assets/images/frame.svg';
import './authlayout.scss';
const AuthLayout = (props: any): JSX.Element => {
    return(
        <div className="d-flex row align-items-center">
            <div className="col-md-5">
                <div className="w-100 auth-img">
                    <img src={authImage}  className="w-100 m-h-100 px-5"/>
                </div>
            </div>
           <div className="col-md-7 text-center mt-4">
               <div className="auth-children">
                    {props.children}
               </div> 
           </div>
            
        </div>
    )
};

export default AuthLayout;