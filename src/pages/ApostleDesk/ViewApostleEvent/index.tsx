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
import { extractErrorMessage, processAlertError } from 'utils';
import EditApostleEvent from '../EditEvent';
import EditNotes from './EditNotes';
import { Loader } from 'tabler-icons-react';
import CircularLoader from 'utilComponents/Loader';
const ViewApostleEvent = (props:any):JSX.Element => {
   
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:{},
        messageNote: '',
        showAddNoteModal: false,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {isLoading, messageNote, alertMessage, data, showAddNoteModal} = state;

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
    }

    const fetchData = async () => {
        setState({
            isLoading: true,
        });

        try {
            const response = await ApiRequestClient.get(`${apiRoutes.GET_SINGLE_APOSTLE_DESK_EVENT}?id=${props?.match?.params?.id}`);
            const contents = await ApiRequestClient.get(`${apiRoutes.GET_ALL_MESSAGE_NOTES}?messageId=${props?.match?.params?.id}`);

            setState({
                data: response?.data?.data,
                messageNote: contents?.data?.data?.paragraphs[0] || '',
                isLoading: false,
            });
        } catch (error) {
            const err = extractErrorMessage(error);
            setState({
                isLoading: false,
                alertMessage: processAlertError(err),
            });
        }

    };

    useEffect(() => {
        fetchData();

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

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
                        <h6 className="m-0 name">{data?.topic}</h6>
                        <span className="small email">{data?.minister}</span>
                    </div>
                   
                    <div className="mt-4">
                        <h5 className="">Message Notes 
                        {!messageNote? (
                            <AddNotes 
                                messageId={props?.match?.params?.id}
                                refreshForm= {fetchData}
                            />
                        ):(
                            <EditNotes
                                messageId={props?.match?.params?.id}
                                messageNote={messageNote}
                                refreshForm= {fetchData}
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
        />
        </>
            )
        }
      
        
        </>
    )

};
export default ViewApostleEvent;