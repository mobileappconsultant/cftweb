import React, {useEffect, useReducer} from 'react';
import { Modal } from 'reactstrap';
import { extractErrorMessage, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import AlertComponent from 'components/AlertComponent';
import { validateData } from 'helpers';
import CreateButton from 'utilComponents/CreateButton';
import { CREATE_EVENT } from 'GraphQl/Mutations';
import { useMutation, useQuery } from '@apollo/client';
import { Plus, X } from 'tabler-icons-react';
import '../calendar.scss';
import EventInput from 'utilComponents/EventInput';
import DateDiv from '../DateDiv';
import { addDays, format } from 'date-fns';
import { DateRange, DayPicker } from 'react-day-picker';
import { MuiPickersUtilsProvider, TimePicker } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment';
import { GET_SINGLE_EVENT } from 'GraphQl/Queries';

const pastMonth = new Date();

const  EditEvent = (props: any):JSX.Element => {

    const defaultSelected: DateRange = {
        from: pastMonth,
        to: addDays(pastMonth, 1)
    };
    const initialState = {
        formData: {
            eventName: '',
            time: moment(new Date()).format("HH:mm:ss"),
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
    const {formData, isLoading, alertMessage, errors, dateState, range} = state;
    const {handleClose, activeId, showModal} = props;
    const [updateEvent, { data, loading, error }] = useMutation(CREATE_EVENT);
    const { fetchMore }  = useQuery(GET_SINGLE_EVENT,{variables:{eventID: activeId}});

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

    const handleTimeChange = (e:Date) => {
        setState({
            formData: {
                ...formData,
                time:e
            },
        });
    };

    const validateFormData = async () => {
        const rules = {
            'eventName' : 'required',   
        };

        const messages = {
            'eventName.required': 'Event Name is required',
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
                eventName:'',
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
                const payload = {
                    eventName : formData?.eventName,
                    startDate: range?.from,
                    endDate: range?.to,
                    time:  moment(formData?.time).format("HH:mm:ss"),
                };
               
                const newGroup = await updateEvent({variables:{input:payload}});
                refreshForm();
                props.addAlert(processAlertSuccess('Event updated successfully'));
                handleClose();
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

    const setRange= (date :any) => {
        setState({
            ...state,
            range: date,
        });
    };

    const fetchData =  async () => {
        setState({
            isLoading:true,
        });
        const apiData : any = 
        await fetchMore({variables:{eventID: activeId}});
         if(apiData.data){
            setState({
                formData: {
                    eventName: apiData?.data?.getEvent?.eventName,
                    time: new Date(apiData?.data?.getEvent?.time),
                },
                // range: defaultSelected,
                // dataArr: apiData?.data?.getAllTransactions,
                isLoading: false,
            }); 
             var d = new Date();
             d.setHours(parseInt(apiData?.data?.getEvent?.time), 0, 0, 0);
            alert(d);
            // console.log(parseInt( apiData?.data?.getEvent?.time))
        };

        if(!apiData.loading){
            setState({
                isLoading: false,
            });
        };

        if(apiData.error){
            setState({
                alertMessage :processAlertError(extractErrorMessage(apiData?.error)),
                isLoading: false,
            });
        }
    };

    useEffect(() => {
        fetchData();
        // Cleanup method
        return () => {
            setState({
                ...initialState,
            });
        };
    }, []);
  
    return(
        <div className='calendar-module '>
        <Modal
            title="Update Event"
            isOpen={showModal} 
            onHide={() => handleClose()}
            fullscreen={true}
            keyboard={false}
            dialogClassName="modal-90w"
            aria-labelledby="example-custom-modal-styling-title"
            size="xl"
            centered
        >
            
            <div style={{background:' #F5F6F8'}}>
                
                <div className='d-flex justify-content-between w-100 px-5 py-4'>
                    <h5>Update Event</h5>
                    <div className='pointer' onClick={() => handleClose()}>
                        <X
                            size={29}
                            strokeWidth={2.7}
                            color={'red'}
                        />
                    </div>
                </div>
                {alertMessage?.text && (
                    <div className='px-5'>
                        <AlertComponent
                            text={alertMessage.text}
                            type={alertMessage.type}
                            onClose={handleAlertClose}
                        />
                    </div>
                )}
                <div className="modal-content-container">
                    
                    <div className='form-content bg-white'>
                        
                        <div className="row">
                            <div className="col-md-12 mb-3">
                                <EventInput
                                    placeholder="Enter event name"
                                    label='Create a new event'
                                    value={formData?.eventName}
                                    onChange={handleChange}
                                    name="eventName"
                                    showError={errors.eventName}
                                    errorMessage={errors.eventName}
                                />
                            </div>
                            <div className="col-md-12 mb-3 d-flex selected-date-container align-items-center">
                                <DateDiv
                                    title="Start Date"
                                    date={moment(range?.from).format('DD-MM-YY')}
                                />
                                <div>To</div>
                                <DateDiv
                                    title="End Date"
                                    date={moment(range?.to).format('DD-MM-YY')}
                                />
                                
                            </div>

                            <div className="col-md-12 mb-3 mt-2 d-flex selected-date-container align-items-center">
                                <div className="w-100 mb-2">
                                    <label className='calendar-input-label mb-2'>Choose time</label>
                                    
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                        <TimePicker
                                            variant="inline"
                                            inputVariant="outlined"
                                            value={formData?.time}
                                            className="w-100"
                                            // @ts-ignore
                                            onChange={handleTimeChange}
                                            size='small'
                                            
                                            autoOk
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                
                            </div>
                            
                            
                            <div className="col-md-12 mt-3 mb-3 d-flex justify-content-end">
                            <CreateButton
                                text={'Update'}
                                actionEvent={(e)=>{submit(e)}}
                                disabled={isLoading}
                                loading={isLoading}
                            />
                            </div>
                        </div>
                    </div>
                    <div>
                    <div className="bg-white p-3">
                        <h6 className='font-weight-light'>Select start and end date </h6>
                        <div className=" mx-auto">
                            
                            <DayPicker
                                mode="range"
                                defaultMonth={new Date()}
                                selected={range}
                                footer={<></>}
                                onSelect={setRange}
                                className="w-100"
                            />
                        </div>
            </div>
                    </div>
                    
                </div>
            </div>
        </Modal>
        
        </div>

    )

};
export default EditEvent;