import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import ExportComponent from 'utilComponents/ExportComponent';
import TableListView from 'utilComponents/TableListView';
import Pagination from 'utilComponents/TablePagination';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import CreateButton from 'utilComponents/CreateButton';
import { Plus } from 'tabler-icons-react';
import { history } from 'helpers';
import Badges from 'utilComponents/Badges';
import { DateRangePicker } from 'react-date-range';
import { addDays } from 'date-fns';
import ActionButton from 'utilComponents/ActionButton';
import CircularLoader from 'utilComponents/Loader';
import moment from 'moment';

const Calendar = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:[
            {
                name: 'Thanksgiving Service',
                body: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut......
                `,
                date: 'Sent on 22nd February',
            },
            {
                name: 'Thanksgiving Service 2',
                body: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                quis nostrud exercitation ullamco laboris nisi ut......
                `,
                date: 'Sent on 25th February',
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
        
    };
   

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView,isLoading, page, rowsPerPage, dateState, alertMessage, data} = state;

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
                data: response?.data?.data,
                isLoading: false,
            });
        } catch (error) {
            setState({
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
   console.log(data);
    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Events' />
        </div>
        <div className="col-md-6 d-flex justify-content-end">
            <TableListView
                isActive={listView}
                actionEvent={changeListView}
            />
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
                <div className="">
                    <div className="row justify-content-between py-3 px-2">
                        {data?.map((item: any, index: number) => {
                            return(

                                    <div className="col-md-9 bg-white py-3" key={index}>
                                        <div className="w-100 shadow p-3 border-left my-2">
                                            <h6 className="font-weight-bold mb-3">{item?.title}</h6>
                                            <div className="small user-name text-muted mt-2">
                                              <span>Start time:</span>  {moment(item?.event_start_time).format('YYYY-MM-DD hh:mm:ss')}
                                            </div>
                                            <div className=" user-name text-muted mt-3">Church: {item?.church}</div>
                                            <div className=" user-name text-muted mt-2">Branch: {item?.branch}</div>
                                            <div className="d-flex justify-content-between">
                                                <div className="small user-name text-muted mt-2">Event type:{item?.event_type}</div>
                                           
                                            <div>
                                            
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
            <ExportComponent
                actionEvent={()=> console.log('me')}
            />

        <CreateButton
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
        />
           
        </div>
       
        </>
    )

};
export default Calendar;