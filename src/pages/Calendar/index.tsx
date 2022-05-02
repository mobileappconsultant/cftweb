import PageTitle from 'components/PageTitle';
import './calendar.scss';
import React, {useReducer, useEffect} from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import Pagination from 'utilComponents/TablePagination';
import ActionButton from 'utilComponents/ActionButton';
import CircularLoader from 'utilComponents/Loader';
import CreateEvent from './CreateCalendarEvent';
import { addDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import OneweekCalendar from 'utilComponents/OneweekCalendar';
import { GET_ALL_EVENTS } from 'GraphQl/Queries';
import { useQuery } from '@apollo/client';
import { extractErrorMessage, processAlertError } from 'utils';
import moment from 'moment';
import EditEvent from './EditCalendarEvent';
import DeleteModal from 'utilComponents/DeleteModal';
import { DELETE_EVENT } from 'GraphQl/Mutations';

const pastMonth = new Date();

const Calendar = ():JSX.Element => {
    const defaultSelected: DateRange = {
        from: pastMonth,
        to: addDays(pastMonth, 4)
    };
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:[ ],
        dateState: [
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection'
            }
        ],
        isLoading: false,
        showEditModal: false,
        activeId: null,
        range: defaultSelected,
        showDeleteModal: false,
        
    };
   

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView,isLoading, page, rowsPerPage, showEditModal, alertMessage, data, range, activeId, showDeleteModal } = state;
    const { fetchMore } = useQuery(GET_ALL_EVENTS, {
        variables: {},
    });

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
      
      };
    
    const handleChangeRowsPerPage = (event: React.SyntheticEvent): void => {
        
    };
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

    const fetchData =  async () => {
        setState({
            isLoading:true,
        });
        const apiData : any = 
        await fetchMore({variables:{}});
         if(apiData.data){
            setState({
                data: apiData?.data?.getEvents,
                isLoading: false,
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


    useEffect(() => {
        fetchData();

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    const setRange= (date :any) => {
        setState({
            ...state,
            range: date,
        });
    };

    const toogleEditModal = (activeId = null) => {
        setState({
            showEditModal: !showEditModal,
            activeId: activeId,
        })
    };
    const refreshData = (refresh= null) => {
        if(refresh){
            fetchData();
        }

    };

    const toggleDeleteModal = () => {
        setState({
            showDeleteModal: !showDeleteModal,
        });
    };

    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Events' />
        </div>
       
        </div>
        {alertMessage?.text && (
            <>
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </>
        )}
        {isLoading? (
            <CircularLoader/>
        ):(
            <>
                <div className="calendar-module">
                    <div className="row justify-content-between py-3 px-2">
                        <div className="col-md-8 bg-white py-3" >
                            <OneweekCalendar
                                showDetailsHandle={true}
                            />
                            {data?.map((item: any, index: number) => {
                                return(

                                        <div className="w-100  calendar-listing-card" key={index}>
                                            <div >
                                                <div className='d-flex justify-content-between align-items-end'>
                                                    <div>
                                                        <h6 className="event-name">{item?.eventName}</h6>
                                                        <div className="date">
                                                            { moment(item?.startDate).format("MMM Do YYYY") } - {moment(item?.endDate).format("MMM Do YYYY") }
                                                        </div>
                                                        <div className="time m-0">
                                                            { moment(item?.time).format('hh:mm A')}
                                                        </div>
                                                    </div>
                                                    
                                                    <div className='d-flex'>
                                                        <ActionButton
                                                            text={
                                                                <>
                                                                    Edit
                                                                </>
                                                            }
                                                            className="mx-2 edit-action"
                                            
                                                            actionEvent={()=> toogleEditModal(item?._id)}
                                                        />
                                                        <ActionButton
                                                            text={
                                                                <>
                                                                    Delete
                                                                </>
                                                            }
                                                            className="delete-action"
                                            
                                                            actionEvent={()=> {
                                                                setState({
                                                                    showDeleteModal:true,
                                                                    activeId:item?._id,
                                                                });
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                            
                                        
                            
                                )
                            })}
                        </div>
                        <div className="col-md-4">
                            <h6>Filter by start and end date range </h6>
                            <div className=" mx-auto">
                                
                                <DayPicker
                                    mode="range"
                                    defaultMonth={new Date()}
                                    selected={range}
                                    footer={<></>}
                                    onSelect={setRange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )}

            <Pagination
                count={data.length?? 0}
                page={0}
                rowsPerPage={10}
                onPageChange={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
        <div>
        <div className='calendar-create-module'>
            <CreateEvent
                addAlert={addAlert}
                refreshListing={refreshData}
            />
            {showEditModal && (
                <>
                    <EditEvent 
                        addAlert={addAlert}
                        activeId={activeId}
                        handleClose={toogleEditModal}
                        showModal={showEditModal}
                        refreshListing={refreshData}
                    />
                </>
            )}
        </div> 

           
        </div>

        {showDeleteModal && (
                <DeleteModal
                    refresh={fetchData}
                    mutation={DELETE_EVENT}
                    handleModalToggle={toggleDeleteModal}
                    showModal={showDeleteModal}
                    parameterKey="eventId"
                    recordId={activeId}
                    addAlert={addAlert}
                />
            )}
       
        </>
    )

};
export default Calendar;