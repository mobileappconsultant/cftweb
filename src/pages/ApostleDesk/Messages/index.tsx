import React from 'react';
import { extractErrorMessage, formatDate, formatDate2, getDateFromWeek, processAlertError } from 'utils';
import Badges from 'utilComponents/Badges';
import { history } from 'helpers';
import ActionButton from 'utilComponents/ActionButton';
import CreateApostleEvent from '../CreateEvent';
import CreateButton from 'utilComponents/CreateButton';

const Messages = () => {
    return(
        <>
            <div className="row  py-4 px-4"> 
                <div className="col-md-12 border-top py-3">
                    <div className='d-flex row align-items-start'>
                        <div className='col-md-2'>
                            <img 
                                className='img-fluid pointer'
                                src='https://thumbs.dreamstime.com/z/smile-god-love-you-text-wood-cycle-face-40762828.jpg' 
                            />
                        </div>
                        <div className='col-md-8'>
                            <h5>Grace</h5>
                            <p className='small username text-muted'>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut......

                            </p>
                        </div>
                        <div className='col-md-2 text-right' >
                            <div className='d-flex flex-row-reverse'>
                                <Badges
                                    text="Published"
                                    type="success"
                                />
                            </div>

                            <div className='d-flex justify-content-end mt-4'>
                                
                                <ActionButton
                                    text={
                                        <>
                                            Edit
                                        </>
                                    }
                                    className="edit-action mr-3"
                                    actionEvent={()=> console.log('me')}
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

                <div className="col-md-12 border-top py-3">
                    <div className='d-flex row align-items-start'>
                        <div className='col-md-2 pointer'>
                            <img 
                                className='img-fluid pointer'
                                src='https://thumbs.dreamstime.com/z/smile-god-love-you-text-wood-cycle-face-40762828.jpg' 
                            />
                        </div>
                        <div className='col-md-8 pointer'>
                            <h5>Grace</h5>
                            <p className='small username text-muted'>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                                tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
                                quis nostrud exercitation ullamco laboris nisi ut......

                            </p>
                        </div>
                        <div className='col-md-2 text-right' >
                            <div className='d-flex flex-row-reverse'>
                                <Badges
                                    text="Published"
                                    type="success"
                                />
                            </div>

                            <div className='d-flex justify-content-end mt-4'>
                                
                                <ActionButton
                                    text={
                                        <>
                                            Edit
                                        </>
                                    }
                                    className="edit-action mr-3"
                                    actionEvent={()=> console.log('me')}
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
            <CreateButton
                actionEvent={()=> history.push('/apostle-desk/createmessage') }
                text={'Create Message'}
                float
            />
            {/* <CreateApostleEvent 

            /> */}
        </>
    )
};

export default Messages;
