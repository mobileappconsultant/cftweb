import PageTitle from 'components/PageTitle';
import React, {useReducer} from 'react';
import { Link } from 'react-router-dom';
import { ArrowBigDown } from 'tabler-icons-react';
import FinancialSupport from './FinancialSupport';
import './requests.scss';
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
            component: <><FinancialSupport/> </>,
            title: 'Financial Support',
            count: 30
        },
        {
            path:'/requests',
            component: <> </>,
            title: 'Ride Sharing',
            count: 11
        },
        {
            path:'/requests',
            component: <> </>,
            title: 'Meeting appointment',
            count: 4
        },
        {
            path:'/requests',
            component: <> </>,
            title: 'Created Jobs',
            count: 10
        },
    ]

    return(
        <>
        <div className="col-md-12 px-0">
            <PageTitle text='Requests' />
        </div>
        <div className="d-flex bg-white px-3 pt-3 tab">
            {tabs.map((tab, index)=> {
                return (
                    <>
                        <div
                            className={`tab-title ${index !==0? 'px-3': 'pr-3'} ${activeTab === index? 'active-tab-title': '' } pointer`}
                            onClick={()=>handleTabChange(index)}
                        > 
                            {tab.title}
                            <span className="tab-count">{tab.count}</span>
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