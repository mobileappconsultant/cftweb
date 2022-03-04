import React, {useReducer, useEffect, Fragment } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SINGLE_GROUP } from 'GraphQl/Queries';
import { extractErrorMessage, formatInitialDateValue, processAlertError } from 'utils';
import { DivLoader } from 'utilComponents/Loader';
import InfoDivHeader from 'utilComponents/InfoDivHeader';
import { EditCircle, UserPlus } from 'tabler-icons-react';
import EditGroup from '../EditGroup';
import branchIcon from 'assets/images/branch.png';
import TableComponent from 'utilComponents/Table';
import { GROUP_MEMBERS_HEADERS } from 'constants/tableHeaders';
import {TableRow, TableCell, Tooltip} from '@mui/material';
import CreateButton from 'utilComponents/CreateButton';
import AddUserToGroup from './AddUserToGroup';

const ViewGroup = (props:any): JSX.Element => {
    const initialState = {
        isLoading: true,
        alertMessage:{},
        groupData:{},
        showEditModal: false,
        showAddUserModal: false,
        
    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {groupData, isLoading, showEditModal, showAddUserModal } = state;
    const { data, loading, error } = useQuery(GET_SINGLE_GROUP, {
        variables: { groupId: props?.group?._id}
    });
   
    useEffect(() => {
        if(data){
            setState({
                groupData: data?.getGroup || {},
              
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

    const toggleAddUserModal = () => {
        setState({
            showAddUserModal: !showAddUserModal,
        });
    };

    const addAlert = (alert:any) => {
        setState({
            alertMessage: alert,
        });
    };
   
    return(
        <>
        {isLoading? (
            <>
                <DivLoader />
            </>
        ):(
            <>
                 <div className="d-flex justify-content-between align-items-center border-bottom w-100">
                        <div className=" py-3 px-3">
                        <div className="user-account pb-1 d-flex align-items-center">
                            <div className="avatar">
                                
                                <img src={branchIcon} />
                            </div>
                            <div className="user-name px-2">
                                <h6 className="m-0 name">{groupData?.name}&nbsp;&nbsp;<span className="small font-weight-light text-success">active</span> </h6>
                                <span className="small email">{formatInitialDateValue(groupData?.createdAt)}</span>
                            </div>
                        </div>
                        </div>
                        <div className="px-3">
                            <div className="view-component-right-header m-0 p-0">
                                100,000
                            </div>
                            <div className="user-name">
                                <span className="small email">Group members</span>
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
                                    <h6 className="m-0 name">{groupData?.group_head}</h6>
                                    <span className="small email">Pastor</span>
                                </div>
                            </div>
                            <div className="">
                                
                                <div className="user-name">
                                    <span className="small email pointer text-primary">View profile</span>
                                </div>
                                
                            </div>
                    </div>
                    <div className="record-info-header">
                        GROUP DETAILS 
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
                </div>
                <div className='mx-3'>
                <div className='mb-3 text-right'>
                    <div className="col-md-12 p-0 d-flex justify-content-end">
                        <Tooltip title="Add users to group" placement="right-start" arrow className='mx-3'>
                            <span 
                                className={` pointer edit-button`}  
                                onClick={toggleAddUserModal}
                            >   
                                <UserPlus
                                    className="button-icon"
                                    size={20}
                                    strokeWidth={1.5}
                                    color={'#FFF'}
                                />
                            </span>
                        </Tooltip>
                    </div>
                </div>
                <TableComponent
                  
                    columns={GROUP_MEMBERS_HEADERS}
                >
                    {groupData?.members.map((member:any, index:number) => {
                        const {email, phone, branch} = member;
                        return(
                            <Fragment key={index}>
                                <TableRow>
                                    <TableCell>
                                        {index + 1}
                                    </TableCell>
                                    <TableCell>
                                        {member?.full_name}
                                    </TableCell>
                                    <TableCell>
                                        {email}
                                    </TableCell>
                                    <TableCell>
                                        {phone}
                                    </TableCell>
                                    <TableCell>
                                        {branch}
                                    </TableCell>
                                    <TableCell>
                                        {member?.country}
                                    </TableCell>
                                    <TableCell>
                                        {member?.status? 'Active': 'Not active'}
                                    </TableCell>
                                    
                                </TableRow>
                            </Fragment>
                        )
                    })}
                </TableComponent>
                </div>
                
            </>
        )}
        {showAddUserModal && (
            <>
                <AddUserToGroup
                     showModal={showAddUserModal}
                     toggleModal={toggleAddUserModal}
                     groupId={props?.group?.id}
                     addAlert={addAlert}
                />
            </>
        )}
        </>
    )
};
export default ViewGroup;