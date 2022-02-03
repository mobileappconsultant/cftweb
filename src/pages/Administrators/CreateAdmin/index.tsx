import React, {useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { Link } from 'react-router-dom';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes, roleOptions } from 'constants/index';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { useMutation } from '@apollo/client';
import { CREATE_ADMIN } from 'GraphQl/Mutations';

const CreateAdmin = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            email: '',
            password: '',
            full_name: '',
            phone:'',
            role: '',
        },
        errors:{},
        isLoading: false,
        alertMessage:{},
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal} = state;
    // Graphql
    const [createNewAdmin, { data, loading, error }] = useMutation(CREATE_ADMIN); 

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

    const handleSelectChange = (e:{label?: string, value?: string|null|number}, name = '') :void  => {
        if (e) {
            setState({
                formData: {
                    ...state.formData,
                    [name]: e.value,
                },
                errors: {
                    ...state.errors,
                    [name]: '',
                },
            });
        }

    }

    const handleModalToggle = () => {
        setState({showModal: !showModal});
        refreshForm();
    }

    const validateFormData = async () => {
        const rules = {
            'full_name': 'required',
            'email': 'required|email|validemail',
            'password' : 'required',
            'phone': 'required',
            'role': 'required',
        };

        const messages = {
            'email.email': 'Enter valid email address',
            'email.required': 'Enter email address',
            'email.validemail': 'Enter valid email address',
            'password.required': 'Password required',
            'full_name.required': 'Full name is required',
            'phone.required': 'Phone number is required',
            'role.required': 'Select a role',
        };
        const validate = await validateData(formData, rules, messages);
        if (isObjectEmpty(validate)) {
            return true;
        } else {
            setState({
                errors: validate,
            });
            return false;
        }
    };

    const refreshForm = () => {
        setState({
            formData: {
                email: '',
                password: '',
                full_name: '',
                phone:'',
                role: '',
            },
            errors:{},
        })
    };

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = await validateFormData();
            if(validate){
                const payload = {
                    ...formData,
                    role: formData?.role
                };
                await createNewAdmin({variables:{input: payload}})
               
                refreshForm();
                props.addAlert(processAlertSuccess('Admin added successfully'));
                handleModalToggle();
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
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    return(
        <>
        <Modal
            title="Create Admin"
            show={showModal} 
            toggle={handleModalToggle}
        >
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

                <div className="row">
                    <div className="col-md-12 mb-3">
                        <FormGroupInput
                            placeholder="Full name"
                            value={formData?.full_name}
                            onChange={handleChange}
                            name="full_name"
                            showError={errors.full_name}
                            errorMessage={errors.full_name}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <FormGroupInput
                            placeholder="Email"
                            value={formData?.email}
                            onChange={handleChange}
                            name="email"
                            showError={errors.email}
                            errorMessage={errors.email}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <FormGroupInput
                            placeholder="Phone number"
                            value={formData?.phone}
                            onChange={handleChange}
                            name="phone"
                            showError={errors.phone}
                            errorMessage={errors.phone}
                            type='number'
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <FormGroupInput
                            placeholder="Password"
                            value={formData?.password}
                            onChange={handleChange}
                            name="password"
                            showError={errors.password}
                            errorMessage={errors.password}
                            type='password'
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <FormGroupSelect
                                placeholder="Select role"
                                // value={formData?.role}
                                onChange={(e: object)=>handleSelectChange(e, 'role')}
                                name="role"
                                showError={errors.role}
                                errorMessage={errors.role} 
                                selectOptions={roleOptions}
                                // label={'Select Role'}                        
                        />
                    </div>
                    <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                    <CreateButton
                        text={'Submit'}
                        actionEvent={(e)=>{submit(e)}}
                        disabled={isLoading}
                        loading={isLoading}
                    />
                    </div>
                </div>
            </>
        </Modal>
        <CreateButton
            text={'Create Admin'}
            float
            actionEvent={()=>{handleModalToggle()}}
        />
        </>
    )

};
export default CreateAdmin;