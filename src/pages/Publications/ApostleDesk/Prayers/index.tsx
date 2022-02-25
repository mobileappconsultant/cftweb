import React, {useEffect, useReducer} from 'react';
import Badges from 'utilComponents/Badges';
import { history } from 'helpers';
import ActionButton from 'utilComponents/ActionButton';
import CreateButton from 'utilComponents/CreateButton';
import CircularLoader from 'utilComponents/Loader';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_PRAYERS } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, changeOptionsToBool, extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError, processAlertSuccess, truncateMultilineText } from 'utils';
import CreateApostlePrayer from './CreatePrayer';
import EditApostlePrayer from './EditPrayer';
import ViewApostlePrayer from './ViewPrayer';
import Filter from 'components/Filter';
import { publishOptions } from 'constants/index';
import Pagination from 'utilComponents/TablePagination';
import { PUBLISH_PRAYER, UNPUBLISH_PRAYER } from 'GraphQl/Mutations';

const Prayers = () => {
    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        showAllPrayers:true,
        showCreateForm: false,
        showEditForm: false,
        showViewSinglePrayer: false,
        status: 'null',
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {
        listView, 
        page, 
        isLoading, 
        rowsPerPage, 
        alertMessage,  
        dataArr,
        activeId,
        showAllPrayers,
        showCreateForm,
        showEditForm,
        showViewSinglePrayer,
        status,
    } = state;
    const { fetchMore } = useQuery(GET_ALL_PRAYERS,{
        variables: {
          page: 0,
          limit: 10,
          flag: status,
        },
    });

    const [unPublishPrayerData] = useMutation(UNPUBLISH_PRAYER);
    const [publishPrayerData] = useMutation(PUBLISH_PRAYER);
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
                        flag: status,
                    }
                });
         if(apiData.data){
            setState({
                dataArr: apiData?.data?.getAllPrayers,
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
        fetchData();
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

    const defaultView = () => {
        setState({
            showAllPrayers:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSinglePrayer: false,
            activeId: null,
        });
    };

    const unPublishData = async(id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will unpublish this prayer, click ok to continue")){
            const unpublish = await unPublishPrayerData({variables:{prayerId: id}});
            setState({
                alertMessage :processAlertSuccess('Prayer unpublished'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const publishData = async (id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This will publish this prayer, click ok to continue")){
            const publish = await publishPrayerData({variables:{prayerId: id}});
            setState({
                alertMessage :processAlertSuccess('Prayer published'),
                isLoading: false,
            });
            fetchData();
        }
    };

    return(
        <>
            {showAllPrayers &&(
                <>
                    <div className="row  py-4"> 
                    <div className='col-md-12 d-flex justify-content-end'>
                        <Filter
                            text="Show"
                            selectOptions={publishOptions}
                            changeEvent={changeStatus}
                        />
                    </div>
                    {isLoading? (
                        <>
                            <CircularLoader />
                        </>
                    ):(
                        <>
                        {dataArr.map((datum: any, _i:number) => {
                            return(
                                <>
                                    <div className="col-md-12 border-top border-bottom py-3">
                                        <div className='d-flex row align-items-start'>
                                            
                                            <div 
                                                className='col-md-10 pointer'
                                                onClick={()=>{
                                                    setState({
                                                        showAllPrayers:false,
                                                        showCreateForm: false,
                                                        showEditForm: false,
                                                        showViewSinglePrayer: true,
                                                        activeId:datum?._id,
                                                    });
                                                }}
                                            >
                                                <h6 className='apostle-desk-post-header'>{capiitalizeFirstLetter(datum?.title)}</h6>
                                                <p 
                                                    className='apostle-desk-post-body'  
                                                    dangerouslySetInnerHTML={{ __html: truncateMultilineText(datum?.subtitle, 300) || 'N/A' }}
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
                                                                showAllPrayers:false,
                                                                showCreateForm: false,
                                                                showEditForm: true,
                                                                showViewSinglePrayer: false,
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
                        </>
                    )}

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
                        
                    </div>
                    <CreateButton
                        actionEvent={()=> {
                            setState({
                                showAllPrayers: false,
                                showCreateForm: true,
                                showEditForm: false,
                                showViewSinglePrayer: false,
                                activeId: null,
                            });
                        } }
                        text={'Create Prayer'}
                        float
                    />
            </>
            )}
            {showCreateForm && (
                <CreateApostlePrayer
                    close={defaultView}
                />
            )}
            {showEditForm && (
                <EditApostlePrayer
                    close={defaultView}
                    prayerId={activeId}
                />
            )}
            {showViewSinglePrayer && (
                <ViewApostlePrayer
                    close={defaultView}
                    prayerId={activeId}
                />
            )}
        </>
    )
};

export default Prayers;
