// import PageTitle from 'components/PageTitle';
// import React, {useReducer, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import AlertComponent from 'components/AlertComponent';
// import TableListView from 'utilComponents/TableListView';
// import Pagination from 'utilComponents/TablePagination';
// import { history } from 'helpers';
// import Badges from 'utilComponents/Badges';
// import CreateApostleEvent from './CreateEvent';
// import CircularLoader from 'utilComponents/Loader';
// import { useQuery } from '@apollo/client';
// import { GET_ALL_MESSAGES } from 'GraphQl/Queries';
// import { extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError } from 'utils';
// import InfoDivHeader from 'utilComponents/InfoDivHeader';

// const ApostleDesk = ():JSX.Element => {
//     const initialState = {
//         listView: true,
//         rowsPerPage:10,
//         page:0,
//         alertMessage:{},
//         dataArr:[],
//         isLoading:false,
//     };

//     const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);

//     const {listView, page, isLoading, rowsPerPage, alertMessage,  showEditModal, dataArr} = state;
//     const { data, loading, error } = useQuery(GET_ALL_MESSAGES);

//     const changeListView = () => {
//         setState({
//             listView: !listView,
//         });
//     };

//     const handleChangePage = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, newPage: number): void => {
//         setState({
//             page: newPage,
//         });
//     };
  
//     const handleChangeRowsPerPage = (event: any): void => {

//         const splicedIndex = page * rowsPerPage;
//         let spilceStop = rowsPerPage+ splicedIndex;
        
//         if(spilceStop >= dataArr.length){
//             return;
//         }
//         setState({
//             rowsPerPage: event?.target?.value,
//         });
      
//     };
//     const handleAlertClose = () => {
//         setState({
//             alertMessage:{},
//         });
//     };

//     const addAlert = (alertObj:{text: string, type: string}) => {
//         setState({
//             alertMessage: alertObj,
//         });
//     };

//     useEffect(() => {
//         if(data){
//             setState({
//                 dataArr: data?.getMessages,
//             });
           
//         };
//         if(!loading){
//             setState({
//                 isLoading: false,
//             });
//         };

//         if(error){
            
//             setState({
//                 alertMessage :processAlertError(extractErrorMessage(error)),
//             })
//         }

//         // Cleanup method
//         return () => {
//             setState({
//                 ...initialState,
//             });
//         };
//     }, [data]);
    
    
//     const paginatedData = (dataArr:any) => {
//         const splicedIndex = page * rowsPerPage;
//         let spilceStop = rowsPerPage+ splicedIndex;
//         const newArr = dataArr.slice(splicedIndex, spilceStop);
        
//         return newArr;

//     };
//     const paginateData = paginatedData(dataArr);

   
//     return(
//         <>
//         <div className="row justify-content-between align-items-end">
//         <div className="col-md-6">
//             <PageTitle text='Apostle Desk' />
//         </div>
//         <div className="col-md-6 d-flex justify-content-end">
//             <TableListView
//                 isActive={listView}
//                 actionEvent={changeListView}
//             />
//         </div>
//         </div>
//         {alertMessage?.text && (
//             <>
//                 <AlertComponent
//                     text={alertMessage.text}
//                     type={alertMessage.type}
//                     onClose={handleAlertClose}
//                 />
//             </>
//         )}
//         {isLoading? (
//             <CircularLoader />
//         ):(
//             <>
//                 <div className="bg-white">
//                 <div className="row  py-4 px-4"> 
//                     {paginateData?.map((datum: any, _i: number)=> {
                       
//                         return(
//                             <>
//                                 <div className="col-md-12">
//                                     <div className="my-2 pointer" onClick={()=> history.push(`/apostle-desk/${datum?._id}`)}>
//                                         <div className={`card user-card w-100 p-3 mb-3`}>   
//                                             <div className="d-flex align-items-center">
                                               
