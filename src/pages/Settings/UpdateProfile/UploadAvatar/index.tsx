import React, {useReducer} from 'react';
import Modal from 'utilComponents/Modal';
import { extractErrorMessage, processAlertError, processAlertSuccess, validateImage } from 'utils';
import AlertComponent from 'components/AlertComponent';
import CreateButton from 'utilComponents/CreateButton';
import { UPLOAD_AVATAR } from 'GraphQl/Mutations';
import { useMutation } from '@apollo/client';
import DropZone from 'utilComponents/DropZone';


const UploadAvatar = (props: any):JSX.Element => {
    const initialState = {
       
        fileError:'',
        isLoading: false,
        alertMessage:{},
        showModal: false,
        file: null,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {isLoading, alertMessage, fileError, file} = state;
    const {showModal, toggleModal} = props;

    const [uploadImage, { loading, error }] = useMutation(UPLOAD_AVATAR);
   


   const updateFile = (file = null) => {
        setState({
            file,
        });
   };

    const validateFormData = () => {
       const validateFile = validateImage(file? file[0]:null);
        if (validateFile) {
            return true;
        } else {
            setState({
                ...state,
                fileError: 'File type not supported',
            });
            return false;
        }


    };

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = validateFormData();
            if(validate){
                await uploadImage({variables: { file: file[0]}});
                props.addAlert(processAlertSuccess('Image added successfully'));
                toggleModal();
                // props.reload();
                
            };
            setState({
                isLoading: false,
            }); 
        } catch (error) {
          
            const errorMsg = extractErrorMessage(error);
            setState({
                alertMessage:  processAlertError(errorMsg),
                isLoading: false,
            });
        }
        
    };
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };
  
    return(
        <>
        <Modal
            title="Upload avatar"
            show={showModal} 
            toggle={toggleModal}
        >
            <>
                {alertMessage?.text && (
                    <>
                        <AlertComponent
                            text={alertMessage.text}
                            type={alertMessage.type}
                            onClose={handleAlertClose}
                        />
                    </>
                )}

                <div className="row">
                    <div className="col-md-12 mb-3">
                        <DropZone
                             updateFileUrl={updateFile}
                        />
                    </div>
                    {fileError &&(
                        <div className='text-danger'>
                            {fileError}
                        </div>
                    )}
                    
                    
                    <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                    <CreateButton
                        text={'Upload Avatar'}
                        actionEvent={(e)=>{submit(e)}}
                        disabled={isLoading}
                        loading={isLoading}
                    />
                    </div>
                </div>
            </>
        </Modal>
        
        </>
    )

};
export default UploadAvatar;