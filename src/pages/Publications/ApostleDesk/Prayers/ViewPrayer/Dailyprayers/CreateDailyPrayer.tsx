import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { extractErrorMessage, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { useMutation } from '@apollo/client';
import { CREATE_DAILY_PRAYER } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import GetBiblePassage from 'components/GetBiblePassage';
import CloseButton from 'components/CloseButton';

const CreateDailyPrayer = (props: any):JSX.Element => {
    
    const initialState = {
        formData: {
            heading:'',
            subtitle: '',
            day:'',
            content: '',
            scripture:[],
            supportingVerse:'',
            prayer_points:'',

        },
        payload:{},
        errors:{},
        bibleVerseData:[],
        isLoading: false,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const [createDailyPrayer, { data, loading, error }] = useMutation(CREATE_DAILY_PRAYER); 
    const {formData, isLoading, alertMessage, errors, preview,  bibleVerseData} = state;

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
   
    const setTags = (newTags: String[]) => {
        setState({
            formData: {
                ...state.formData,
                scripture: newTags,
            },
            errors: {
                ...state.errors,
                scripture: '',
            },
        });
    };

    const handleEditorChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                content: data,
            },
            errors:{
                ...state.errors,
                content: '',
            }
        });
    };

    const handlePrayerPointChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                prayer_points: data,
            },
            errors:{
                ...state.errors,
                prayer_points: '',
            }
        });
    };


    
    const validateFormData = async () => {
        const newFormData = {...formData};
        newFormData.scripture = newFormData.scripture[0];
        const rules = {
            'heading': 'required',
            'subtitle' : 'required',
            'day': 'required',
            'supportingVerse': 'required',
            'content':'required',
            'scripture': 'required',
            'prayer_points': 'required',
        };

        const messages = {
            'heading.required': 'Enter a header',
            'subtitle.required': 'Enter a subtitle',
            'day.required': 'Choose a day',
            'content.required': 'Content required',
            'supportingVerse.required':'Supporting verse required',
            'scripture.required': 'Scripture(s) required',
            'prayer_points.required': 'Prayer points required',
        };
        const validate = await validateData(newFormData, rules, messages);
      
     
        if (isObjectEmpty(validate)) {
            return true;
        } else {
            setState({
                errors: validate,
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
                day: parseInt(formData?.day),
                scripture:  bibleVerseData,
                prayerMannerId: props?.prayerId,

            };
            await createDailyPrayer({variables:{input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Prayer saved successfully'),
            });
            scrollTop();
            
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

    const upDateBibleVerseText = (bibleVerseObj:any, index:number) => {
      if(bibleVerseObj){
        bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: [...bibleVerseData],
        })
      }
       
    }

    useEffect(() => {
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
                 <div className="row justify-content-between align-items-start pt-3 broder-top">
                    <div className="col-md-6">
                        <PageTitle text='Attach Daily Prayer' />
                    </div>
                    <div className="col-md-6 d-flex justify-content-end">
                        <CloseButton 
                            close={props.close}
                        />
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
                <div className=''>

                {!preview? (
                    <>
                        <div className="row  pt-2">
                        <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Heading"
                                    value={formData?.heading}
                                    onChange={handleChange}
                                    name="heading"
                                    showError={errors.heading}
                                    errorMessage={errors.heading}
                                />
                            </div>
                            <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Subtitle"
                                    value={formData?.subtitle}
                                    onChange={handleChange}
                                    name="subtitle"
                                    showError={errors.subtitle}
                                    errorMessage={errors.subtitle}
                                />
                            </div>
                            
                            <div className="col-md-12 mb-4">
                                <ReactTagInput 
                                    tags={formData?.scripture} 
                                    onChange={(newTags) => setTags(newTags)}
                                    placeholder='Type bible verse and press enter'
                                />
                                {errors.scripture && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.scripture}
                                    </div>
                                )}
                            </div>

                            <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Choose a day"
                                    value={formData?.day}
                                    onChange={handleChange}
                                    name="day"
                                    showError={errors.day}
                                    errorMessage={errors.day}
                                />
                            </div>
                            
                            <div className="col-md-6 mb-4">
                                <FormGroupInput
                                    placeholder="Supporting verse"
                                    value={formData?.supportingVerse}
                                    onChange={handleChange}
                                    name="supportingVerse"
                                    showError={errors.supportingVerse}
                                    errorMessage={errors.supportingVerse}
                                />
                            </div>
                            

                            <div className="col-md-12 mb-4">
                            <h6 className='mb-2'>Type content</h6>
                                <TextEditor
                                    //@ts-ignore
                                    text={formData?.content}
                                    handleChange={handleEditorChange}
                                    placeholder="Type  content"
                                />
                                {errors.content && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.content}
                                    </div>
                                )}
                            </div>
                            <div className="col-md-12 mb-1">
                        
                                <h6 className='mb-2'>Add prayer points</h6>
                                <div className="col-md-12 mb-2">
                                <TextEditor
                                    //@ts-ignore
                                    text={formData?.prayer_points}
                                    handleChange={handlePrayerPointChange}
                                    placeholder="Type prayer points"
                                />
                                {errors.prayer_points && (
                                    <div className="small w-100 text-left text-danger">
                                        {errors.prayer_points}
                                    </div>
                                )}
                                </div>
                                
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
                    <div className='row p-4 border-top'>
                        <div className="col-md-5 d-flex justify-content-between align-items-center mb-1">
                            <div>
                                <PageTitle text={`Review daily prayer (Day ${formData.day})`} />
                            </div>
                            
                            <>
                                <Badges
                                    text={'Pending'}
                                    type='pending'
                                />
                            </>
                            
                        </div>
                        

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">{formData?.header}</h5>
                                <span className="small text-muted mt-4">Subtitle: {formData?.subtitle}</span>
                            </div> 
                        </div>
                        

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Scriptues</h5>
                                    {formData?.scripture.map((item:string, index:number) => {
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
                                <h5 className="m-0 name">Content/Message</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"
                                dangerouslySetInnerHTML={{ __html: formData?.content || 'N/A' }}       
                            /> 
                        </div>

                        <div className='col-md-12'>
                            <div className="user-name px-2 mt-4">
                                <h5 className="m-0 name">Prayer points</h5>
                            </div>
                            <div 
                                className="text-dark mt-1 small px-2"
                                dangerouslySetInnerHTML={{ __html: formData?.prayer_points || 'N/A' }}       
                            /> 
                            
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
export default CreateDailyPrayer;
