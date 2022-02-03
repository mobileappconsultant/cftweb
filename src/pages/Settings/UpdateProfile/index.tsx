import React, {useEffect, useReducer} from 'react';
import AlertComponent from 'components/AlertComponent';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import { useSelector, useDispatch } from "react-redux";
import { Dispatch } from "redux";
import { useMutation } from '@apollo/client';
import { UPDATE_PROFILE } from 'GraphQl/Mutations';
import { addUser } from "store/actionCreators";
const UpdateProfile = ():JSX.Element => {
    const initialState = {
        formData: {
            email: '',
            full_name: '',
            phone:'',
            role: '',
        },
        errors:{},
        alertMessage:{},
        isLoading: false,
    };
    // State
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, page, isLoading, alertMessage, errors} = state;
    // Redux
    const dispatch: Dispatch = useDispatch();
    const reduxState = useSelector( (state:any) => state);
    const{userObject} = reduxState?.reducer;
    // GraphQL
    const [updateProfile, { data, loading, error }] = useMutation(UPDATE_PROFILE);

    
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
            'full_name': 'required',
            'phone': 'required',
        };

        const messages = {  
            'full_name.required': 'Full name is required',
            'phone.required': 'Phone number is required',
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
              
                const response = await updateProfile({variables:{input: {full_name: formData?.full_name, phone: formData?.phone}}});
                dispatch(addUser(response?.data?.updateadmin));
            };
            setState({
                isLoading: false,
                alertMessage: processAlertSuccess('Profile updated successfully'),
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

    useEffect(() => {
    
       setState({
           formData:{
                email: userObject?.email,
                full_name: userObject?.full_name,
                phone:userObject?.phone,
                role: userObject?.role[0],
           }
       })
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

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
                        value={formData?.full_name}
                        onChange={handleChange}
                        name="full_name"
                        showError={errors.full_name}
                        errorMessage={errors.full_name}
                    />
                </div>
                <div className="col-md-6 mb-3">
                    <FormGroupInput
                        placeholder="Email"
                        disabled={true}
                        value={formData?.email}
                        onChange={handleChange}
                        name="name"
                        showError={errors.email}
                        errorMessage={errors.email}
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