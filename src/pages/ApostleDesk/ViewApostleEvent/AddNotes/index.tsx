import React, {useReducer, useEffect } from 'react';
import Modal from 'utilComponents/Modal';
import { Link } from 'react-router-dom';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes, roleOptions } from 'constants/index';
import { extractErrorMessage, formatDate, isNotEmptyArray, processAlertSuccess, isObjectEmpty, processAlertError } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import CustomDatePicker from 'utilComponents/DatePicker';
import { history, validateData } from 'helpers';
import FormGroupTextarea from 'utilComponents/FormGroupTextarea';
import { EditCircle } from 'tabler-icons-react';
import TextEditor from 'utilComponents/TextEditor';

const AddNotes = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            text: '',
        },
        errors:{},
        adminData:[],
        isLoading: false,
        alertMessage:{},
        showModal: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal, adminData} = state;

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
            'text': 'required',
        };

        const messages = {
            'text.required': 'Message body required',
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
                text: '',
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
                    subtitle: 'n/a',
                    paragraphs: [formData?.text],
                    message: props?.messageId,

                };
                await ApiRequestClient.post(apiRoutes.CREATE_MESSAGE_NOTE, payload);  
                
                refreshForm();
                
                props.addAlert(processAlertSuccess('Note added successfully'));
                handleModalToggle();
                props?.refreshForm();
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

    const fetchData = async () => {
        setState({
            isLoading: true,
        });

        try {
            const response = await ApiRequestClient.get(apiRoutes.GET_ALL_ADMINS);
            for (let index = 0; index < response?.data?.data.length; index++) {
                const element = response?.data?.data[index];
                element.label = element?.full_name;
                element.value = element?.full_name;
            };
            setState({
                adminData: response?.data?.data,
                isLoading: false,
            });
        } catch (error) {
            setState({
                isLoading: false,
            });
        }

    };

    const handleEditorChange = (data:any) => {
        setState({
            formData:{
                ...formData,
                text: data,
            },
            errors:{
                ...state.errors,
                text: '',
            }
        });
    };

    useEffect(() => {
       // fetchData();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    return(
        <>
        <Modal
            title="Add note to message"
            //@ts-ignore
            size="lg"
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
                       
                        <TextEditor
                             //@ts-ignore
                            text={formData?.text}
                            handleChange={handleEditorChange}
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
        <button
            className={`border-0 pointer edit-button mx-3 pb-1 px-1`}  
            onClick={()=>{handleModalToggle()}}
        >   
            <EditCircle
                className="button-icon "
                size={20}
                strokeWidth={1.5}
                color={'#FFF'}
            />
        </button> 
       
        </>
    )

};
export default AddNotes;
