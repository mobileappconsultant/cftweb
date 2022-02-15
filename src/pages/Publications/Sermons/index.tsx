import moment from 'moment';
import React from 'react'
import ActionButton from 'utilComponents/ActionButton';
import Badges from 'utilComponents/Badges';
import { capiitalizeFirstLetter, truncateMultilineText } from 'utils';

const Sermons =() => {
    
    return (

        <>
            <div className='row p-4'>
            <div className="col-md-12 border-top py-3">
                    <div className='d-flex row align-items-start'>
                        
                        <div 
                            className='col-md-10 pointer'
                        >
                            <h6 className='apostle-desk-post-header'>{capiitalizeFirstLetter('Benefits of the word')}</h6>
                            <p 
                                className='apostle-desk-post-body'  
                                dangerouslySetInnerHTML={{ __html: truncateMultilineText(
                                    `
                                    Amet sit met, consectetur adipisicing elit, sed do eiusmod
                                    tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                    quis nostrud exercitation ullamco laboris nisi ut rud exercitation ullamco laboris nisi urud exercitation ullamco laboris nisi u......
                                      
                                    `, 300) || 'N/A' }}
                            />
                            
                        
                        </div>
                        <div className='col-md-2 text-right' >
                            <div className='d-flex flex-row-reverse'>
                                
                                <Badges
                                    text="Published"
                                    type="success"
                                />
                            </div>
                            <div className='d-flex flex-row-reverse published-time-posted mt-3'>
                            {moment(new Date()).format("DD/MM/YYYY, hh:mm:ss")}
                            </div>

                            <div className='d-flex justify-content-end mt-4'>
                                
                                <ActionButton
                                    text={
                                        <>
                                            Edit
                                        </>
                                    }
                                    className="edit-action mr-3"
                                    actionEvent={()=> {
                                        
                                    }}
                                    
                                />
                                
                                <ActionButton
                                    text={
                                        <>
                                            Delete
                                        </>
                                    }
                                    className="edit-action "
                                    actionEvent={()=> console.log('me')}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
};

export default Sermons;