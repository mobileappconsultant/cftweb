import PageTitle from 'components/PageTitle';
import UserCard from 'components/UserCard';
import React, {useReducer, useEffect } from 'react';
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

const Announcement = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:[{
            name: 'Thanksgiving Service',
            body: `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
            quis nostrud exercitation ullamco laboris nisi ut......
            `,
            date: 'Sent on 22nd February',
        }],
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, alertMessage, data} = state;

    const changeListView = () => {
        setState({
            listView: !listView,
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
            <PageTitle text='Announcement' />
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
        <div className="row  py-4 px-4"> 
            {data.map((datum: any, _i: number)=> {
                return(
                    <>
                        <div className="col-md-12">
                            <div className="my-2">
                            <UserCard
                                name={datum?.name}
                                role={datum?.body}
                                time={datum?.date}
                                avatar="https://s7d9.scene7.com/is/image/LifeWayChristianResources/biblefallhero?wid=825&op_usm=2,.5,6,0&fmt=jpg"
                                id="2"
                            />
                            </div>
                        </div>
                    </>
                );
            })}
            
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
                    Create New 
                </>
            }
            float
            actionEvent={()=> history.push('/announcement/create')}
        />
           
        </div>
       
        </>
    )

};
export default Announcement;