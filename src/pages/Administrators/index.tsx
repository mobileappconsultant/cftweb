import PageTitle from 'components/PageTitle';
import UserCard from 'components/UserCard';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import ExportComponent from 'utilComponents/ExportComponent';
import TableListView from 'utilComponents/TableListView';
import Pagination from 'utilComponents/TablePagination';
import CreateAdmin from './CreateAdmin';
import { useQuery } from '@apollo/client';
import { GET_ALL_ADMINS } from 'GraphQl/Queries';
import { extractErrorMessage, formatInitialDateValue, processAlertError } from 'utils';
import Filter from 'components/Filter';
import { Printer } from 'tabler-icons-react';
import CircularLoader from 'utilComponents/Loader';

const Administrators = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        isLoading:true,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, isLoading, alertMessage, dataArr} = state;
    const { data, loading, error } = useQuery(GET_ALL_ADMINS);

    const changeListView = () => {
        setState({
            listView: !listView,
        });
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        setState({
            page: newPage,
        });
    };
  
    const handleChangeRowsPerPage = (event: any): void => {

        const splicedIndex = page * rowsPerPage;
        let spilceStop = rowsPerPage+ splicedIndex;
        
        if(spilceStop >= dataArr.length){
            return;
        }
        setState({
            rowsPerPage: event?.target?.value,
        });
      
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

    

    useEffect(() => {
        if(data){
            setState({
                dataArr: data?.getAllAdmin,
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
    
    const paginatedData = (dataArr:any) => {
        const splicedIndex = page * rowsPerPage;
        let spilceStop = rowsPerPage+ splicedIndex;
        const newArr = dataArr.slice(splicedIndex, spilceStop);
        
        return newArr;

    };
    const paginateData = paginatedData(dataArr);

    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Administrators' />
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
        <div className="bg-white">
        <div className="row  pt-4 px-4 justify-content-between"> 
            <div className='col-md-3'>
                <Filter
                    text="Status"
                />
            </div>
            <div className='col-md-1 text-right row justify-content-end'> 
                <Printer
                    size={34}
                    strokeWidth={2}
                    color={'#000000'}
                    className='pointer'
                />
            </div>
            <div className='col-md-12'>
                <PageTitle text='Administrators List' />
            </div>
            
        </div>
        
        {isLoading? (
            <>
                <CircularLoader/>
            </>
        ):(
            <>
           
        <div className="row  py-4 px-4 overflow-y-auto "> 
            {paginateData.map((datum: any, _i: number)=> {
                console.log(datum);
                return(
                    <>
                        <div className="col-md-6">
                            <div className="my-2">
                            <UserCard
                                name={datum?.full_name}
                                role={datum?.role}
                                time={'22/03/2022'}
                                avatar="https://mdbootstrap.com/img/Photos/Avatars/img%20(30).jpg"
                                active={datum?.status}
                                id="2"
                            />
                            </div>
                        </div>
                    </>
                );
            })}
            
        </div>

        </>
        )}
            <Pagination
                count={dataArr.length?? 0}
                page={page}
                rowsPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </div>
            
        <div>
            
           <CreateAdmin
                addAlert={addAlert}
           />
        </div>
       
        </>
    )

};
export default Administrators;