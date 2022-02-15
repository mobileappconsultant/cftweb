import moment from 'moment';
import React, {useEffect, useReducer} from 'react'
import ActionButton from 'utilComponents/ActionButton';
import Badges from 'utilComponents/Badges';
import { capiitalizeFirstLetter, extractErrorMessage, processAlertError, truncateMultilineText } from 'utils';
import calendarDot from 'assets/images/calendar-dot.svg';
import CreateButton from 'utilComponents/CreateButton';
import CreateBibleStudy from './CreateBibleStudy';
import { useQuery } from '@apollo/client';
import { GET_ALL_BIBLE_STUDY_CONTENT } from 'GraphQl/Queries';
import EditBibleStudy from './EditBibleStudy';
const BibleStudy =() => {

    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeId: null,
        isLoading:false,
        showAllStudies: true,
        showCreateForm: false,
        showEditForm: false,
        showViewSingleStudy: false,
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
        showAllStudies,
        showCreateForm,
        showEditForm,
        showViewSingleStudy,
    } = state;
    // GRAPHQL
    const { data, loading, error } = useQuery(GET_ALL_BIBLE_STUDY_CONTENT);

    const closePages = () => {
        setState({
            showAllStudies: true,
            showCreateForm: false,
            showEditForm: false,
            showViewSingleStudy: false,
            activeId:null,
        })
    };

    useEffect(() => {
        if(data){
            setState({
                dataArr: data?.getAllBibleStudyContent,
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


    return (

        <>
        {showAllStudies && (
            <>
                 <div className='row p-4'>
                 {dataArr.map((datum: any, _i:number) => {
                        return(
                            <>
                                
                                <div className="col-md-12 border-top border-bottom py-3">
                                        <div className='d-flex row align-items-center'>
                                            <div className='col-md-2 border-right d-flex gap-20'> 
                                                <img src={calendarDot} />
                                                <span className='small font-weight-bold'>
                                                    {moment(datum?.createdAt).format('dddd')},<br/>
                                                    {moment(datum?.createdAt).format('D/M/Y')}
                                                    
                                                </span>
                                            </div>
                                            <div 
                                                className='col-md-8 pointer border-left'
                                            >
                                                
                                                <h6 className='apostle-desk-post-header d-flex gap-20 align-items-center'>{capiitalizeFirstLetter(datum?.topic)}
                                                    <p className='user-name font-weight-light mb-0'>by {datum?.minister}</p>
                                                </h6>
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
                                                                showAllStudies:false,
                                                                showCreateForm: false,
                                                                showEditForm: true,
                                                                showViewSingleStudy: false,
                                                                activeId: datum?._id,
                                                            })
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
                        
                    )})}
                    </div>

                    <div>
                
                        <CreateButton
                            actionEvent={()=> 
                                setState({
                                    showAllStudies:false,
                                    showCreateForm: true,
                                    showEditForm: false,
                                    showViewSingleStudy: false,
                                    activeId:null,
                                })
                            }
                            text={'Create Bible Study'}
                            float
                        />
                    </div>
            </>
        )}

        {showCreateForm && (
            <div className='px-4 py-3'>
               <CreateBibleStudy
                    close={closePages}
               />
            </div>
        )}

        {showEditForm && (
            <div className='px-4 py-3'>
               <EditBibleStudy
                    close={closePages}
                    bibleStudyId={activeId}
               />
            </div>
        )}
           
            
        </>
    )
};

export default BibleStudy;