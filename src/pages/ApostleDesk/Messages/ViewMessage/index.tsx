import React, {useReducer, useEffect } from 'react';
import { extractErrorMessage, processAlertError, scrollTop, capiitalizeFirstLetter } from 'utils';
import AlertComponent from 'components/AlertComponent';
import PageTitle from 'components/PageTitle';
import { useMutation, useQuery } from '@apollo/client';
import Badges from 'utilComponents/Badges';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import GetBiblePassage from 'components/GetBiblePassage';
import { GET_SINGLE_MESSAGE } from 'GraphQl/Queries';
import { DivLoader } from 'utilComponents/Loader';
import UploadMessageImage from './UploadMessageImage';
import { EditCircle } from 'tabler-icons-react';

const ViewApostleMessage = (props: any):JSX.Element => {
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
        bibleVerseData:[],
        isLoading: false,
        alertMessage:{},
        preview: false,
        showImageModal:false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage,  preview, showImageModal, bibleVerseData} = state;
    const { data, loading, error } = useQuery(GET_SINGLE_MESSAGE, {
        variables: { messageId: props?.match?.params?.id}
    }); 
    
    const upDateBibleVerseText = (bibleVerseObj:any, index:number) => {
      
        bibleVerseData[index] = bibleVerseObj;
        setState({
            bibleVerseData: [...bibleVerseData],
        })
    };

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
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
                    image: response?.image,
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

    const toggleUploadImageModal = () => {
        setState({
            showImageModal: !showImageModal,
        });
    };
    
    const addAlert = (alert:any) => {
        setState({
            alertMessage: alert,
        });
    };

    return(
        <>
            {!preview && (
                 <div className="row justify-content-between align-items-end">
                    <div className="col-md-6">
                        <PageTitle text='View Message' />
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
                                        text={'Published'}
                                        type='success'
                                    />
                                </>
                                
                            </div>
                            <div className='col-md-8  d-flex position-relative'>
                                {formData?.image? (
                                    <div className='message-img-container'> 
                                        <img src={formData?.image} className='w-100'/> 
                                    </div>
                                ):(
                                    <img src={missionIcon} className='w-100'/> 
                                )}
                                
                                <div className='position-absolute upload-img-icon'>
                                <div
                                        className={` pointer edit-button mx-3`}  
                                        onClick={()=>{toggleUploadImageModal()}}
                                    >   
                                    <div>
                            
                                        <EditCircle
                                            className="button-icon"
                                            size={20}
                                            strokeWidth={1.5}
                                            color={'#FFF'}
                                        />
                                    </div>
                                </div>
                                 
                                </div>
                            </div>

                            <div className='col-md-12'>
                                <div className="user-name px-2 mt-4">
                                    <h5 className="m-0 name h6">{formData?.title}</h5>
                                    <span className="small text-muted mt-4">By {formData?.minister}</span>
                                </div> 
                            </div>
                            

                            <div className='col-md-12'>
                                <div className="user-name px-2 mt-4">
                                    <h5 className="m-0 name h6">Bible passages</h5>
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
                                    <h5 className="m-0 name h6">Message</h5>
                                </div>
                                <div 
                                    className="text-dark mt-1 small px-2"
                                    dangerouslySetInnerHTML={{ __html: formData?.message || 'N/A' }}       
                                /> 
                            </div>

                            <div className='col-md-12'>
                                <div className="user-name px-2 mt-4">
                                    <h5 className="m-0 name h6">Prayer points</h5>
                                </div>
                                <div 
                                    className="text-dark mt-1 small px-2"
                                    dangerouslySetInnerHTML={{ __html: formData?.prayer_point || 'N/A' }}       
                                /> 
                                
                            </div>

                            

                        </div>
                        
                    </>
                )}
                    
                </div>
            </>
        {showImageModal && (
            <UploadMessageImage 
                showModal={showImageModal}
                toggleModal={toggleUploadImageModal}
                messageId={ props?.match?.params?.id}
                addAlert={addAlert}
            />
        )}
            
        </>
    )

};
export default ViewApostleMessage;
