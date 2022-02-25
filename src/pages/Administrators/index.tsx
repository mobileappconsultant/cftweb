
import PageTitle from 'components/PageTitle';
import React, {useReducer} from 'react';

// icons
import apostleDeskIcon from 'assets/images/newspaper-folding.svg';
import sermonsIcon from 'assets/images/entertainment.svg';
import { Lock, Users } from 'tabler-icons-react';
import AdministratorsList from './AdminLists';
import Roles from './Roles';



const Administrators = ():JSX.Element => {
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
            icon: <Users size={24} strokeWidth={2} color={'black'} />,
            component: <> <AdministratorsList/> </>,
            title: 'Administrators',
        },
        {
            path:'/requests',
            icon: <Lock size={24} strokeWidth={2} color={'black'} />,
            component: <><Roles /> </>,
            title: 'Roles',
        }

    ]

    return(
        <>
        <div className="col-md-12 px-0">
            <PageTitle text='Administrators' />
        </div>
        <div className="d-flex  bg-white px-3 pt-3  tab border-bottom">
            {tabs.map((tab, index)=> {
                return (
                    <>
                        <div
                            className={`tab-title d-flex align-items-center  ${index !==0? 'px-3': 'pr-3'} ${activeTab === index? 'active-tab-title': 'text-muted' } pointer `}
                            onClick={()=>handleTabChange(index)}
                        > 
                            <div className=''>
                            {tab.icon}&nbsp;
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
export default Administrators;
