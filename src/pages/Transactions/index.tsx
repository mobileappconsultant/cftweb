import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect} from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import Pagination from 'utilComponents/TablePagination';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes } from 'constants/index';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import arrowLeftIcon from 'assets/images/arrow-left.png';
import arrowRightIcon from 'assets/images/arrow-right.png';
import donationsIcon from 'assets/images/donations.png';
import titheIcon from 'assets/images/people.png';
import salesIcon from 'assets/images/shopping-bag.png';
import Badges from 'utilComponents/Badges';

function createData(transId:String, type:String, username: any, phone: any, method: any, date: any, status: any, amount: any) {
  return {transId, type, username, phone, method, date, status, amount };
}

const rows = [
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),
  createData('#DON1002','Donation', 'Phil','+445924902392', 'TrueLayer', '05/10/2019', 'pending' ,'$2,350.00'),

];

 function BasicTable():JSX.Element {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell className="table-th">Transaction ID</TableCell>
            <TableCell align="left" className="table-th">Type</TableCell>
            <TableCell align="left" className="table-th">Username</TableCell>
            <TableCell align="left" className="table-th">Phone&nbsp;No.</TableCell>
            <TableCell align="left" className="table-th">Method</TableCell>
            <TableCell align="left" className="table-th">Date</TableCell>
            <TableCell align="left" className="table-th">Status</TableCell>
            <TableCell align="left" className="table-th">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {rows.map((row) => (
            <TableRow
            //   key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.transId}
              </TableCell>
              <TableCell align="left">{row.type}</TableCell>
              <TableCell align="left">{row.username}</TableCell>
              <TableCell align="left">{row.phone}</TableCell>
              <TableCell align="left">{row.method}</TableCell>
              <TableCell align="left">{row.date}</TableCell>
              <TableCell align="left">
                    <Badges
                        text="Pending"
                        type="pending"
                    />
                </TableCell>
              <TableCell align="left">{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

const Transactions = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        activeReportComponent: 0,
        data:[
            
        ],
        openChart: false,
        
    };
   

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, activeReportComponent, openChart, alertMessage, data} = state;

    const changeListView = () => {
        setState({
            listView: !listView,
        });
    };

    const openCharts = () => {
        setState({
                ...state,
              openChart: !openChart,
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

    const reportCardsAndComponents = () => {
        return [
            {
                name: 'Donations',
                amount: '£1585.00',
                icon: donationsIcon,
            },
            {
                name: 'Tithe',
                amount: '£1585.00',
                icon: titheIcon,
            },
            {
                name: 'Sales',
                amount: '£1585.00',
                icon: salesIcon,
            },
        ]
    };
    const dashBoardCards = reportCardsAndComponents();
   
    return(
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text='Latest Transactions' />
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
            <div className="d-flex justify-content-between py-3 ">
                <div className={`${openChart? 'col-md-7': 'col-md-10'} openchart bg-white d-flex justify-content-between px-0 `}>
                    <div className="py-3 px-2 w-96">
                        <BasicTable />
                        <Pagination
                            count={data.length?? 0}
                            page={0}
                            rowsPerPage={10}
                            onPageChange={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </div>
                    <div className=" table-toggle  px-2 d-flex align-items-center pointer w-4" onClick={()=> openCharts()}>
                        <img src={`${openChart? arrowRightIcon : arrowLeftIcon}`} className={`flip`}/>
                    </div>

                </div>
                {openChart && (
                    <div className={`transaction-chart ${openChart? 'col-md-5 px-3': 'col-md-2'}`}>
                        <div className="transaction-chart-visible row">
                            {dashBoardCards.map((item, index) => {
                                return(
                                    <>
                                        <div className="col-md-4">
                                            <div className={`card p-2 text-center ${activeReportComponent === index? 'active-transaction-card':''}`}>
                                                <div className="mx-auto text-white">
                                                    <img src={item?.icon} width="40"/>
                                                </div>
                                                <div className="mt-1">
                                                    {item?.amount}
                                                </div>
                                                <span className="text-white small">
                                                    {item?.name}
                                                </span>
                                                
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                )}
                
            </div>
        </div>
            
        </>
    )

};
export default Transactions;