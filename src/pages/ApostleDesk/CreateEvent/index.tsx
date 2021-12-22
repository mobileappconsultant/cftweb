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

const CreateApostleEvent = (props: any):JSX.Element => {
    const initialState = {
        formData: {
            topic: '',
            release_date: null,
            minister: '',
            bible_verse:'',
            description:'',
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

    const handleDateChange = (e:any):void => {
        if(e){
            const date = formatDate(e);
            setState({
                formData:{
                    ...formData,
                    release_date: date,
                },
                errors: {
                    ...state.errors,
                    release_date: '',
                },
            });
        }else{
            setState({
                formData:{
                    ...formData,
                    release_date: null,
                },
                errors: {
                    ...state.errors,
                    release_date: '',
                },
            });
        }
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
            'topic': 'required',
            'release_date' : 'required',
            'minister': 'required',
            'description':'required',
            'bible_verse': 'required',
        };

        const messages = {
            'topic.required': 'Enter a topic',
            'release_date.required': 'Date required',
            'minister.required': 'Select a minister',
            'description.required': 'Description required',
            'bible_verse.required': 'Bible verse required'
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
                topic: '',
                release_date: null,
                minister: '',
                bible_verse:'',
                description:'',
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
                    bible_verse: [formData.bible_verse],
                };
                await ApiRequestClient.post(apiRoutes.CREATE_MESSAGE, payload);  
                
                refreshForm();
                
                props.addAlert(processAlertSuccess('Event added successfully'));
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

    useEffect(() => {
        fetchData();
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
            title="Create Apostle's Message"
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
                            placeholder="Topic of message"
                            value={formData?.topic}
                            onChange={handleChange}
                            name="topic"
                            showError={errors.topic}
                            errorMessage={errors.topic}
                        />
                    </div>
                    <div className="col-md-12 mb-3">
                        <FormGroupInput
                            placeholder="Bible verse"
                            value={formData?.bible_verse}
                            onChange={handleChange}
                            name="bible_verse"
                            showError={errors.bible_verse}
                            errorMessage={errors.bible_verse}
                        />
                    </div>

                    <div className="col-md-12 mb-3">
                        <FormGroupTextarea
                            placeholder="Short description"
                            value={formData?.description}
                            onChange={handleChange}
                            name="description"
                            showError={errors.description}
                            errorMessage={errors.description}
                        />
                    </div>

                    <div className="col-md-12 mb-4">
                        <CustomDatePicker
                             value={formData?.release_date}
                             //@ts-ignore
                             onChange={(e:any)=>handleDateChange(e)}
                             showError={errors.release_date}
                             errorMessage={errors.release_date} 
                        />
                    </div>
                    
                    
                    <div className="col-md-12 mb-3">
                        <FormGroupSelect
                             placeholder="Select minister"
                             onChange={(e: object)=>handleSelectChange(e, 'minister')}
                             name="minister"
                             showError={errors.minister}
                             errorMessage={errors.minister} 
                             selectOptions={adminData}
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
            text={"Create Apostle's Message"}
            float
            actionEvent={()=>{handleModalToggle()}}
        />
        </>
    )

};
export default CreateApostleEvent;
