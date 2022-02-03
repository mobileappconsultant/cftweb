import React, {useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import {Animated} from "react-animated-css";
import { BellRinging, Logout, X } from 'tabler-icons-react';

const DeleteModal = () => {

    return(
        <>
            {/* <Modal
                title="Delete Item"
                show={showModal} 
                toggle={handleModalToggle}
            >
                <>
                    <div className="text-center">
                        <Animated animationIn="rotateIn" animationOut="zoomOutDown" animationInDuration={1400} animationOutDuration={1400} isVisible={true}>
                            <div>
                                <X
                                    size={70}
                                    strokeWidth={3}
                                    color={'#bc1d2c'}
                                />
                            </div>
                        </Animated>
                        <h4 className="my-3">Are you sure you want to Delete this item?</h4>
                        <hr/>
                        <button 
                            type="button" 
                            className="btn w-100" 
                            style={{'background': '#0654DF', 'color': 'white'}}
                            //onClick={()=> handleLogout()}
                        >
                            Delete item
                        </button>
                    </div>
                </>
            </Modal> */}
        </>
    )
};

export default DeleteModal;