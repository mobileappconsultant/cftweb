import React, {useReducer} from 'react';
import logoImage from 'assets/images/christ_faith_logo.svg';
import footerLogo from 'assets/images/footer_logo.svg';
import facebookLogo from 'assets/images/facebook.svg';
import instagramLogo from 'assets/images/instagram.svg';
import youtubeLogo from 'assets/images/youtube.svg';
import twitterLogo from 'assets/images/twitter.svg';
import { Link } from 'react-router-dom';

import './legal_layout.scss';
const LegalLayout = (props: any): JSX.Element => {
    
    const getMatch = (item:any) => {
        if(window.location.pathname.match(item)){
          return true;
        }
        return false;
    };
    return(
       <div className='legal-layout p-0 m-0'>
        <header>
            <nav className='d-flex align-items-end justify-content-between'>
                <div className='logo-container'>
                    <img src={logoImage} alt="Christ Faith Church"/>
                </div>
                <ul className='d-flex'>
                    <li>
                        <Link to="/privacy-policy" className={`${getMatch(/^\/privacy-policy/)? 'active-nav': 'non-active-nav'}`}>Privacy Policy</Link>
                    </li>  
                    <li>
                     
                        <Link to="/declaration-of-faith" className={`${getMatch(/^\/declaration-of-faith/)? 'active-nav': 'non-active-nav'}`}>Declaration of Faith</Link>
                    </li>
                    <li>
                     
                        <Link to="/terms-and-conditions" className={`${getMatch(/^\/terms-and-conditions/)? 'active-nav': 'non-active-nav'}`}>Terms and conditions</Link>
                    </li>
                    <li>
                     
                        <Link to="/support" className={`${getMatch(/^\/support/)? 'active-nav': 'non-active-nav'}`}>Support</Link>
                    </li>
                </ul>
            </nav>
        </header>
            <div className='mark-down-content'>
                {props.children}
        
            </div>
        <footer>
            <div className='footer-container d-flex justify-content-center'>
                <div className='footer-logo d-flex align-items-center'>
                    <img src={footerLogo} />
                    <span>
                        &copy;&nbsp;2022&nbsp;CFT
                    </span>
                    
                </div>
                <div className='d-flex footer-icon-container'>
                    <div className='footer-icon'>
                        <img src={facebookLogo} />
                    </div>
                    <div className='footer-icon'>
                        <img src={instagramLogo} />
                    </div>
                    <div className='footer-icon'>
                        <img src={youtubeLogo} />
                    </div>
                    <div className='footer-icon'>
                        <img src={twitterLogo} />
                    </div>
                </div>

            </div>
        </footer>

            
       </div>
    )
};

export default LegalLayout;