

import UserCard from 'components/UserCard';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import Pagination from 'utilComponents/TablePagination';
import InviteAdmin from './InviteAdmin';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_ADMINS } from 'GraphQl/Queries';
import { extractErrorMessage, processAlertError, processAlertSuccess } from 'utils';
import Filter from 'components/Filter';
import CircularLoader from 'utilComponents/Loader';
import { ACTIVATE_ADMIN, DEACTIVATE_ADMIN } from 'GraphQl/Mutations';
import ViewSingleMember from './ViewSingleAdmin';
import userIcon from 'assets/images/user.png';

const AdministratorsList = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        isLoading:true,
        viewSingle: false,
        userId: null,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, isLoading, alertMessage, dataArr, viewSingle, userId} = state;
    const { fetchMore }  = useQuery(GET_ALL_ADMINS);

    const [activateAdmin] = useMutation(ACTIVATE_ADMIN);
    const [deactivateAdmin] = useMutation(DEACTIVATE_ADMIN);

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
    const fetchData = async() => {
        try {
             
            const apiData : any = await fetchMore({variables:{}});
            const {data, loading, error} = apiData;
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
                });
            };
        } catch (error) {
            setState({
                alertMessage :processAlertError(extractErrorMessage(error)),
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

    const deactivateAdministrator = async(id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will deactivate the selected admin account, click ok to continue")){
            await deactivateAdmin({variables:{adminID: id}});
            setState({
                alertMessage :processAlertSuccess('Admin account deactivated'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const activateAdministrator = async (id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will activate the selected admin account, click ok to continue")){
            await activateAdmin({variables:{adminID: id}});
            setState({
                alertMessage :processAlertSuccess('Admin account activated'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const viewUserProfile = (id:any) => {
        setState({
            viewSingle: !viewSingle,
            userId: id,
        });
};
    
    const paginatedData = (dataArr:any) => {
        const splicedIndex = page * rowsPerPage;
        let spilceStop = rowsPerPage+ splicedIndex;
        const newArr = dataArr.slice(splicedIndex, spilceStop);
        
        return newArr;

    };
    const paginateData = paginatedData(dataArr);

    return(
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
        <div className="bg-white">
        {!viewSingle? (
            <>
                <div className="row  pt-4 px-4 justify-content-end">
                    <div className='col-md-3'>
                        <Filter
                            text="Status" />
                    </div>
                </div>

                {isLoading ? (
                    <>
                        <CircularLoader />
                    </>
                ) : (
                    <>
                        <div className="row  py-4 px-4 overflow-y-auto ">
                            {paginateData.map((datum: any, _i: number) => {

                                return (
                                    <>
                                        {datum?.full_name && (
                                            <div className="col-md-6">
                                                <div className="my-2">
                                                    <UserCard
                                                        name={datum?.full_name ?? null}
                                                        role={datum?.role[0] ? datum?.role[0]?.name : ''}
                                                        time={'22/03/2022'}
                                                        avatar={datum?.avatar?datum?.avatar : userIcon}
                                                        active={datum?.status}
                                                        id={datum.id}
                                                        disableAccount={deactivateAdministrator}
                                                        activateAccount={activateAdministrator}
                                                        viewProfile={viewUserProfile} />
                                                </div>
                                            </div>
                                        )}

                                    </>
                                );
                            })}

                        </div>

                    </>
                )}
                <Pagination
                    count={dataArr.length ?? 0}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage} 
                />
                <div>

                    <InviteAdmin
                        addAlert={addAlert} 
                    />
                </div>
            </>
   
        ):(
            <>
                    <ViewSingleMember
                        userId={userId}
                        close={viewUserProfile}
                        listingReload={fetchData}
                    />
                </>
        )}
        </div>
    </>
    )

};
export default AdministratorsList;

