import PageTitle from 'components/PageTitle';
import { EditCircle } from 'tabler-icons-react';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import TableListView from 'utilComponents/TableListView';
import Pagination from 'utilComponents/TablePagination';
import Filter from 'components/Filter';
import branchIcon from 'assets/images/branch.png';
import InfoDivHeader from 'utilComponents/InfoDivHeader';
import CreateBranch from './CreateBranch';
import EditBranch from './EditBranch';
import MakeSelection from 'utilComponents/MakeSelectionIcon';
import ViewBranch from './ViewBranch';
import { extractErrorMessage, formatDate2, formatInitialDateValue, processAlertError } from 'utils';
import CircularLoader from 'utilComponents/Loader';
import Badges from 'utilComponents/Badges';
import { useQuery } from '@apollo/client';
import { GET_ALL_BRANCHES } from 'GraphQl/Queries';


const Branches = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        dataArr:[],
        activeDataObj:{},
        showEditModal: false,
        isLoading: true,
    };
   
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, isLoading, activeDataObj, alertMessage,  showEditModal, dataArr} = state;
    const { data, loading, error } = useQuery(GET_ALL_BRANCHES);
    
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

    const fetchData = async () => {};

    useEffect(() => {
        if(data){
            setState({
                dataArr: data?.getAllBranch,
                activeDataObj: data?.getAllBranch? data?.getAllBranch[0] : {},
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


    const toggleEditModal = () => {
        setState({
            showEditModal: !showEditModal,
        });
    };

    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Branches' />
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
            <>
            
                <CircularLoader/>
            </>
        ):(
            <>
        <div className="bg-white">
        <div className="row ">
            <div className="col-md-4 list-column border-right pr-0">
                <div className="p-3">
                    <Filter
                        text="Show"
                    />
                    
                </div>
                {dataArr?.map((datum:any,_i:number) =>{
                    return(
                        <>
                            <div 
                                className={`
                                    d-flex pointer justify-content-between 
                                    align-items-start px-3 py-2 border-top border-bottom 
                                    ${activeDataObj?._id === datum?._id? 'active-list':''}`
                                }
                                onClick={()=> setState({...state, activeDataObj: datum})}
                            >
                
                                <div className="user-account pb-2 d-flex align-items-center pr-3">
                                    <div className="avatar">
                                        
                                        <img src={branchIcon} />
                                    </div>
                                    <div className="user-name px-2">
                                        <h6 className="m-0 name">{datum?.name}</h6>
                                        <span className="small email">{formatDate2(new Date(datum?.createdAt))}</span>
                                    </div>
                                </div>
                                <div className="justify-content-end py-0 my-0 pt-1 ">
                                    <Badges
                                        type="success"
                                        text="Active"
                                    />
                                   
                                </div>
                                
                            </div>
                        </>
                    )
                })}
                
                <div>
                <Pagination
                    count={dataArr?.length?? 0}
                    page={0}
                    rowsPerPage={10}
                    onPageChange={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                </div>

            </div>
            <div className="col-md-8 pl-0">
                {activeDataObj?._id? (
                    <>
                    <div className="d-flex justify-content-between align-items-center border-bottom w-100">
                        <div className=" py-3 px-3">
                        <div className="user-account pb-1 d-flex align-items-center">
                            <div className="avatar">
                                
                                <img src={branchIcon} />
                            </div>
                            <div className="user-name px-2">
                                <h6 className="m-0 name">{activeDataObj?.name}&nbsp;&nbsp;<span className="small font-weight-light text-success">active</span> </h6>
                                <span className="small email">{formatInitialDateValue(activeDataObj?.createdAt)}</span>
                            </div>
                        </div>
                        </div>
                        <div className="px-3">
                            <div className="view-component-right-header m-0 p-0">
                                100,000
                            </div>
                            <div className="user-name">
                                <span className="small email">Branch members</span>
                            </div>
                            
                        </div>
                </div>
                <div className="pt-2 pb-4 px-3 mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-2 w-100">
                            <div className="user-account  d-flex align-items-center">
                                <div className="avatar">
                                    <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" />
                                </div>
                                <div className="user-name px-2">
                                    <h6 className="m-0 name">{activeDataObj?.branch_president}</h6>
                                    <span className="small email">Senior pastor</span>
                                </div>
                            </div>
                            <div className="">
                                
                                <div className="user-name">
                                    <span className="small email pointer text-primary">View profile</span>
                                </div>
                                
                            </div>
                    </div>
                    <div className="record-info-header">
                        BRANCH DETAILS 
                            <span 
                                className={` pointer edit-button mx-3`}  
                                onClick={toggleEditModal}
                            >   
                                <EditCircle
                                    className="button-icon"
                                    size={20}
                                    strokeWidth={1.5}
                                    color={'#FFF'}
                                />
                            </span>
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="PHONE NUMBER"
                            text="09067980987"
                        />
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="ADDRESS"
                            text="32a Charlseton Close, off Priya Road"
                        />
                    </div>
                    <div className="my-3">
                        <InfoDivHeader
                            label="BRANCH HEAD"
                            text={activeDataObj?.branch_president}
                        />
                    </div>

                    {/* <ViewBranch
                        branch={activeDataObj}
                    /> */}
                </div>
                    </>
                ):(
                    <div className="mt-5 mb-3">
                        <MakeSelection />
                    </div>
                )}
                
            </div>
        </div>
        </div>
        
            
        <div>
           
            <CreateBranch
                refresh={fetchData}
                addAlert={addAlert}
            />
            {showEditModal && (
                <EditBranch 
                    branch={activeDataObj}
                    show={showEditModal}
                    toggleModal={toggleEditModal}
                />
            )}
                
        </div>
        </>
           )}
        </>
    )

};
export default Branches;