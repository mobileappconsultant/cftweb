import React, {useReducer} from 'react';
import AlertComponent from 'components/AlertComponent';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
const UpdateProfile = ():JSX.Element => {
    const initialState = {
        formData: {
            name: '',
            group_head:'',
        },
        errors:{},
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:{},
        isLoading: false,
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, page, isLoading, alertMessage, errors} = state;
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) :void  => {
        const {name, value} = e.target;
        setState({
            formData:{
                ...formData,
                [name]: value,
            },
            errors:{
                ...state.errors,
                [name]: '',
            }
        });
    };

    const validateFormData = async () => {
        const rules = {
            'name': 'required',
            'group_head' : 'required',   
        };

        const messages = {
            'name.required': 'Group name is required',
            'group_head.required': 'Group head is required',
        };
        const validate = await validateData(formData, rules, messages);
        if (isObjectEmpty(validate)) {
            return true;
        } else {
            setState({
                ...state,
                errors: validate,
            });
            return false;
        }

    };

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = await validateFormData();
           
            if(validate){
                await ApiRequestClient.post(apiRoutes.CREATE_GROUP, formData);  
            };
            setState({
                isLoading: false,
            }); 
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            setState({
                alertMessage:  processAlertError(errorMsg),
                isLoading: false,
            });
        }
        
    };
    const handleAlertClose = ():void => {
        setState({
            alertMessage:{},
        });
    };

    return(
        <>
         
        {alertMessage?.text && (
            <>
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </>
        )}
        <div className="bg-white">
            <div className="user-account mt-4 pt-2 text-center mx-auto">
                <div className="avatar mx-auto">
                    <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" />
                    <span className="avatar-badge"><div className="avatar-badge-container"><img alt="Remy Sharp" src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" className="MuiAvatar-img css-1hy9t21" /></div></span>
                </div>

                
            </div>
            <div className="row mt-5">
                <div className="col-md-6 mb-3">
                    <FormGroupInput
                        placeholder="Full name"
                        value={formData?.name}
                        onChange={handleChange}
                        name="name"
                        showError={errors.name}
                        errorMessage={errors.name}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <FormGroupInput
                        placeholder="Email"
                        disabled={true}
                        value={formData?.name}
                        onChange={handleChange}
                        name="name"
                        showError={errors.name}
                        errorMessage={errors.name}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <FormGroupInput
                        placeholder="Phone number"
                        value={formData?.phone}
                        onChange={handleChange}
                        name="phone"
                        showError={errors.phone}
                        errorMessage={errors.phone}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <FormGroupInput
                        placeholder="Role"
                        disabled={true}
                        value={formData?.role}
                        onChange={handleChange}
                        name="role"
                        showError={errors.role}
                        errorMessage={errors.role}
                    />
                </div>
                <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                
                    <CreateButton
                        text={'Update profile'}
                        actionEvent={(e)=>{submit(e)}}
                        disabled={isLoading}
                        loading={isLoading}
                    />
                    </div>
            </div>
        </div>
        </>
    )

};
export default UpdateProfile;