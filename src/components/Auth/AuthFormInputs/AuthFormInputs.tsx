import React, {useReducer} from 'react';
import './authforminput.scss';
interface propInterface {
    icon?: any,
    placeholder?: string,
    value?: string | number,
    onChange?: any,
    type?: string,
    name?: string,
    showError?: string | boolean,
    errorMessage?: string,
}
const AuthFormInput = (props: propInterface): JSX.Element => {
    const {icon, placeholder, showError, errorMessage, ...rest} = props;
    return(
        <div className="p-0 m-0 auth-form-group">
            <div className="right-inner-addon input-container mb-2 ">
                <img alt="icon" src={icon} />
                <input 
                    type="text"
                    className={`form-control ${showError? 'border border-danger text-danger' : ''}`} 
                    placeholder={placeholder}
                    {...rest}
                    />
                
            </div>
            {showError && (
                <div className="small w-100 text-left text-danger">
                    {errorMessage}
                </div>
            )}
            
        </div>
    )
};

export default AuthFormInput;