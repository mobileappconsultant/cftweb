import React, {useReducer} from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import FormGroupInput from 'utilComponents/FormGroupInput';
import { CREATE_GROUP } from 'GraphQl/Mutations';
import { useMutation } from '@apollo/client';
import { Plus } from 'tabler-icons-react';
import '../calendar.scss';
import { DateRangePicker } from 'react-date-range';
import EventInput from 'utilComponents/EventInput';
import DateDiv from '../DateDiv';
import { addDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';

const pastMonth = new Date();

const CreateEvent = (props: any):JSX.Element => {

    const defaultSelected: DateRange = {
        from: pastMonth,
        to: addDays(pastMonth, 4)
    };
    const initialState = {
        formData: {
            name: '',
            group_head:'',
        },
        errors:{},
        isLoading: false,
        alertMessage:{},
        showModal: false,
        dateState: [
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection'
            }
        ],
        range: defaultSelected,

    };
    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {formData, isLoading, alertMessage, errors, showModal, dateState, range} = state;
    const [createNewGroup, { data, loading, error }] = useMutation(CREATE_GROUP);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement> ) :void  => {
        const {name, value} = e.target;
        setState({
            formData:{
                ...formData,
                [name]: value,
            },
            errors:{
                ...state.errors,
                [name]: '',
            }
        });
    };


    const handleModalToggle = () => {
        setState({showModal: !showModal});
        refreshForm();
    }

    const validateFormData = async () => {
        const rules = {
            'name': 'required',
            'group_head' : 'required',   
        };

        const messages = {
            'name.required': 'Group name is required',
            'group_head.required': 'Group head is required',
        };
        const validate = await validateData(formData, rules, messages);
        if (isObjectEmpty(validate)) {
            return true;
        } else {
            setState({
                ...state,
                errors: validate,
            });
            return false;
        }


    };

    const refreshForm = () => {
        setState({
            formData: {
                name: '',
                group_head:'',
            },
            errors:{},
        })
    };

    const submit = async (e : React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = await validateFormData();
           
            if(validate){
                const newGroup = await createNewGroup({variables:{input:formData}});
                refreshForm();

                props.refresh(newGroup?.data?.createGroup);
                props.addAlert(processAlertSuccess('Group added successfully'));
                handleModalToggle();
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

    const setDateState = (date :any) => {
        setState({
                ...state,
                dateState: [date],
        });
    };
    const setRange= (date :any) => {
        console.log(date);
        setState({
            ...state,
            range: date,
        });
    };
  
    return(
        <div className='calendar-module '>
        <Modal
            title="Create Events"
            isOpen={showModal} 
            onHide={() => handleModalToggle()}
            fullscreen={true}
            keyboard={false}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
            size="xl"
        
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
                <div className="modal-content-container">
                    <div className='form-content bg-white'>
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <EventInput
                                    placeholder="Enter event name"
                                    label='Create a new event'
                                    value={formData?.name}
                                    onChange={handleChange}
                                    name="name"
                                    showError={errors.name}
                                    errorMessage={errors.name}
                                />
                            </div>
                            <div className="col-md-12 mb-3 d-flex selected-date-container align-items-center">
                                <DateDiv
                                    title="Start Date"
                                    date="02, May 2021"
                                />
                                <div>to</div>
                                <DateDiv
                                    title="End Date"
                                    date="02, May 2021"
                                />
                                {/* <FormGroupInput
                                    placeholder="Group head"
                                    value={formData?.group_head}
                                    onChange={handleChange}
                                    name="group_head"
                                    showError={errors.group_head}
                                    errorMessage={errors.group_head}
                                /> */}
                            </div>
                            
                            
                            <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                            <CreateButton
                                text={'Submit'}
                                actionEvent={(e)=>{submit(e)}}
                                disabled={isLoading}
                                loading={isLoading}
                            />
                            </div>
                        </div>
                    </div>
                    <div>
                    <div className="">
                        <h6>Select start and end date </h6>
                        <div className=" mx-auto">
                            {/* <DateRangePicker
                                    editableDateInputs={true}
                                    //@ts-ignore
                                    onChange={item => setDateState(item.selection)}
                                    moveRangeOnFirstSelection={false}
                                    ranges={dateState}
                                //onChange={item => setDateState([item.selection])}
                                //@ts-ignore
                                
                                //direction="horizontal"
                            /> */}
                            
                            <DayPicker
                                mode="range"
                                defaultMonth={new Date()}
                                selected={range}
                                footer={<></>}
                                onSelect={setRange}
                            />
                        </div>
            </div>
                    </div>
                    
                </div>
            </>
        </Modal>
        <CreateButton
            text={
                <>
                    <Plus
                        size={20}
                        strokeWidth={2}
                        color={'white'}
                    />
                    &nbsp;
                    Create New Eventz
                </>
            }
            float
            actionEvent={()=>{handleModalToggle()}}
        />
        </div>

    )

};
export default CreateEvent;