//                                                 <div className="user-details w-100">
//                                                     <div className="name mb-1">{datum?.title}</div>
//                                                     <div className="d-flex justify-content-between w-100">
//                                                         <div className="user-name w-90">{datum?.message}</div>
//                                                         <div>
//                                                             {datum?.status? (
//                                                                 <Badges
//                                                                     text="Published"
//                                                                     type="success"
//                                                                 />
//                                                             ):(
//                                                                 <Badges
//                                                                     text="Not&nbsp;published"
//                                                                     type="pending"
//                                                                 />
//                                                             )}
                                                            
//                                                         </div>
//                                                     </div>
//                                                     <div className='d-flex justify-content-between align-items-center'>
//                                                        <div className='pt-2 d-flex  justify-content-between w-25'>
//                                                            <div className='mr-4'>
//                                                                 <h6 className='small'>
//                                                                     Date created
//                                                                 </h6>
//                                                                 <p className='small user-name'>
//                                                                     {formatDate(datum?.createdAt)}
//                                                                 </p>
//                                                            </div>
                                                           
//                                                            <div className='ml-4'>
//                                                                 <h6 className='small'>
//                                                                     Date published
//                                                                 </h6>
//                                                                 <p className='small user-name'>
//                                                                     {formatDate(getDateFromWeek(datum?.weekPublished, datum?.yearPublished))}
//                                                                 </p>
//                                                            </div>
//                                                        </div>
//                                                         <div className=''>
//                                                             <div className="user-account pt-2 d-flex align-items-center justify-content-end">
//                                                                 <div className="avatar mx-auto">
//                                                                     <img src="https://cdn-icons-png.flaticon.com/512/703/703271.png" />
//                                                                 </div>

                                                                
//                                                             </div>
//                                                             <div className="user-account pt-2 d-flex align-items-center justify-content-end">
//                                                                 <div className="user-name px-2">
//                                                                         <h6 className="m-0 name">{datum?.minister}</h6>
                                                                        
//                                                                 </div>
//                                                             </div>
//                                                         </div>
//                                                     </div>
                                                    
//                                                 </div>
//                                             </div>
                                        
//                                         </div>
//                                     </div>
//                                 </div>
//                             </>
//                         );
//                     })}
                    
//                 </div>

//                 <Pagination
//                     count={dataArr.length?? 0}
//                     page={page}
//                     rowsPerPage={rowsPerPage}
//                     onPageChange={handleChangePage}
//                     handleChangeRowsPerPage={handleChangeRowsPerPage}
//                 />
//                 </div>
                    
//                 <div>
//                     <CreateApostleEvent
//                         addAlert={addAlert}
//                     />
//                 </div>
//             </>
//         )}
        
       
//         </>
//     )

// };
// export default ApostleDesk;

import PageTitle from 'components/PageTitle';
import React, {useReducer} from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigDown } from 'tabler-icons-react';
import './apostle_desk.scss';
import Messages from './Messages';
import { extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError } from 'utils';
import Badges from 'utilComponents/Badges';
import { history } from 'helpers';
const Requests = ():JSX.Element => {
    const initialState = {
        activeTab: 0,
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {activeTab} = state;
    const handleTabChange = (tabIndex: number):void => {
        setState({
            activeTab: tabIndex,
        });
    };

    const tabs = [
        {
            path:'/requests',
            component: <> <Messages/> </>,
            title: 'Messages',
        },
        {
            path:'/requests',
            component: <></>,
            title: 'Prayers',
        },
        {
            path:'/requests',
            component: <> </>,
            title: 'Daily prayers',
        }
    ]

    return(
        <>
        <div className="col-md-12 px-0">
            <PageTitle text='Apostle desk' />
        </div>
        <div className="d-flex bg-white px-3 pt-3  tab border-bottom">
            {tabs.map((tab, index)=> {
                return (
                    <>
                        <div
                            className={`tab-title d-flex align-items-center  ${index !==0? 'px-3': 'pr-3'} ${activeTab === index? 'active-tab-title': 'text-muted' } pointer `}
                            onClick={()=>handleTabChange(index)}
                        > 
                            {tab.title}
                            
                        </div>
                        
                    </>
                )
            })}
        </div>
        <div className="bg-white">
            {tabs[activeTab].component}
        </div>
       
       
        </>
    )

};
export default Requests;