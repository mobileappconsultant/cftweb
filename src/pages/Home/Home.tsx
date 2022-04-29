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

const Home = ():JSX.Element => {
    const initialState = {
        formData: {
            totalNumberOfAdmins: 0,
            totalNumberOfActiveUsers: 0,
            totalNumberOfSuspendedUsers: 0,
        },
        isLoading: false,
        alertMessage:{},

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {fetchMore} = useQuery(DASHBOARD_USER_COUNT);
    const getDashboardRevenue = useQuery(DASHBOARD_GET_REVENUE, {variables:{
        startDate: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS"), 
        endDate: moment(new Date()).format("YYYY-MM-DDTHH:mm:ss.SSS")
    }});
    const {formData} = state;

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

    const fetchRevenue = async (searchData: any) => {

        try {
            
            const response = await getDashboardRevenue.fetchMore({
                variables:{
                    startDate: moment(searchData?.startDate).format("YYYY-MM-DDTHH:mm:ss.SSS"), 
                    endDate: moment(searchData?.endDate).format("YYYY-MM-DDTHH:mm:ss.SSS")
                }
            });
            const {data, error} = response;
            if(data){
                const response = data?.dashBoardGraph;
                console.log(response);
               
                // setState({
                //     formData:{
                //         totalNumberOfAdmins: response?.totalNumberOfAdmins,
                //         totalNumberOfActiveUsers: response?.totalNumberOfActiveUsers,
                //         totalNumberOfSuspendedUsers: response?.totalNumberOfSuspendedUsers,
                //     },
                //     isLoading: false,
                
                // });   
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
                    {/* @ts-ignore */}
                    <TotalRevenue getPaymentMethodStat={fetchRevenue} />
                </div>
                
            </div>
        </div>
        </>
    )

};
export default Home;