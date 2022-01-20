import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import { history } from 'helpers';
import Badges from 'utilComponents/Badges';
import missionIcon from 'assets/images/Rectangle 2638.svg';
import AddNotes from './AddNotes';
import EditApostleEvent from '../EditEvent';
import EditNotes from './EditNotes';
import CircularLoader from 'utilComponents/Loader';
import { useQuery } from '@apollo/client';
import { GET_SINGLE_MESSAGE } from 'GraphQl/Queries';
import { extractErrorMessage, formatInitialDateValue, processAlertError } from 'utils';
const ViewApostleEvent = (props:any):JSX.Element => {
   
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        apostleData:{},
        messageNote: '',
        showAddNoteModal: false,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {isLoading, messageNote, alertMessage, apostleData, showAddNoteModal} = state;
    const { data, loading, error } = useQuery(GET_SINGLE_MESSAGE, {
        variables: { messageId: props?.match?.params?.id}
    });
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    const toggleNoteModal = () => {
        setState({
            showAddNoteModal: !showAddNoteModal,
        });
    };

    useEffect(() => {
        if(data){
            setState({
                apostleData: data?.getMessage || {},
              
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

        <div className="row justify-content-between align-items-center">
        <div className="col-md-6">
            <PageTitle text='Apostle Desk' />
        </div>
        
        
        </div>
        {isLoading ? 
            (
                <CircularLoader />
            ):(
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
        <div className="row"> 
            <div className="col-md-12">
                <div className="bg-white shadow px-4 py-4">
                <div className="col-md-12 text-right d-flex justify-content-end mb-3">
                    <Badges
                        text="Active"
                        type="success"
                    />
                </div>
                    
                    <img src={missionIcon} />
                    <div className="user-name px-2 mt-4">
                        <h6 className="m-0 name">{apostleData?.topic}</h6>
                        <span className="small email">{apostleData?.minister}</span>
                    </div>
                   
                    <div className="mt-4">
                        <h5 className="">Message Notes 
                        {!messageNote? (
                            <AddNotes 
                                addAlert={addAlert}
                                messageId={props?.match?.params?.id}
                                // refreshForm= {fetchData}
                            />
                        ):(
                            <EditNotes
                                addAlert={addAlert}
                                messageId={props?.match?.params?.id}
                                messageNote={messageNote}
                                // refreshForm= {fetchData}
                            />
                        )}
                        
                        </h5>

                        <div 
                             className="text-dark mt-4 small"
                             dangerouslySetInnerHTML={{ __html: messageNote || 'N/A' }}       
                        />

                    
                    </div>
                    
                    
                </div>
            </div>
        </div>
        <EditApostleEvent
             addAlert={addAlert}
             data={data}
             messageId={props?.match?.params?.id}
            //  refreshForm= {fetchData}
        />
        </>
            )
        }
      
        
        </>
    )

};
export default ViewApostleEvent;