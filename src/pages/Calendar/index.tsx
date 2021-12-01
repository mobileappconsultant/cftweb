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
        
    };
   

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, dateState, alertMessage, data} = state;

    const changeListView = () => {
        setState({
            listView: !listView,
        });
    };

    const setDateState = (date :any) => {
        console.log(date);
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
            const response = await ApiRequestClient.get(apiRoutes.GET_ALL_ADMINS);
    
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
        //fetchData();

        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);
   
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
        <div className="">
            <div className="row justify-content-between py-3 px-2">
                <div className="col-md-8 bg-white py-3">
                    <div className="w-100 shadow p-3 border-left my-2">
                        <h6 className="font-weight-bold mb-3">Overcomers vigil</h6>
                        <div className="small user-name text-muted mt-2">08, March 2021</div>
                        <div className="d-flex justify-content-between">
                        <div className="small user-name text-muted mt-3">9:00 PM - 01:00 AM</div>
                        <div>
                            <ActionButton
                                text={
                                    <>
                                        Edit
                                    </>
                                }
                                className="mx-2 edit-action"
                
                                actionEvent={()=> history.push('/announcements/create')}
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

                    <div className="w-100 shadow p-3 border-left my-4">
                        <h6 className="font-weight-bold mb-3">Overcomers vigil</h6>
                        <div className="small user-name text-muted mt-2">08, March 2021</div>
                        <div className="d-flex justify-content-between">
                        <div className="small user-name text-muted mt-3">9:00 PM - 01:00 AM</div>
                        <div>
                            <ActionButton
                                text={
                                    <>
                                        Edit
                                    </>
                                }
                                className="mx-2 edit-action"
                
                                actionEvent={()=> history.push('/announcements/create')}
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

                    <div className="w-100 shadow p-3 border-left my-4">
                        <h6 className="font-weight-bold mb-3">Overcomers vigil</h6>
                        <div className="small user-name text-muted mt-2">08, March 2021</div>
                        <div className="d-flex justify-content-between">
                        <div className="small user-name text-muted mt-3">9:00 PM - 01:00 AM</div>
                        <div>
                            <ActionButton
                                text={
                                    <>
                                        Edit
                                    </>
                                }
                                className="mx-2 edit-action"
                
                                actionEvent={()=> history.push('/announcements/create')}
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
                <div className="col-md-4">
                <DateRangePicker
                     editableDateInputs={true}
                     //@ts-ignore
                     onChange={item => setDateState(item.selection)}
                     moveRangeOnFirstSelection={false}
                     ranges={dateState}
                    //onChange={item => setDateState([item.selection])}
                    //@ts-ignore
                   
                    //direction="horizontal"
                />
                </div>
            </div>
        </div>
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