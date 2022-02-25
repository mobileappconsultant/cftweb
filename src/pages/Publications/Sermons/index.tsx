import moment from 'moment';
import React, {useReducer, useEffect} from 'react'
import ActionButton from 'utilComponents/ActionButton';
import Badges from 'utilComponents/Badges';
import { capiitalizeFirstLetter, extractErrorMessage, processAlertError, truncateMultilineText } from 'utils';
import Filter from 'components/Filter';
import CreateSermon from './CreateSermon';
import EditSermon from './EditSermon';
import ViewSermon from './ViewSermon';
import Pagination from 'utilComponents/TablePagination';
import CircularLoader from 'utilComponents/Loader';
import { useQuery } from '@apollo/client';
import { GET_ALL_SERMONS } from 'GraphQl/Queries';
import CreateButton from 'utilComponents/CreateButton';

const Sermons =() => {
    const initialState = {
        listView: true,
        rowsPerPage: 10,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        showAllSermons:true,
        showCreateForm: false,
        showEditForm: false,
        showViewSingleSermon: false,
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
        showAllSermons,
        showCreateForm,
        showEditForm,
        showViewSingleSermon,
    } = state;
    const { fetchMore } = useQuery(GET_ALL_SERMONS, {
        variables: {
          page: 0,
          limit: 10
        },
    });

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

    const fetchData =  async () => {
        setState({
            isLoading:true,
        });
        const apiData : any = 
        await fetchMore({
                    variables:{
                        page: page? page: 0,
                        limit: rowsPerPage? rowsPerPage : 10,
                    }
                });
         if(apiData.data){
            setState({
                dataArr: apiData?.data?.getSermons,
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

    const defaultView = () => {
        setState({
            showAllSermons:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleSermon: false,
            activeId: null,
        });
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
    return (

        <>
            {showAllSermons &&( 
                <>
                    <div className='row p-4'>
                    {isLoading? (
                            <div className='bg-white'>
                                <CircularLoader />
                            </div>
                        ) :(
                        <>
                            {dataArr.map((datum: any, _i:number) => {
                                return(
                                    <div className="col-md-12 border-top py-3">
                                        <div className='d-flex row align-items-start'>
                                            
                                            <div 
                                                className='col-md-10 pointer'
                                                onClick={()=> {
                                                    setState({
                                                        showAllSermons:false,
                                                        showCreateForm: false,
                                                        showEditForm: false,
                                                        showViewSingleSermon: true,
                                                        activeId:datum?._id,
                                                    });
                                                }}
                                            >
                                                <h6 className='apostle-desk-post-header'>{capiitalizeFirstLetter(datum?.title)}</h6>
                                                <p 
                                                    className='apostle-desk-post-body'  
                                                    dangerouslySetInnerHTML={{ __html: truncateMultilineText(
                                                        datum?.message, 300) || 'N/A' }}
                                                />
                                                
                                            
                                            </div>
                                            <div className='col-md-2 text-right' >
                                                <div className='d-flex flex-row-reverse'>
                                                    
                                                    <Badges
                                                        text="Published"
                                                        type="success"
                                                    />
                                                </div>
                                                <div className='d-flex flex-row-reverse published-time-posted mt-3'>
                                                {moment(new Date()).format("DD/MM/YYYY, hh:mm:ss")}
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
                                                                showAllSermons:false,
                                                                showCreateForm: false,
                                                                showEditForm: true,
                                                                showViewSingleSermon: false,
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
                                
                                )}
                            )}
                        </>
                    
                    )}
                    
                    </div>

                    <div>
                        <CreateButton
                            actionEvent={()=> 
                                setState({
                                    showAllSermons: false,
                                    showCreateForm: true,
                                    showEditForm: false,
                                    showViewSingleSermon: false,
                                    activeId: null,
                                })
                            }
                            text={'Create Sermon'}
                            float
                        />
                    </div>

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
            </>
            )}
            {showCreateForm && (
                <div className='px-4'>
                    <CreateSermon
                        close={defaultView}
                    />
                </div>
            )}

            {showEditForm && (
                <div className='px-4'>
                    <EditSermon
                        close={defaultView}
                        messageId={activeId}
                    />
                </div>
            )}  
            {showViewSingleSermon && (
                <div className="px-4">
                    <ViewSermon
                        close={defaultView}
                        messageId={activeId}
                    />
                </div>
            )}
        </>
    )
};

export default Sermons;