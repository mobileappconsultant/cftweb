import React, {useEffect, useReducer} from 'react';
import Badges from 'utilComponents/Badges';
import { history } from 'helpers';
import ActionButton from 'utilComponents/ActionButton';
import CreateButton from 'utilComponents/CreateButton';
import CircularLoader from 'utilComponents/Loader';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRAYERS } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError, truncateMultilineText } from 'utils';
import CreateApostlePrayer from './CreatePrayer';
import EditApostlePrayer from './EditPrayer';
import ViewApostlePrayer from './ViewPrayer';

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
    } = state;
    const { data, loading, error } = useQuery(GET_ALL_PRAYERS);

    useEffect(() => {
        if(data){
            setState({
                dataArr: data?.getPrayers,
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

    const defaultView = () => {
        setState({
            showAllPrayers:true,
            showCreateForm: false,
            showEditForm: false,
            showViewSinglePrayer: false,
            activeId: null,
        });
    };

    return(
        <>
            {showAllPrayers &&(
                <>
                    <div className="row  py-4"> 
                    {dataArr.map((datum: any, _i:number) => {
                        return(
                            <>
                                <div className="col-md-12 border-top py-3">
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
                                            <div className='d-flex flex-row-reverse'>
                                                <Badges
                                                    text="Published"
                                                    type="success"
                                                />
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
