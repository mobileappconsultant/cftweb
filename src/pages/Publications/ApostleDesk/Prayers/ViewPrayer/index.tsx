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
import { CirclePlus, Edit } from 'tabler-icons-react';
import CreateDailyPrayer from './Dailyprayers/CreateDailyPrayer';
import Tooltip from '@mui/material/Tooltip';
import EditDailyPrayer from './Dailyprayers/UpdateDailyPrayer';

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
        showCreateDailyPrayerPage:false,
        showUpdateDailyPrayerPage:false,
        showViewDailyPrayerPage:false,
        showViewAllDailyPrayerPage:true,
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
        activeDailyPrayer,
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
                activeDailyPrayer:  getPrayer?.dailyPrayers[0]? getPrayer?.dailyPrayers[0]: null,
               
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
            // activeDailyPrayer: null,
        })
    }

   
    
    return(
        <>
            {!preview && (
                <div className="row justify-content-between align-items-start pt-3 px-2">
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
                        <div className='row p-2 px-0'>
                        
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
                                   <h5 className="m-0 name mb-0 font-weight-bold">Prayer preface</h5>
                               </div>
                               <div 
                                   className="text-dark mt-0  small px-2"  
                                   dangerouslySetInnerHTML={{ __html: prayerData?.preface || 'N/A' }} 
                                /> 
                                   
                           </div>
                          
                       </div>
                       {showViewAllDailyPrayerPage && (
                           <>
                                {/* Daily prayers */}
                                <div className="user-name  w-100 mt-4 mb-3 d-flex align-items-center gap-30">
                                    <h5 className="m-0 name h6 ">Daily&nbsp;prayers</h5>
                                    <div className="col-md-12 p-0 d-flex justify-content-start">
                                        <Tooltip title="Add daily prayer" placement="right-start" arrow>
                                            <span 
                                                className={` pointer edit-button`}  
                                                onClick={()=>{
                                                    setState({
                                                        showCreateDailyPrayerPage: true,
                                                        showUpdateDailyPrayerPage:false,
                                                        showViewDailyPrayerPage:false,
                                                        showViewAllDailyPrayerPage:false,
                                                        
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
                                        </Tooltip>
                                    </div>
                                </div>
                            
                            <div className='col-md-12 daily-prayer-box-container'>
                            
                                {prayerData?.dailyPrayers.map((dailyPrayer:any, index:any) => {
                                    
                                    return(
                                        <>
                                            <div 
                                                className={`daily-prayer-box small pointer ${activeDailyPrayer?._id === dailyPrayer?._id? 'active' :''}`}
                                                onClick={() =>{
                                                        setState({
                                                            activeDailyPrayer:dailyPrayer,
                                                        })
                                                }}
                                            >
                                                <div>
                                                    {dailyPrayer?.day}
                                                </div>
                                            
                                            </div>
                                        </>
                                    )
                                })}
                                   
                            </div>
                            {activeDailyPrayer && (
                                <div className='col-md-12 mt-4'>
                                    <>
                                        <div className='py-3 d-flex align-items-center'>
                                            <h4 className='small font-weight-bold'>
                                                {activeDailyPrayer.heading}
                                            </h4>
                                                <Tooltip title="Edit this daily prayer" placement="right-start" arrow className='mx-3'>
                                                <span 
                                                    className={` pointer edit-button`}  
                                                    onClick={()=>{
                                                        setState({
                                                            showCreateDailyPrayerPage: false,
                                                            showUpdateDailyPrayerPage: true,
                                                            showViewDailyPrayerPage:false,
                                                            showViewAllDailyPrayerPage:false,
                                                            
                                                        })
                                                    }}
                                                >   
                                                    
                                                    <Edit
                                                        className="button-icon"
                                                        size={20}
                                                        strokeWidth={1.5}
                                                        color={'#FFF'}
                                                    />
                                                </span>
                                            </Tooltip>
                                        </div>

                                        <div className='py-3'>
                                            <h2 className='small font-weight-bold'>Content</h2>
                                            <p className='small' dangerouslySetInnerHTML={{ __html: activeDailyPrayer.content || 'N/A' }} />
                                             
                                        </div>
                                        <div className='py-3'>
                                            <h2 className='small font-weight-bold'>Prayers</h2>
                                            <div  className='small' dangerouslySetInnerHTML={{ __html: activeDailyPrayer.prayer_points || 'N/A' }}  />
                                            
                                        </div>
                                    </>
                                </div>
                            )}
                            
                       
                           </>
                       )}
                        {/* Create daily prayer */}
                       {showCreateDailyPrayerPage && (
                           <div className='px-2'>
                                <CreateDailyPrayer
                                    close={()=> closePages()}
                                    prayerId={props?.prayerId}
                                />
                           </div>
                       )}

                       {showUpdateDailyPrayerPage && (
                           <div className='px-2'>
                            <EditDailyPrayer
                                close={()=> closePages()}
                                prayerId={props?.prayerId}
                                dailyPrayer={activeDailyPrayer}
                            />
                            </div>
                       )}

                       
                    </>
                )}
                    
                </div>
            </>
        
        
        </>
    )

};
export default ViewApostlePrayer;
