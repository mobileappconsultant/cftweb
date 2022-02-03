import React, {useEffect, useReducer} from 'react';
import Badges from 'utilComponents/Badges';
import { history } from 'helpers';
import ActionButton from 'utilComponents/ActionButton';
import CreateApostleEvent from '../CreateEvent';
import CreateButton from 'utilComponents/CreateButton';
import CircularLoader from 'utilComponents/Loader';
import { useQuery } from '@apollo/client';
import { GET_ALL_PRAYERS } from 'GraphQl/Queries';
import { capiitalizeFirstLetter, extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError, truncateMultilineText } from 'utils';
import InfoDivHeader from 'utilComponents/InfoDivHeader';

const Prayers = () => {
    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        isLoading:false,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {listView, page, isLoading, rowsPerPage, alertMessage,  showEditModal, dataArr} = state;
    const { data, loading, error } = useQuery(GET_ALL_PRAYERS);

    useEffect(() => {
        if(data){
            setState({
                dataArr: data?.getPrayers,
            });
           console.log(data);
           
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
            <div className="row  py-4 px-4"> 
            {dataArr.map((datum: any, _i:number) => {
                return(
                    <>
                        <div className="col-md-12 border-top py-3">
                            <div className='d-flex row align-items-start'>
                                
                                <div 
                                    className='col-md-10 pointer'
                                    onClick={()=> history.push(`/apostle-desk/viewprayer/${datum?._id}`) }
                                >
                                    <h6>{capiitalizeFirstLetter(datum?.title)}</h6>
                                    <p 
                                        className='small username text-muted' 
                                        dangerouslySetInnerHTML={{ __html: truncateMultilineText(datum?.subtitle, 240) || 'N/A' }}
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
                                            actionEvent={()=> history.push(`/apostle-desk/editprayer/${datum?._id}`)}
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
                actionEvent={()=> history.push('/apostle-desk/create-prayer') }
                text={'Create Prayer'}
                float
            />
            
        </>
    )
};

export default Prayers;
