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
import "@pathofdev/react-tag-input/build/index.css";
import { useMutation, useQuery } from '@apollo/client';
import { EDIT_MESSAGE } from 'GraphQl/Mutations';
import Badges from 'utilComponents/Badges';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import GetBiblePassage from 'components/GetBiblePassage';
import {GET_SINGLE_PRAYER } from 'GraphQl/Queries';
import { DivLoader } from 'utilComponents/Loader';
import CloseButton from 'components/CloseButton';
import { CirclePlus } from 'tabler-icons-react';
import CreateDailyPrayer from './Dailyprayers/CreateDailyPrayer';

const ViewApostlePrayer = (props: any):JSX.Element => {
  
    const initialState = {
        prayerData: {
            _id: '',
            title: '',
            subtitle: '',
            content: '',
            author: '',
            dailyPrayers: [],
            dayPublished: null,
            monthPublished: null,
            yearPublished: null,
            createdAt: null,
        },
        showCreateDailyPrayerPage:true,
        showUpdateDailyPrayerPage:false,
        showViewDailyPrayerPage:false,
        showViewAllDailyPrayerPage:false,
        activeDailyPrayer: null,
        payload:{},
        errors:{},
        bibleVerseData:[],
        isLoading: true,
        alertMessage:{},
        preview: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    
    const { 
        prayerData, 
        isLoading, 
        alertMessage, 
        errors, 
        preview,  
        bibleVerseData,
        showCreateDailyPrayerPage,
        showUpdateDailyPrayerPage,
        showViewDailyPrayerPage,
        showViewAllDailyPrayerPage,
    } = state;
    const { data, loading, error } = useQuery(GET_SINGLE_PRAYER, {
        variables: { prayerId: props?.prayerId}
    }); 
    
    const validateFormData = async () => {
        const newFormData = {... prayerData};
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
    
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };


    useEffect(() => {
        
        if(data){
            const{getPrayer} = data;
            setState({
                prayerData: getPrayer,
            });
            
        };
        if(error){
            
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
                isLoading: false,
            });
        }
        if(!loading){
            setState({
                isLoading: false,
            });
        }

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [data]);

    const closePages = () => {
        setState({
            showCreateDailyPrayerPage: false,
            showUpdateDailyPrayerPage:false,
            showViewDailyPrayerPage:false,
            showViewAllDailyPrayerPage:true,
            activeDailyPrayer: null,
        })
    }

   

    return(
        <>
            {!preview && (
                <div className="row justify-content-between align-items-start pt-3">
                <div className="col-md-6">
                    <PageTitle text='View Prayer' />
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
                <div className='pt-2'>
                {isLoading? (
                    <>
                        <DivLoader />
                    </>
                ):(
                    <>
                        <div className='row p-2'>
                        
                           <div className='col-md-12'>
                               <div className="user-name px-2 mt-4">
                                   <h5 className="m-0 name h6">{prayerData?.title}</h5>
                                   <span className="small text-muted mt-4">By {prayerData?.author}</span>
                               </div> 
                           </div>
                           
                           <div className='col-md-12'>
                               <div className="user-name px-2 mt-4">
                                   <h5 className="m-0 name h6">Prayer subtitle</h5>
                               </div>
                               <div 
                                   className="text-dark mt-1 small px-2"
                                     
                                > 
                                    {prayerData?.subtitle}
                                </div>
                           </div>
                          

                           <div className='col-md-12'>
                               <div className="user-name px-2 mt-4">
                                   <h5 className="m-0 name h6">Prayer points</h5>
                               </div>
                               <div 
                                   className="text-dark mt-1 small px-2"
                                   dangerouslySetInnerHTML={{ __html: prayerData?.content || 'N/A' }}       
                               /> 
                           </div>


                       </div>
                       {showViewAllDailyPrayerPage && (
                           <>
                                {/* Daily prayers */}
                                <div className="user-name  w-100 mt-4 mb-3 d-flex align-items-center gap-30">
                                    <h5 className="m-0 name h6 ">Daily&nbsp;prayers</h5>
                                    <div className="col-md-12 p-0 d-flex justify-content-start">
                                
                                        <span 
                                            className={` pointer edit-button`}  
                                            onClick={()=>{
                                                setState({
                                                    showCreateDailyPrayerPage: true,
                                                    showUpdateDailyPrayerPage:false,
                                                    showViewDailyPrayerPage:false,
                                                    showViewAllDailyPrayerPage:false,
                                                    activeDailyPrayer: null,
                                                })
                                            }}
                                        >   
                                            
                                            <CirclePlus
                                                className="button-icon"
                                                size={20}
                                                strokeWidth={1.5}
                                                color={'#FFF'}
                                            />
                                        </span>
                                    </div>
                                </div>

                            <div className='col-md-12 daily-prayer-box-container'>
                                    <div className='daily-prayer-box small pointer'>
                                        <div>
                                            1
                                        </div>
                                    
                                    </div>
                                    <div className='daily-prayer-box small active pointer'>
                                        <div>
                                            2
                                        </div>
                                    </div>
                            </div>
                       
                           </>
                       )}
                        {/* Create daily prayer */}
                       {showCreateDailyPrayerPage && (
                           <>
                                <CreateDailyPrayer
                                    close={()=> closePages()}
                                    prayerId={props?.prayerId}
                                />
                           </>
                       )}

                       
                    </>
                )}
                    
                </div>
            </>
        
        
        </>
    )

};
export default ViewApostlePrayer;
