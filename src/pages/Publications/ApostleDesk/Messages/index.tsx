import React, {useEffect, useReducer} from 'react';
import Badges from 'utilComponents/Badges';
import { history } from 'helpers';
import ActionButton from 'utilComponents/ActionButton';
import CreateApostleEvent from '../../CreateEvent';
import CreateButton from 'utilComponents/CreateButton';
import CircularLoader from 'utilComponents/Loader';
import { useQuery } from '@apollo/client';
import { GET_ALL_MESSAGES } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError, truncateMultilineText } from 'utils';
import InfoDivHeader from 'utilComponents/InfoDivHeader';
import Filter from 'components/Filter';
import moment from 'moment';
import CreateApostleMessage from './CreateMessage';
import EditApostleMessage from './EditMessage';
import ViewApostleMessage from './ViewMessage';

const Messages = () => {
    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        showAllMessages:true,
        showCreateForm: false,
        showEditForm: false,
        showViewSingleMessage: false,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {
        listView, 
        page, 
        isLoading, 
        rowsPerPage, 
        alertMessage,  
        showEditModal, 
        dataArr,
        activeId,
        showAllMessages,
        showCreateForm,
        showEditForm,
        showViewSingleMessage,
    } = state;
    const { data, loading, error } = useQuery(GET_ALL_MESSAGES);

    const defaultView = () => {
        setState({
            showAllMessages:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleMessage: false,
            activeId: null,
        });
    };

    useEffect(() => {
        if(data){
            setState({
                dataArr: data?.getMessages,
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

    return(
        <>
            {showAllMessages &&(
                <div className="row py-0 px-0"> 
                
                
                        <>
                                <div className='col-md-12 d-flex justify-content-end'>
                                <Filter
                                    text="Show"
                                />
                            </div>
                            
                            {dataArr.map((datum: any, _i:number) => {
                                return(
                                    <>
                                    <div className="col-md-12 border-top border-bottom py-3">
                                        <div className='d-flex row align-items-start'>
                                            <div className='col-md-2'>
                                                <div className='banner-container'>
                                                    {datum?.image? (
                                                        <img 
                                                        className='img-fluid pointer w-100'
                                                        src={datum?.image} 
                                                        alt="Message banner"
                                                    />
                                                    ):(
                                                        <img 
                                                        className='img-fluid pointer w-100'
                                                        src='https://thumbs.dreamstime.com/z/smile-god-love-you-text-wood-cycle-face-40762828.jpg' 
                                                        alt="Message banner"
                                                    />
                                                    )}
                                                </div>
                                            </div>
                                            <div 
                                                className='col-md-8 pointer'
                                                onClick={()=> {
                                                        setState({
                                                            showAllMessages:false,
                                                            showCreateForm: false,
                                                            showEditForm: false,
                                                            showViewSingleMessage: true,
                                                            activeId:datum?._id,
                                                        });
                                                }}
                                                
                                            >
                                                <h5 className='apostle-desk-post-header'>{capiitalizeFirstLetter(datum?.title)}</h5>
                                                <p 
                                                    className='apostle-desk-post-body' 
                                                    dangerouslySetInnerHTML={{ __html: truncateMultilineText(datum?.message, 300) || 'N/A' }}
                                                />
                                                
                                            
                                            </div>
                                            <div className='col-md-2 text-right' >
                                                <div className='d-flex flex-row-reverse mb-3'>
                                                    <Badges
                                                        text="Published"
                                                        type="success"
                                                    />
                                                </div>

                                                <div className='d-flex flex-row-reverse published-time-posted'>
                                                {moment(datum?.createdAt).format("DD/MM/YYYY, hh:mm:ss")}
                                                </div>

                                                <div className='d-flex justify-content-end mt-4'>
                                                    
                                                    <ActionButton
                                                        text={
                                                            <>
                                                                Edit
                                                            </>
                                                        }
                                                        className="edit-action mr-3"
                                                        actionEvent={()=> {
                                                            setState({
                                                                showAllMessages:false,
                                                                showCreateForm: false,
                                                                showEditForm: true,
                                                                showViewSingleMessage: false,
                                                                activeId:datum?._id,
                                                            });
                                                        }}
                                                          
                                                    />

                                                    <ActionButton
                                                        text={
                                                            <>
                                                                Delete
                                                            </>
                                                        }
                                                        className="edit-action "
                                                        actionEvent={()=> console.log('me')}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </>
                            )
                        })}

                            <div>
                                <CreateButton
                                    actionEvent={()=> 
                                        setState({
                                            showAllMessages:false,
                                            showCreateForm: true,
                                            showEditForm: false,
                                            showViewSingleMessage: false,
                                            activeId:null,
                                        })
                                    }
                                    text={'Create Message'}
                                    float
                                />
                            </div>
                        
                        </>
                
            
                    
                </div>
            )}
            {showCreateForm && (
                <CreateApostleMessage 
                    close={defaultView}
                />
            )}

            {showEditForm && (
                <EditApostleMessage
                    close={defaultView}
                    messageId={activeId}
                />
            )}  
            {showViewSingleMessage && (
                <ViewApostleMessage
                    close={defaultView}
                    messageId={activeId}
                />
            )}
            
        </>
    )
};

export default Messages;
