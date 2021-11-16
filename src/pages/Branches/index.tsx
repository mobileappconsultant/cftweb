import PageTitle from 'components/PageTitle';
import { EditCircle } from 'tabler-icons-react';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import TableListView from 'utilComponents/TableListView';
import Pagination from 'utilComponents/TablePagination';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import Filter from 'components/Filter';
import churchIcon from 'assets/images/church.png';
import branchIcon from 'assets/images/branch.png';
import InfoDivHeader from 'utilComponents/InfoDivHeader';
import CreateBranch from './CreateBranch';


const Branches = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:[],
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
            const response = await ApiRequestClient.get(apiRoutes.GET_ALL_BRANCHES);
    
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
        <div className="bg-white">
        <div className="row ">
            <div className="col-md-4 list-column border-right pr-0">
                <div className="p-3">
                    <Filter
                        text="Show"
                    />
                    
                </div>
                <div className="d-flex pointer justify-content-between align-items-start px-3 py-2 border-top border-bottom active-list" >
                
                    <div className="user-account pb-2 d-flex align-items-center pr-3">
                        <div className="avatar">
                            
                            <img src={churchIcon} />
                        </div>
                        <div className="user-name px-2">
                            <h6 className="m-0 name">New Branch</h6>
                            <span className="small email">03/04/2021</span>
                        </div>
                    </div>
                    <div className="justify-content-end py-0 my-0 pt-1 ">
                        <span className="border-success px-2  email text-success border-radius small">
                            active
                        </span>
                    </div>
                    
                </div>
                <div className="pointer d-flex justify-content-between align-items-start px-3 py-2 border-top border-bottom">
                
                    <div className="user-account pb-2 d-flex align-items-center pr-3">
                        <div className="avatar">
                            
                            <img src={churchIcon} />
                        </div>
                        <div className="user-name px-2">
                            <h6 className="m-0 name">New Branch</h6>
                            <span className="small email">03/04/2021</span>
                        </div>
                    </div>
                    <div className="justify-content-end py-0 my-0 pt-1 ">
                        <span className="border-success px-2 text-success border-radius small">
                            active
                        </span>
                    </div>
                    
                </div>
                <div className="d-flex justify-content-between align-items-start px-3 py-2 border-top border-bottom">
                
                    <div className="user-account pb-2 d-flex align-items-center pr-3">
                        <div className="avatar">
                            
                            <img src={churchIcon} />
                        </div>
                        <div className="user-name px-2">
                            <h6 className="m-0 name">New Branch</h6>
                            <span className="small email">03/04/2021</span>
                        </div>
                    </div>
                    <div className="justify-content-end py-0 my-0 pt-1 ">
                        <span className="border-success px-2 text-success border-radius small">
                            active
                        </span>
                    </div>
                    
                </div>
                <div>
                <Pagination
                    count={data.length?? 0}
                    page={0}
                    rowsPerPage={10}
                    onPageChange={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                </div>

            </div>
            <div className="col-md-8 pl-0">
                <div className="d-flex justify-content-between align-items-center border-bottom w-100">
                    <div className=" py-3 px-3">
                    <div className="user-account pb-1 d-flex align-items-center">
                        <div className="avatar">
                            
                            <img src={branchIcon} />
                        </div>
                        <div className="user-name px-2">
                            <h6 className="m-0 name">New Branch&nbsp;&nbsp;<span className="small font-weight-light text-success">active</span> </h6>
                            <span className="small email">03/04/2021</span>
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
                <div className=" py-4 px-3">
                    <div className="record-info-header">
                        BRANCH DETAILS 
                            <span 
                                className={` pointer edit-button mx-3`}  
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
                            text="@Meteor"
                        />
                    </div>


                </div>
                
            </div>
        </div>
        </div>
        
            
        <div>
           
            <CreateBranch
            />
                
        </div>
       
        </>
    )

};
export default Branches;