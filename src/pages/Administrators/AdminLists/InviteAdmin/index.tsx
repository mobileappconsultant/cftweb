import React, {useEffect, useReducer} from 'react';
import Modal from 'utilComponents/Modal';

import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { useMutation, useQuery } from '@apollo/client';
import { INVITE_ADMIN } from 'GraphQl/Mutations';
import { GET_ALL_ROLES } from 'GraphQl/Queries';

const InviteAdmin = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            email: '',
            role: '',
        },
        roleOptions:[],
        errors:{},
        isLoading: false,
        alertMessage:{},
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal, roleOptions} = state;
    // Graphql
    const [inviteNewAdmin, { data, loading, error }] = useMutation(INVITE_ADMIN); 
    const getAllRoles = useQuery(GET_ALL_ROLES);

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
            'email': 'required|email|validemail',
            'role': 'required',
        };

        const messages = {
            'email.email': 'Enter valid email address',
            'email.required': 'Enter email address',
            'email.validemail': 'Enter valid email address',
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
                await inviteNewAdmin({variables:{input: payload}})
               
                refreshForm();
                props.addAlert(processAlertSuccess('Admin invited successfully'));
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

    useEffect(() => {
        
        if(getAllRoles.data){
            const roleList:any = JSON.parse(JSON.stringify(getAllRoles.data.getRoles));
            for (let index = 0; index < roleList.length; index++) {
                const element = roleList[index];
                element.label = element?.name;
                element.value = element?.name;
            };
            setState({
                roleOptions: roleList,
            });
           
        };
        if(!getAllRoles.loading){
            setState({
                isLoading: false,
            });
        };

        if(getAllRoles.error){
            
            setState({
                alertMessage :processAlertError(extractErrorMessage(getAllRoles.error)),
            });
        }

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [getAllRoles.data]);

    return(
        <>
        <Modal
            title="Invite Admin"
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
                            placeholder="Email"
                            value={formData?.email}
                            onChange={handleChange}
                            name="email"
                            showError={errors.email}
                            errorMessage={errors.email}
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
            text={'Invite Admin'}
            float
            actionEvent={()=>{handleModalToggle()}}
        />
        </>
    )

};
export default InviteAdmin;