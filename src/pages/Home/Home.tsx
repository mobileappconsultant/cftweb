import CardHeader from 'components/CardHeader';
import DashboardCard from 'components/DashboardCard';
import PageTitle from 'components/PageTitle';
import React, {useReducer} from 'react';
import { Link } from 'react-router-dom';
import FinancialAnalysis from './Charts/FinancialAnalysis';
import TotalRevenue from './Charts/TotalRevenue';
import { ArrowBigDown } from 'tabler-icons-react';

const Home = ():JSX.Element => {


    return(
        <>
        <div className="col-md-12 px-0">
                <PageTitle text='Dashboard' />
        </div>
        <div className="row">
            
            <div className="col-md-8">
                <div className="card p-3">
                    <TotalRevenue />
                </div>
                
            </div>
            <div className="col-md-4">
                <div className="card p-3">
                    <FinancialAnalysis />
                </div>
                
            </div>
            <div className="col-md-8 mt-4">
                <div className="card p-3">
                    <CardHeader text='App Performance' />
                    <div className="row mt-3">
                        <div className="col-md-4">
                            <DashboardCard  
                                text="Guest Users" 
                                icon = {<><ArrowBigDown size={30} strokeWidth={0.8} color={'#000000'} /> </>}
                                count="20"
                                className="yellow" 
                            />
                        </div>
                        <div className="col-md-4">
                            <DashboardCard  
                                text="Registered Users" 
                                icon = {<><ArrowBigDown size={30} strokeWidth={0.8} color={'#ffffff'} /> </>}
                                count="40"
                                className="green" 
                            />
                        </div>
                        <div className="col-md-4">
                            <DashboardCard  
                                text="Inactive users" 
                                icon = {<><ArrowBigDown size={30} strokeWidth={0.8} color={'#ffffff'} /> </>}
                                count="10"
                                className="blue" 
                            />
                        </div>
                    </div>
                    
                </div>
                
            </div>

            <div className="col-md-4 mt-4">
                <div className="card p-3">
                    <CardHeader text='Unresloved requests' />
                    <div className="row mt-3 border-bottom">
                        <div className="col-md-9">
                           <p>Appointment requests</p>
                        </div>
                        <div className="col-md-3 ">
                           <p className='text-muted text-right'>1005</p>
                        </div>
                        
                    </div>
                    <div className="row mt-3 border-bottom">
                        <div className="col-md-9">
                           <p>Support Requests</p>
                        </div>
                        <div className="col-md-3">
                           <p className='text-muted'>100</p>
                        </div>
                        
                    </div>
                    <div className="row mt-3 border-bottom">
                        <div className="col-md-9">
                           <p>Ride Sharing requests</p>
                        </div>
                        <div className="col-md-3">
                           <p className='text-muted'>5</p>
                        </div>
                        
                    </div>
                    
                </div>
                
            </div>
        </div>
        </>
    )

};
export default Home;