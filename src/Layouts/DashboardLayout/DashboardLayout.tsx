import React, {useReducer} from 'react';
import logo from 'assets/images/logo.png';
import './dashboardLayout.scss';
import { sideBarRoutes } from './sidebarLinks';
import { BellRinging } from 'tabler-icons-react';
import { Link } from 'react-router-dom';
const DashboardLayout = (props: any): JSX.Element => {
    
    return(
        <>
        <div className="sidebar">
        <div className="logo-details">
            <div className="px-2">
                <img src={logo} />
            </div>
        </div>
        <div className="d-flex align-content-between flex-wrap px-3 overflow-auto sidebar-nav-content">
        <div className="user-account mt-4 pt-2 d-flex align-items-center">
            <div className="avatar">
                <img src="https://mdbootstrap.com/img/Photos/Avatars/img%20(3).jpg" />
            </div>
            <div className="user-name px-2">
                <h6 className="m-0 name">Sierra Ferguson</h6>
                <span className="small email">s.ferguson@gmail.com</span>
            </div>
        </div>
        {sideBarRoutes.map((route, index) =>{
            return(
                <>
                    <div className="w-100 sidebar-section-title py-2 mt-3">
                        {route?.title}
                    </div>
                    {route.children.map((routeChild, _i) => {
                        return(
                            <>
                                <div className="w-100 sidebar-section-link py-2 px-2 ">
                                    <Link to={routeChild.path} className="sidebar-navlink">
                                        {routeChild?.icon}  {routeChild?.text}
                                    </Link>
                                </div>
                            </>
                        );
                    })}
                </>
            );
        })}
      
        </div>

    
  </div>
  <section className="home-section">
    <nav className="navbar navbar-expand-lg navbar-light bg-light py-3 px-3">
        <div className='d-flex justify-content-end w-100'>
            <BellRinging
                size={30}
                strokeWidth={1}
                color={'#000000'}
            />
        </div>
    </nav>
      <div className="mt-5 px-4">
        {props.children}
      </div>
  </section>
            
        </>
    )
};

export default DashboardLayout;