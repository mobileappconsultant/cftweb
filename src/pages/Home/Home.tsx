import CardHeader from 'components/CardHeader';
import DashboardCard from 'components/DashboardCard';
import PageTitle from 'components/PageTitle';
import React, {useEffect, useReducer} from 'react';
import { DASHBOARD_USER_COUNT, DASHBOARD_GET_REVENUE } from 'GraphQl/Queries';
import FinancialAnalysis from './Charts/FinancialAnalysis';
import TotalRevenue from './Charts/TotalRevenue';
import { ArrowBigDown } from 'tabler-icons-react';
import { useQuery } from '@apollo/client';
import { extractErrorMessage, processAlertError } from 'utils';
import moment from 'moment';
import DateFnsUtils from '@date-io/date-fns';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';

import { Filter } from 'tabler-icons-react';
const startDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS");
const endDate = moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS");

const Home = ():JSX.Element => {
    const initialState = {
        formData: {
            totalNumberOfAdmins: 0,
            totalNumberOfActiveUsers: 0,
            totalNumberOfSuspendedUsers: 0,
        },
        amountGeneratedData:{
            totalDonations: 0,
            totalOfferings: 0,
            totalWelfare: 0
        },
        searchData:{
            endDate: null,
            startDate: null,
        },
        isLoading: false,
        alertMessage:{},
        chartLoading: false,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {fetchMore} = useQuery(DASHBOARD_USER_COUNT);
    const getDashboardRevenue = useQuery(DASHBOARD_GET_REVENUE, {
        variables:{
            startDate: startDate, 
            endDate: endDate
        }
    });

    const {formData, chartLoading, searchData, amountGeneratedData } = state;

    const fetchData = async() => {
        try {
            
            const response = await fetchMore({variables: {}});
            const {data, error} = response;
            if(data){
                const response = data?.dashboardUserCount;
               
                setState({
                    formData:{
                        totalNumberOfAdmins: response?.totalNumberOfAdmins,
                        totalNumberOfActiveUsers: response?.totalNumberOfActiveUsers,
                        totalNumberOfSuspendedUsers: response?.totalNumberOfSuspendedUsers,
                    },
                    isLoading: false,
                
                });   
            };
            if(error){
                setState({
                    alertMessage :processAlertError(extractErrorMessage(error)),
                    isLoading: false,
                })
            }
        } catch (error) {
            const errMsg = extractErrorMessage(error);
            setState({
                alertMessage :processAlertError(extractErrorMessage(errMsg)),
                isLoading: false,
            })
        }
    };

    const handleDateChange = (e:Date, name: string) => {
        setState({
              searchData: {
                  ...searchData,
                  [name]: e
              },
          });
      };

    const fetchRevenue = async (searchData: any) => {

        try {
            setState({
                chartLoading: true,
            });
            const res = await getDashboardRevenue.fetchMore({
                variables:{
                    startDate: moment(searchData?.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS"), 
                    endDate: moment(searchData?.endDate).format("YYYY-MM-DDTHH:mm:ss.SSS")
                }
            });
            const {data, error} = res;
            if(data){
                const response = data?.dashBoardGraph;
       
                setState({
                    chartLoading: false,
                    amountGeneratedData:{
                        totalDonations: response?.totalDonations,
                        totalOfferings: response?.totalOfferings,
                        totalWelfare: response?.totalWelfare
                    },
                    isLoading: false,
                
                });   
            };
            if(error){
                setState({
                    alertMessage :processAlertError(extractErrorMessage(error)),
                    isLoading: false,
                    chartLoading: false,
                })
            }
        } catch (error) {
            const errMsg = extractErrorMessage(error);
            setState({
                alertMessage :processAlertError(extractErrorMessage(errMsg)),
                isLoading: false,
            })
        }
    };

    // Fetch Admin
    useEffect(() => {
        
        // Cleanup method
        fetchData();
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);

    return(
        <>
        <div className="col-md-12 px-0">
                <PageTitle text='Dashboard' />
        </div>
        <div className="row">
           
            <div className="col-md-12 mt-4">
                <div className="card p-3">
                    <CardHeader text='User statistics' />
                    <div className="row mt-3">
                        <div className="col-md-4">
                            <DashboardCard  
                                text="Administrators" 
                                icon = {<><ArrowBigDown size={30} strokeWidth={0.8} color={'#000000'} /> </>}
                                count={formData?.totalNumberOfAdmins}
                                className="yellow" 
                            />
                        </div>
                        <div className="col-md-4">
                            <DashboardCard  
                                text="Registered Users" 
                                icon = {<><ArrowBigDown size={30} strokeWidth={0.8} color={'#ffffff'} /> </>}
                                count={formData?.totalNumberOfActiveUsers}
                                className="green" 
                            />
                        </div>
                        <div className="col-md-4">
                            <DashboardCard  
                                text="Inactive users" 
                                icon = {<><ArrowBigDown size={30} strokeWidth={0.8} color={'#ffffff'} /> </>}
                                count= {formData?.totalNumberOfSuspendedUsers}
                                className="blue" 
                            />
                        </div>
                    </div>
                    
                </div>
                
            </div>

            <div className="col-md-12 mt-5">
                <div className="card p-3">
                <div className='row'>
                  <div className='col-md-2'>
                      <div className='label-container my-2'>
                          <label>Start Date </label>
                      </div>
                      <div className=''>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                              variant="inline"
                              inputVariant="outlined"
                              value={searchData?.startDate}
                              // @ts-ignore
                              onChange={(e)=>handleDateChange(e, 'startDate')}
                              size='small'
                              format="MM/dd/yyyy"
                              autoOk
                          />
                          </MuiPickersUtilsProvider>
                      </div>
                  </div>
                  <div className='col-md-2'>
                      <div className='label-container my-2'>
                          <label>End Date </label>
                      </div>
                      <div className=''>
                          <MuiPickersUtilsProvider utils={DateFnsUtils}>
                          <DatePicker
                              variant="inline"
                              inputVariant="outlined"
                              value={searchData?.endDate}
                              // @ts-ignore
                              onChange={(e)=>handleDateChange(e, 'endDate')}
                              size='small'
                              format="MM/dd/yyyy"
                              autoOk
                          />
                          </MuiPickersUtilsProvider>
                      </div>
                  </div>
                  <div className='col-md-2'>
                      <br />
                      <button className='mt-3 p-2 px-3 filter-btn' onClick={()=>fetchRevenue(searchData)}>
                          {!chartLoading? (
                              <>
                                  <Filter size={15} strokeWidth={2} color={'white'} />  Filter
                              </>
                          ):(
                              <>...Loading</>
                          )}
                          
                      </button>
                  </div>
                </div>
                    {/* @ts-ignore */}
                    <TotalRevenue data={amountGeneratedData} date={searchData} />
                </div>
                
            </div>
        </div>
        </>
    )

};
export default Home;