import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect } from 'react';
import AlertComponent from 'components/AlertComponent';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import FormGroupInput from 'utilComponents/FormGroupInput';
import CreateButton from 'utilComponents/CreateButton';
import { extractErrorMessage, formatDate, formatDate2, isNotEmptyArray, isObjectEmpty, processAlertError } from 'utils';
import TagInput from 'utilComponents/TagInput';
import CustomDatePicker from 'utilComponents/DatePicker';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { history, validateData } from 'helpers';


const CreateEvent = ():JSX.Element => {
    const initialState = {
        alertMessage:{},
        formData:{
            church: '',
            branch:'',
            date: null,
            ministers:[],
            title:'',
        },
        branchData:[],
        adminData:[],
        errors:{},
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {errors, alertMessage, formData, branchData, adminData} = state;

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

    const handleTextChange = (value: string) :void  => {
       console.log(value);
    };
    
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    const fetchData = async () => {
        setState({
            isLoading: true,
        });

        try {
            const response = await Promise.all([
                ApiRequestClient.get(apiRoutes.GET_ALL_ADMINS),
                ApiRequestClient.get(apiRoutes.GET_ALL_BRANCHES),
            ]);
            for (let index = 0; index < response[0]?.data?.data.length; index++) {
                const element = response[0]?.data?.data[index];
                element.text = element?.full_name;
                element.id = element?._id;
            };

            for (let i = 0; i < response[1]?.data?.data.length; i++) {
                const el = response[1]?.data?.data[i];
                el.label = el?.name;
                el.value = el?.name;
            };
    
            setState({
                branchData: response[1]?.data?.data,
                adminData: response[0]?.data?.data,
                isLoading: false,
            });
        } catch (error) {
            setState({
                isLoading: false,
            });
        }

    };

    const handleDateChange = (e:any):void => {
        if(e){
            const date = formatDate(e);
            console.log(new Date(date));
            setState({
                formData:{
                    ...formData,
                    date: date,
                },
                errors: {
                    ...state.errors,
                    date: '',
                },
            });
        }else{
            setState({
                formData:{
                    ...formData,
                    date: null,
                },
                errors: {
                    ...state.errors,
                    date: '',
                },
            });
        }
    };

    const handleSelectChange = (e:{label?: string, value?: string|null|number}, name = '') :void  => {
        if (e) {
            setState({
                formData: {
                    ...state.formData,
                    [name]: e.label,
                },
                errors: {
                    ...state.errors,
                    [name]: '',
                },
            });
        }

    };

    const formatTagArray = (tagArr:any) => {
        let newArr = [];
        for (let index = 0; index < tagArr.length; index++) {
            const element = tagArr[index];
            newArr.push(element?.text);
        }

        return newArr;
    };

    const handleTagSelect = (tagArr: any): void => {
       
        setState({
            formData:{
                ...formData,
                ministers: formatTagArray(tagArr),
            },
            errors:{
                ...state.errors,
                ministers: '',
            }
        });
    };

    const handleSubmit = async(e: React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = await validateFormData();
            if(validate){
                const payload = {
                    ...formData,
                    date: formatDate2(formData?.date),
                };
                await ApiRequestClient.post(apiRoutes.CREATE_CALENDAR_EVENT, payload);  
                // history.push('/apostle-desk');
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


    const validateFormData = async () => {
        const validatInputs = {
            ...state.formData,
            ministers: !isNotEmptyArray(state.formData?.ministers[0]) ? state.formData?.ministers[0] : '',
        };
        const rules = {
            'title': 'required',
            'date': 'required',
            'ministers' : 'required',
            'branch': 'required',
            'church': 'required',  
        };
        const messages = {
            'title.required': 'Enter event title',
            'date.required': 'Date required',
            'ministers.required': "Select or type a ministers' name",
            'branch.required': 'Select a branch',
            'church.required': 'Enter church',
        };
        const validate = await validateData(validatInputs, rules, messages);
        if (isObjectEmpty(validate)) {
            return true;
        } else {
            setState({
                errors: validate,
            });
            return false;
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
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text="Create Calendar Event" />
        </div>
        
        </div>
        {alertMessage?.text && (
            <>
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </>
        )}
        <div className="bg-white shadow ">
            <div className="pt-1"/>
            <div className="mx-3 my-2 ">
                <div className="row  py-4 px-4 justify-content-center">
                    <div className="col-md-6 mb-3">
                        <FormGroupInput
                            placeholder="Title of event"
                            value={formData?.title}
                            onChange={handleChange}
                            name="title"
                            showError={errors.title}
                            errorMessage={errors.title}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <CustomDatePicker
                             value={formData?.date}
                             //@ts-ignore
                             onChange={(e:any)=>handleDateChange(e)}
                             showError={errors.date}
                             errorMessage={errors.date} 
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        <FormGroupInput
                            placeholder="Church"
                            value={formData?.church}
                            onChange={handleChange}
                            name="church"
                            showError={errors.church}
                            errorMessage={errors.church}
                        />
                    </div>

                    <div className="col-md-6 mb-3">
                        
                        <FormGroupSelect
                             placeholder="Select branch"
                             onChange={(e: object)=>handleSelectChange(e, 'branch')}
                             name="role"
                             showError={errors.branch}
                             errorMessage={errors.branch} 
                             selectOptions={branchData}
                        />
                    </div>
                    <div className="col-md-6 mb-3 mt-2">
                        
                        <FormGroupSelect
                             placeholder="Select event type"
                             onChange={(e: object)=>handleSelectChange(e, 'branch')}
                             name="role"
                             showError={errors.branch}
                             errorMessage={errors.branch} 
                             selectOptions={branchData}
                        />
                    </div>


                    <div className="col-md-6 mb-3">
                        <TagInput 
                            suggestions={adminData}
                            selectTagValues={handleTagSelect}
                            showError={errors.ministers}
                            errorMessage={errors.ministers} 
                        />
                    </div>
                   
                    {/* <div className="col-md-12">
                        <TextEditor
                            //@ts-ignore
                            handleTextChange={handleTextChange}
                            text={formData.body}
                        />
                    </div> */}

                </div>
            </div>
            <div className="pb-2"/>
            <CreateButton
                text={'Post now'}
                float
                actionEvent={(e)=>{handleSubmit(e)}}
            />
        </div>
         
       
        </>
    )

};
export default CreateEvent;