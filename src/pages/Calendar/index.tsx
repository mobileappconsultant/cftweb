import PageTitle from 'components/PageTitle';
import './calendar.scss';
import React, {useReducer, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import Pagination from 'utilComponents/TablePagination';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import { history } from 'helpers';
import ActionButton from 'utilComponents/ActionButton';
import CircularLoader from 'utilComponents/Loader';
import CreateEvent from './CreateCalendarEvent';
import { addDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import OneweekCalendar from 'utilComponents/OneweekCalendar';

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
        data:[
            {
                title: 'Overcomers Night Vigil',
                date: 'November 15th, 2021',
            },
            {
                title: 'Bible Study',
                date: 'November 35th, 2021',
            },
        ],
        dateState: [
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection'
            }
        ],
        isLoading: false,
        range: defaultSelected,
        
    };
   

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView,isLoading, page, rowsPerPage, dateState, alertMessage, data, range } = state;

    const changeListView = () => {
        setState({
            listView: !listView,
        });
    };

    const setDateState = (date :any) => {
        setState({
                ...state,
                dateState: [date],
        });
    };

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

    const fetchData = async () => {
        setState({
            isLoading: true,
        });

        try {
            const response = await ApiRequestClient.get(apiRoutes.GET_ALL_CALENDAR_EVENT);
          
            setState({
                // data: response?.data?.data,
                isLoading: false,
            });
        } catch (error) {
            setState({
                isLoading: false,
            });
        }

    };

    useEffect(() => {
        // fetchData();

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
                                                        <h6 className="event-name">{item?.title}</h6>
                                                        <div className="date">
                                                            {item?.date}
                                                        </div>
                                                        <div className="time m-0">
                                                            9:00 PM - 01:00 AM
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
                                            
                                                            actionEvent={()=> history.push('/calendar/edit-event/'+ item?._id)}
                                                        />
                                                        <ActionButton
                                                            text={
                                                                <>
                                                                    Delete
                                                                </>
                                                            }
                                                            className="delete-action"
                                            
                                                            actionEvent={()=> history.push('/announcements/create')}
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
            <CreateEvent />
        </div> 
        
        {/* <CreateButton
            text={
                <>
                    <Plus
                        size={20}
                        strokeWidth={2}
                        color={'white'}
                    />
                    &nbsp;
                    Create New Event
                </>
            }
            float
            actionEvent={()=> history.push('/calendar/create-event')}
        /> */}
           
        </div>
       
        </>
    )

};
export default Calendar;