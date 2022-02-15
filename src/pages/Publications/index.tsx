
import PageTitle from 'components/PageTitle';
import React, {useReducer} from 'react';
import './publications.scss';

import { extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError } from 'utils';
import Prayers from './ApostleDesk/Prayers';

// icons
import apostleDeskIcon from 'assets/images/newspaper-folding.svg';
import sermonsIcon from 'assets/images/entertainment.svg';
import bibleStudyIcon from 'assets/images/book-one.svg';
import dailyBibleReadingIcon from 'assets/images/sunny.svg';
import pastorForumIcom from 'assets/images/peoples-two.svg';
import ApostleDesk from './ApostleDesk';
import Sermons from './Sermons';
import BibleStudy from './BibleStudy';

const Publications = ():JSX.Element => {
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
            icon: apostleDeskIcon,
            component: <> <ApostleDesk/> </>,
            title: 'Apostle’s desk',
        },
        {
            path:'/requests',
            icon: sermonsIcon,
            component: <><Sermons /></>,
            title: 'Sermons',
        },
        {
            path:'/requests',
            icon: bibleStudyIcon,
            component: <div className='bible-study'><BibleStudy /></div>,
            title: 'Bible study',
        },
        {
            path:'/requests',
            icon: dailyBibleReadingIcon,
            component: <><Prayers /></>,
            title: 'Daily bible reading',
        },
        {
            path:'/requests',
            icon: pastorForumIcom,
            component: <><Prayers /></>,
            title: 'Pastors forum',
        }

    ]

    return(
        <>
        <div className="col-md-12 px-0">
            <PageTitle text='Publications' />
        </div>
        <div className="d-flex justify-content-between bg-white px-3 pt-3  tab border-bottom">
            {tabs.map((tab, index)=> {
                return (
                    <>
                        <div
                            className={`tab-title d-flex align-items-center  ${index !==0? 'px-3': 'pr-3'} ${activeTab === index? 'active-tab-title': 'text-muted' } pointer `}
                            onClick={()=>handleTabChange(index)}
                        > 
                            <div className='svg-container'>
                            <img src={tab?.icon} className='svg-icon'/> &nbsp;
                            </div>
                            
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
export default Publications;