import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {  apostleDeskCategoryOptions} from 'constants/index';
import { extractErrorMessage, processAlertSuccess, isObjectEmpty, processAlertError, scrollTop, capiitalizeFirstLetter } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import FormGroupSelect from 'utilComponents/FormGroupSelect';
import { history, validateData } from 'helpers';
import PageTitle from 'components/PageTitle';
import TextEditor from 'utilComponents/TextEditor';
import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_MESSAGE } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import GetBiblePassage from 'components/GetBiblePassage';
import { GET_ALL_ADMINS, GET_SINGLE_MESSAGE, GET_SINGLE_PRAYER } from 'GraphQl/Queries';
import { DivLoader } from 'utilComponents/Loader';

const ViewApostlePrayer = (props: any):JSX.Element => {
  
    const initialState = {
        formData: {
            title: '',
            message: '',
            minister: '',
            bibleReading:[],
            category:'',
            prayer_point:'',

        },
        payload:{},
        errors:{},
        bibleVerseData:[],
        isLoading: true,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const [createNewMessage, loadingParams] = useMutation(EDIT_MESSAGE); 
    const {formData, isLoading, alertMessage, errors, preview, adminData, bibleVerseData} = state;
    const { data, loading, error } = useQuery(GET_SINGLE_PRAYER, {
        variables: { prayerId: props?.match?.params?.id}
    }); 
    const adminDataQuery = useQuery(GET_ALL_ADMINS);
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

    const handlePrayerPointChange = (data: any) => {
        setState({
            formData:{
                ...formData,
                prayer_point: data,
            },
            errors:{
                ...state.errors,
                prayer_point: '',
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
            'prayer_point': 'required',
        };

        const messages = {
            'title.required': 'Enter a title',
            'category.required': 'Select a category',
            'minister.required': 'Select a minister',
            'message.required': 'Message required',
            'bible_verse.required': 'Bible reading required',
            'prayer_point.required': 'Prayer points required',
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
                bibleReading:bibleVerseData,
            };
            await createNewMessage({variables:{messageId: props?.match?.params?.id, input: payload}});
            setState({
                alertMessage:  processAlertSuccess('Message updated successfully'),
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

    const upDateBibleVerseText = (bibleVerseObj:any, index:number) => {
      
        bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: [...bibleVerseData],
        })
    };


    useEffect(() => {
        if(data){
            const response = data?.getMessage;
            const getBibleReading = () => {
                const returnArr = [];
                for (let index = 0; index < response?.bibleReading.length; index++) {
                    const element = response?.bibleReading[index];
                    returnArr.push(element?.refrence);
                };
                return returnArr;
            };
            setState({
                formData:{
                    title: response?.title,
                    message: response?.message,
                    minister: response?.minister,
                    bibleReading: getBibleReading(),
                    category: response?.category,
                    prayer_point: response?.prayer_point,
                },
                prayers: response?.prayer_point,
            });
            
          
        };
        if(!loading){
            setState({
                isLoading: false,
            });
        };

        if(error){
            
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
            })
        }

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [data]);

    useEffect(() => {
        
        if(adminDataQuery.data){
            const adminList:any = JSON.parse(JSON.stringify(adminDataQuery.data.getAllAdmin)) ;
            for (let index = 0; index < adminList.length; index++) {
                const element = adminList[index];
                element.label = element?.full_name;
                element.value = element?.full_name;
            };
            setState({
                adminData: adminList,
            
            });
        
        };
        // if(!adminDataQuery.loading){
        //     setState({
        //         isLoading: false,
        //     });
        // };

        if(adminDataQuery.error){
            
            setState({
                alertMessage :processAlertError(extractErrorMessage(adminDataQuery.error)),
            })
        }

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [adminDataQuery.data]);


    return(
        <>
            {!preview && (
                 <div className="row justify-content-between align-items-end">
                    <div className="col-md-6">
                        <PageTitle text='View prayer' />
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
                {isLoading? (
                    <>
                        <DivLoader />
                    </>
                ):(
                    <>
                       
                    </>
                )}
                    
                </div>
            </>
        
        
        </>
    )

};
export default ViewApostlePrayer;
