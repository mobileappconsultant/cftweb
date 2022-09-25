import PageTitle from 'components/PageTitle';
import UserCard from 'components/UserCard';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import Pagination from 'utilComponents/TablePagination';
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_MEMBERS } from 'GraphQl/Queries';
import { extractErrorMessage, formatDate2, processAlertError, processAlertSuccess } from 'utils';
import Filter from 'components/Filter';
import CircularLoader from 'utilComponents/Loader';
import userIcon from 'assets/images/user.png';
import { ACTIVATE_USER, DEACTIVATE_USER } from 'GraphQl/Mutations';
import ViewSingleMember from './ViewSingleMember';

const Members = ():JSX.Element => {
    const initialState = {
        listView: true,
        pagination:{
            rowsPerPage: 10,
            page:0,
            totalRecords: 10,
        },
        alertMessage:{},
        dataArr:[],
        isLoading:true,
        viewSingle: false,
        userId: null,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, isLoading, alertMessage, dataArr, viewSingle, userId, pagination} = state;
    const { fetchMore }  = useQuery(GET_ALL_MEMBERS, {
        variables: {
          page: 0,
          limit: 20,
        //   flag:status,
        }
    });

    const [activateMember] = useMutation(ACTIVATE_USER);
    const [deactivateMember] = useMutation(DEACTIVATE_USER);

    const changeListView = () => {
        setState({
            listView: !listView,
        });
    };

    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
        const newPagination = {
            ...pagination,
            page: newPage,
        };
        setState({
            page: newPage,
        });
        fetchData(newPagination);
        
    };
  
    const handleChangeRowsPerPage = (event: any): void => {
        const newPagination = {
            ...pagination,
            rowsPerPage: event?.target?.value,
        };
        
        setState({
            rowsPerPage: event?.target?.value,
        });
        fetchData(newPagination);
        
    };

    const fetchData = async(paginationArgs = pagination) => {
        try {
             
            const apiData : any =  await fetchMore({
                variables:{
                    page: paginationArgs?.page + 1,
                    limit: paginationArgs?.rowsPerPage,
                    // flag: flag,
                }
            });
            const {data, loading, error} = apiData;
            if(data){
                setState({
                    dataArr: data?.getAllUser?.docs,
                    totalRecords: data?.getAllUser?.totalDocs,
                    pagination:{
                        rowsPerPage: data?.getAllUser?.limit,
                        page: data?.getAllUser?.page - 1,
                        totalRecords: data?.getAllUser?.totalDocs,
                    },
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

    const deactivateMemberAccount = async(id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will deactivate the selected user account, click ok to continue")){
            await deactivateMember({variables:{userID: id}});
            setState({
                alertMessage : processAlertSuccess('User account deactivated'),
                isLoading: false,
            });
            fetchData();
        }
    };

    const activateMemberAccount = async (id:number) => {
        // eslint-disable-next-line no-restricted-globals
        if(confirm("This action will activate the selected user account, click ok to continue")){
            await activateMember({variables:{userID: id}});
            setState({
                alertMessage :processAlertSuccess('User account activated'),
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

    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Members' />
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
            {!viewSingle? (
                <>
                    <div className="row  pt-4 px-4 justify-content-between"> 
                        <div className='col-md-3'>
                            <Filter
                                text="Status"
                            />
                        </div>
                        
                        <div className='col-md-12'>
                            <PageTitle text='Members List' />
                        </div>
                        
                    </div>
                        {isLoading? (
                            <>
                                <CircularLoader/>
                            </>
                        ):(
                            <>
                
                                <div className="row  py-4 px-4"> 
                                    {dataArr.map((datum: any, _i: number)=> {
                                        return(
                                            <>
                                                
                                                <div className="col-md-6">
                                                    <div className="my-2">
                                                    <UserCard
                                                        name={datum?.full_name}
                                                        active={datum?.status}
                                                        role={datum?.role}
                                                        //@ts-ignore
                                                        time={formatDate2(new Date(datum?.createdAt))}
                                                        avatar={datum?.avartar?datum?.avartar : userIcon}
                                                        disableAccount={deactivateMemberAccount}
                                                        activateAccount={activateMemberAccount}
                                                        id={datum?._id}
                                                        viewProfile={viewUserProfile}
                                                    />
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })}
                                    
                                </div>
                            </>
                        )}
                        {dataArr.length !== 0 && (
                            <>
                                <div>
                                    <Pagination
                                        count={pagination?.totalRecords}
                                        page={pagination?.page}
                                        rowsPerPage={pagination?.rowsPerPage}
                                        onPageChange={handleChangePage}
                                        handleChangeRowsPerPage={handleChangeRowsPerPage}
                                    />
                                </div>
                            </>
                        )}
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
                
            <div>
            
        </div>
       
        </>
    )

};
export default Members;