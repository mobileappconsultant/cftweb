import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes, roleOptions , apostleDeskCategoryOptions} from 'constants/index';
import { extractErrorMessage, formatDate, isNotEmptyArray, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import ReactTagInput from "@pathofdev/react-tag-input";
import { CirclePlus, TrashOff, Variable } from 'tabler-icons-react';
import "@pathofdev/react-tag-input/build/index.css";
import FormGroupTextarea from 'utilComponents/FormGroupTextarea';
import { useMutation } from '@apollo/client';
import { CREATE_MESSAGE } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import GetBiblePassage from 'components/GetBiblePassage';

const CreateApostleMessage = (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            title: '',
            message: '',
            minister: '',
            bibleReading:[],
            category:'',

        },
        payload:{},
        prayers:[''],
        errors:{},
        prayerErrors:{},
        bibleVerseData:[],
        isLoading: false,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const [createNewMessage, { data, loading, error }] = useMutation(CREATE_MESSAGE); 
    const {formData, isLoading, alertMessage, errors, preview, adminData, prayers, prayerErrors, bibleVerseData} = state;

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
    const handlePrayerChange = (e: React.ChangeEvent<HTMLInputElement> , index: number) :void  => {
        const {value} = e.target;
        prayers[index] = value;

        setState({
            prayers:[...prayers],
            prayerErrors:{
                ...state.prayerErrors,
                [index]: '',
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

    };

    const setTags = (newTags: String[]) => {
        setState({
            formData: {
                ...state.formData,
                bibleReading: newTags,
            },
            errors: {
                ...state.errors,
                bibleReading: '',
            },
        });
    };

    const handleEditorChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                message: data,
            },
            errors:{
                ...state.errors,
                message: '',
            }
        });
    };

    
    const validateFormData = async () => {
        const newFormData = {...formData};
        newFormData.bible_verse = newFormData.bibleReading[0];
        const rules = {
            'title': 'required',
            'category' : 'required',
            'minister': 'required',
            'message':'required',
            'bible_verse': 'required',
        };

        const messages = {
            'title.required': 'Enter a title',
            'category.required': 'Select a category',
            'minister.required': 'Select a minister',
            'message.required': 'Message required',
            'bible_verse.required': 'Bible reading required'
        };
        const validate = await validateData(newFormData, rules, messages);
        const getPrayerErrors:any = {};
        
        for (let index = 0; index < prayers.length; index++) {
            const element = prayers[index];
            if(!element){
                getPrayerErrors[index] = 'This field is required';
            }
        };
     
        if ((isObjectEmpty(validate) && (isObjectEmpty(getPrayerErrors)))) {
            return true;
        } else {
            setState({
                errors: validate,
                prayerErrors: getPrayerErrors,
            });
            return false;
        }
    };


    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        const validate = await validateFormData();
        if(validate){
            
            setState({
                preview: true,
                isLoading: false,
            });
            
        };
        
    };
    const submitPreview = async (e: React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        });
        try {
            const payload = {
                ...formData,
                bibleReading:bibleVerseData,
                prayer_point: prayers,
            };
            await createNewMessage({variables:{input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Message saved successfully'),
            });
            scrollTop();
            setTimeout(function () {
                history.push('/apostle-desk')
            }, 2000);
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

    const addPrayer = () => {
        setState({
            prayers:[...prayers, '']
        })
    };

    const removePrayer = (prayerIndex: number) => {
        prayers.splice(prayerIndex, 1);
        delete prayerErrors[prayerIndex];
        setState({
            prayers: [...prayers],
            prayerErrors:{...prayerErrors},
        })
    };

    const upDateBibleVerseText = (bibleVerseObj:any, index:number) => {
      
        bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: [...bibleVerseData],
        })
    }

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
            {!preview && (
                 <div className="row justify-content-between align-items-end">
                    <div className="col-md-6">
                        <PageTitle text='Create Message' />
                    </div>
                </div>
            )}
           
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
                <div className='bg-white shadow-sm p-3'>

                {!preview? (
                    <>
                        <div className="row  pt-4">
                            <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Title of message"
                                    value={formData?.title}
                                    onChange={handleChange}
                                    name="title"
                                    showError={errors.title}
                                    errorMessage={errors.title}
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <FormGroupSelect
                                    placeholder="Select category"
                                    onChange={(e: object)=>handleSelectChange(e, 'category')}
                                    name="category"
                                    showError={errors.category}
                                    errorMessage={errors.category} 
                                    selectOptions={apostleDeskCategoryOptions}
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <ReactTagInput 
                                    tags={formData?.bibleReading} 
                                    onChange={(newTags) => setTags(newTags)}
                                    placeholder='Type bible verse and press enter'
                                />
                                {errors.bible_verse && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.bible_verse}
                                    </div>
                                )}
                            </div>
                        

                            
                            <div className="col-md-6 mb-4">
                                <FormGroupSelect
                                    placeholder="Select minister"
                                    onChange={(e: object)=>handleSelectChange(e, 'minister')}
                                    name="minister"
                                    showError={errors.minister}
                                    errorMessage={errors.minister} 
                                    selectOptions={adminData}
                                />
                            </div>
                            <div className="col-md-12 mb-4">
                            
                                <TextEditor
                                    //@ts-ignore
                                    text={formData?.message}
                                    handleChange={handleEditorChange}
                                    placeholder="Type message content"
                                />
                                {errors.message && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.message}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-12 mb-3">
                        
                                <h6 className='mb-4'>Add prayers to message
                                <button
                                    className={`border-0 pointer edit-button mx-3 pb-1 px-1`}  
                                    onClick={()=>{addPrayer()}}
                                >   
                                    <CirclePlus
                                        className="button-icon "
                                        size={20}
                                        strokeWidth={1.5}
                                        color={'#FFF'}
                                    />
                                </button> 
                                
                                </h6>
                                {prayers.map((prayer:string, _i:number)=>{
                                    return(
                                        <div className='row'>
                                            <div className="col-md-12 mb-2">
                                                <h6 className='d-flex align-items-center'>Prayer point {_i + 1}
                                                {_i !== 0 && (
                                                    <button
                                                    className={`border-0 pointer edit-button mx-3 pb-1 px-1`}  
                                                    onClick={()=>{removePrayer(_i)}}
                                                        >   
                                                            <TrashOff
                                                                className="button-icon "
                                                                size={20}
                                                                strokeWidth={1.5}
                                                                color={'#FFF'}
                                                            />
                                                        </button> 
                                                )}
                                                
                                                </h6>
                                            </div>
                                            <div className="col-md-12 mb-4">
                                                <FormGroupTextarea
                                                    placeholder="Prayer point"
                                                    value={prayer}
                                                    onChange={(e:any)=>handlePrayerChange(e, _i)}
                                                    name="prayer"
                                                    showError={prayerErrors[_i]}
                                                    errorMessage={prayerErrors[_i]}
                                                />
                                            </div> 
                                        </div>
                                    )
                                })}

                            
                            </div>
                            <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                                <CreateButton
                                    text={'Proceed'}
                                    actionEvent={(e)=>{submit(e)}}
                                    disabled={isLoading}
                                    loading={isLoading}
                                />
                            </div>
                        </div>
                    </>
                ): (
                    <div className='row p-4'>
                        <div className="col-md-5 d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <PageTitle text='Apostle desk' />
                            </div>
                            <div className='username small text-muted'>
                                <li>{formData?.category}</li>
                            </div>
                            <>
                                <Badges
                                    text={'Pending'}
                                    type='pending'
                                />
                            </>
                            
                        </div>
                        <div className='col-md-9'>
                            <img src={missionIcon} />
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">{formData?.title}</h5>
                                <span className="small text-muted mt-4">By {formData?.minister}</span>
                            </div> 
                        </div>
                        

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Bible passages</h5>
                                    {formData?.bibleReading.map((item:string, index:number) => {
                                        return(
                                            <>
                                                <GetBiblePassage
                                                    biblePassage={item}
                                                    updatePassageText={upDateBibleVerseText}
                                                    index={index}
                                                />
                                            </>
                                        )
                                    })}
                               
                            </div> 
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Message</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"
                                dangerouslySetInnerHTML={{ __html: formData?.message || 'N/A' }}       
                            /> 
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Prayer points</h5>
                            </div>
                            {prayers.map((prayer:string, _i:number)=>{
                                return(
                                    <>
                                        <div className='mt-3 small'>
                                            <li>{prayer}</li>
                                        </div>
                                    </>
                                )
                            })}
                        </div>

                        <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                            <CreateButton
                                text={'Submit'}
                                actionEvent={(e)=>{submitPreview(e)}}
                                disabled={isLoading}
                                loading={isLoading}
                            />
                        </div>

                    </div>
                )}
                
                </div>
            </>
        
        
        </>
    )

};
export default CreateApostleMessage;
