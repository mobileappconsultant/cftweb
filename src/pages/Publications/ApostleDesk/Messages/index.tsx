import React, {useEffect, useReducer} from 'react';
import Badges from 'utilComponents/Badges';
import ActionButton from 'utilComponents/ActionButton';
import CreateButton from 'utilComponents/CreateButton';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_MESSAGES } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, extractErrorMessage, changeOptionsToBool, processAlertError, truncateMultilineText, processAlertSuccess } from 'utils';
import Filter from 'components/Filter';
import moment from 'moment';
import CreateApostleMessage from './CreateMessage';
import EditApostleMessage from './EditMessage';
import ViewApostleMessage from './ViewMessage';
import Pagination from 'utilComponents/TablePagination';
import CircularLoader from 'utilComponents/Loader';
import { publishOptions } from 'constants/index';
import { DELETE_MESSAGE, PUBLISH_MESSAGE, UNPUBLISH_MESSAGE } from 'GraphQl/Mutations';
import AlertComponent from 'components/AlertComponent';
import DeleteModal from 'utilComponents/DeleteModal';


const Messages = () => {
    const initialState = {
        listView: true,
        rowsPerPage: 10,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        status: 'null',
        showAllMessages:true,
        showCreateForm: false,
        showEditForm: false,
        showViewSingleMessage: false,
        showDeleteModal:false,

    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const { 
        page, 
        isLoading, 
        rowsPerPage, 
        alertMessage,  
        showDeleteModal, 
        dataArr,
        activeId,
        showAllMessages,
        showCreateForm,
        showEditForm,
        showViewSingleMessage,
        status,
    } = state;
    const { fetchMore } = useQuery(GET_ALL_MESSAGES, {
        variables: {
          page: 0,
          limit: 10,
          flag: status,
        },
    });

    const [unPublishMessageData] = useMutation(UNPUBLISH_MESSAGE);
    const [publishMessageData] = useMutation(PUBLISH_MESSAGE);
    
    const defaultView = (refresh= null) => {
        setState({
            showAllMessages:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleMessage: false,
            activeId: null,
        });
        if(refresh){
            fetchData();
        }
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        
        setState({
            page: newPage,
        });
        fetchData();
        
    };
  
    const handleChangeRowsPerPage = (event: any): void => {
        
        setState({
            rowsPerPage: event?.target?.value,
        });
        fetchData();
    };

    const fetchData =  async (flag= status) => {
        setState({
            isLoading:true,
        });
        const apiData : any = 
        await fetchMore({
                    variables:{
                        flag:flag,
                        page: page? page: 0,
                        limit: rowsPerPage? rowsPerPage : 10,
                        
                    }
                });
         if(apiData.data){
            setState({
                dataArr: apiData?.data?.getAllMessages,
            }); 
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
            });
        };

        if(apiData.error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(apiData?.error)),
                isLoading: false,
            });
        }
    };

    const changeStatus = (e:any) => {
        const option = changeOptionsToBool(e?.target?.value);
        setState({
            status: option,
        });
        fetchData(option);
    };

    useEffect(() => {
        fetchData();
        
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, [page, rowsPerPage]);

    const unPublishData = async(id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will unpublish this message, click ok to continue")){
            await unPublishMessageData({variables:{messageId: id}});
            setState({
                alertMessage :processAlertSuccess('Message unpublished'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const publishData = async (id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will publish this message, click ok to continue")){
            await publishMessageData({variables:{messageId: id}});
            setState({
                alertMessage :processAlertSuccess('Message published'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alert:any) => {
        setState({
            alertMessage:alert,
        });
    };

    const toggleDeleteModal = () => {
        setState({
            showDeleteModal: !showDeleteModal,
        });
    };

    return(
        <>
            {showAllMessages &&(
                <div className="row py-0 px-0"> 
                        <div className='col-md-12 d-flex justify-content-end'>
                            <Filter
                                text="Show"
                                selectOptions={publishOptions}
                                changeEvent={changeStatus}
                            />
                        </div>
                        {isLoading? (
                            <div className='bg-white'>
                                <CircularLoader />
                            </div>
                        ) :(
                        <>
                            
                         
                            

                            {alertMessage?.text && (
                                 <div className='col-md-12 d-flex justify-content-end my-2'>
                                    <AlertComponent
                                        text={alertMessage.text}
                                        type={alertMessage.type}
                                        onClose={handleAlertClose}
                                    />
                                </div>
                            )}
                            
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
                                                    {datum?.published?(
                                                        <Badges
                                                            clickEvent={()=>unPublishData(datum?._id)}
                                                            text="Published"
                                                            type="success"
                                                        />
                                                    ):(
                                                        <Badges
                                                            clickEvent={()=>publishData(datum?._id)}
                                                            text="Not Published"
                                                            type="pending"
                                                        />
                                                    )}
                                                    
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
                                                        actionEvent={()=> {
                                                            setState({
                                                                showDeleteModal:true,
                                                                activeId:datum?._id,
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                </>
                            )
                        })}
                        {dataArr.length !== 0 && (
                            <>
                                <div>
                                    <Pagination
                                        count={dataArr.length?? 0}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        onPageChange={handleChangePage}
                                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </div>
                            </>
                        )}
                        

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
                
                    )}
                    
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

            {showDeleteModal && (
                <DeleteModal
                    refresh={fetchData}
                    mutation={DELETE_MESSAGE}
                    handleModalToggle={toggleDeleteModal}
                    showModal={showDeleteModal}
                    parameterKey="messageId"
                    recordId={activeId}
                    addAlert={addAlert}
                />
            )}
            
        </>
    )
};

export default Messages;
