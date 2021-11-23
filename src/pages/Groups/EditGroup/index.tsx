import React, {useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { Link } from 'react-router-dom';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';


const EditGroup = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            name:  props?.group?.name || '',
            group_head:props?.group?.group_head || '',
        },
        errors:{},
        isLoading: false,
        alertMessage:{},
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal} = state;
    const {show, toggleModal} = props;

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


    const handleModalToggle = () => {
        setState({showModal: !showModal});
        refreshForm();
    }

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

    const refreshForm = () => {
        setState({
            formData: {
                name: '',
                group_head:'',
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
                await ApiRequestClient.post(apiRoutes.CREATE_GROUP, formData);  
                refreshForm();
                props.addAlert(processAlertSuccess('Group updated successfully'));
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
            title="Update Group"
            show={show} 
            toggle={toggleModal}
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
                            placeholder="Group name"
                            value={formData?.name}
                            onChange={handleChange}
                            name="name"
                            showError={errors.name}
                            errorMessage={errors.name}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <FormGroupInput
                            placeholder="Group head"
                            value={formData?.group_head}
                            onChange={handleChange}
                            name="group_head"
                            showError={errors.group_head}
                            errorMessage={errors.group_head}
                        />
                    </div>
                    
                    
                    <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                    <CreateButton
                        text={'Update'}
                        actionEvent={(e)=>{submit(e)}}
                        disabled={isLoading}
                        loading={isLoading}
                    />
                    </div>
                </div>
            </>
        </Modal>
        
        </>
    )

};
export default EditGroup;