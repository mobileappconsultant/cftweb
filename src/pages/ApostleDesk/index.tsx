import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import TableListView from 'utilComponents/TableListView';
import Pagination from 'utilComponents/TablePagination';
import { history } from 'helpers';
import Badges from 'utilComponents/Badges';
import CreateApostleEvent from './CreateEvent';
import CircularLoader from 'utilComponents/Loader';
import { useQuery } from '@apollo/client';
import { GET_ALL_MESSAGES } from 'GraphQl/Queries';
import { extractErrorMessage, processAlertError } from 'utils';

const ApostleDesk = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:10,
        page:0,
        alertMessage:{},
        dataArr:[],
        isLoading:false,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

    const {listView, page, isLoading, rowsPerPage, alertMessage,  showEditModal, dataArr} = state;
    const { data, loading, error } = useQuery(GET_ALL_MESSAGES);

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
                dataArr: data?.getMessages,
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
            <PageTitle text='Apostle Desk' />
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
            <CircularLoader />
        ):(
            <>
                <div className="bg-white">
                <div className="row  py-4 px-4"> 
                    {paginateData?.map((datum: any, _i: number)=> {
                        return(
                            <>
                                <div className="col-md-12">
                                    <div className="my-2 pointer" onClick={()=> history.push(`/apostle-desk/${datum?._id}`)}>
                                        <div className={`card user-card w-100 p-3 mb-3`}>   
                                            <div className="d-flex align-items-center">
                                                <div className="">
                                                    {/* <img src={'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ9w0saWFIE2jx_cm1gw3t6qTOaK5P9-IocLhNhsCiIwPQcBPCO_tGDHg7K_Ym79vkP4Is&usqp=CAU'} className="user-profile-img" /> */}
                                                </div>
                                                <div className="user-details w-100">
                                                    <div className="name mb-1">{datum?.topic}</div>
                                                    <div className="d-flex justify-content-between w-100">
                                                        <div className="user-name w-90">{datum?.description}</div>
                                                        <div>
                                                            {datum?.status? (
                                                                <Badges
                                                                    text="Active"
                                                                    type="success"
                                                                />
                                                            ):(
                                                                <Badges
                                                                    text="Not active"
                                                                    type="pending"
                                                                />
                                                            )}
                                                            
                                                        </div>
                                                    </div>
                                                    
                                                    <div className="small user-name text-muted mt-2">{datum?.release_date}</div>
                                                </div>
                                            </div>
                                        
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                    })}
                    
                </div>

                <Pagination
                    count={dataArr.length?? 0}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    onPageChange={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                </div>
                    
                <div>
                    <CreateApostleEvent
                        addAlert={addAlert}
                    />
                </div>
            </>
        )}
        
       
        </>
    )

};
export default ApostleDesk;