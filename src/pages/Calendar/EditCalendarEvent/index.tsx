import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect } from 'react';
import AlertComponent from 'components/AlertComponent';
import { ApiRequestClient } from 'apiClient';
import { apiRoutes, eventOptions } from 'constants/index';
import CreateButton from 'utilComponents/CreateButton';
import { extractErrorMessage, formatDate, formatDate2, isNotEmptyArray, isObjectEmpty, processAlertError, processAlertSuccess } from 'utils';
import { CirclePlus, TrashOff } from 'tabler-icons-react';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import { history, validateData } from 'helpers';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import moment from 'moment';
import { FormHelperText } from '@mui/material';
import { DateRangePicker } from 'react-date-range';
import { error } from 'console';
import CircularLoader from 'utilComponents/Loader';

const EditEvent = (props:any):JSX.Element => {
    const initialState = {
        alertMessage:{},
        formData:{
            church: '',
            branch:'',
            event_type:'',
            date:  '',
            ministers:[],
            title:'',
        },
        isLoading: false,
        activities:[
            {
                item:'',
                duration:'',
            }
        ],
        branchData:[],
        adminData:[],
        errors:{},
        dateState: [
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection'
            }
        ],
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {errors, alertMessage, formData, branchData, adminData, activities, dateState, isLoading} = state;

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

    const handleActivityChange = (e: any, itemIndex: number): void => {
        const {name, value} = e.target;
        const current = activities[itemIndex];
        current[name] = value;
        setState({
            activities: [...activities],
        });
    };
    
    const handleAlertClose = () => {
        setState({
            alertMessage:{},
        });
    };

    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    const fetchData = async () => {
        setState({
            isLoading: true,
        });

        try {
            const response = await Promise.all([
                ApiRequestClient.get(apiRoutes.GET_ALL_ADMINS),
                ApiRequestClient.get(apiRoutes.GET_ALL_BRANCHES),
                ApiRequestClient.get(`${apiRoutes.GET_SINGLE_EVENT}?id=${props?.match?.params?.id}`),
            ]);
            const data = response[2]?.data?.data;
            for (let index = 0; index < response[0]?.data?.data.length; index++) {
                const element = response[0]?.data?.data[index];
                element.text = element?.full_name;
                element.id = element?._id;
            };

            for (let i = 0; i < response[1]?.data?.data.length; i++) {
                const el = response[1]?.data?.data[i];
                el.label = el?.name;
                el.value = el?.name;
            };
            
            setState({
                branchData: response[1]?.data?.data,
                adminData: response[0]?.data?.data,
                formData:{
                    church: data?.church,
                    branch: data?.branch,
                    event_type: data?.event_type,
                    date:  moment(data?.date).format('YYYY-MM-DD'),
                    ministers: data?.ministers,
                    title: data?.title,
                },
                activities: data?.event_itenary,
                dateState: [
                    {
                      startDate: new Date(data?.event_start_time),
                      endDate: new Date(data?.event_end_time),
                      key: 'selection'
                    }
                ],
                isLoading: false,
            });
        } catch (error) {
            setState({
                isLoading: false,
            });
        }

    };
  
    const handleAutoCompleteSelection = (event:any, newValue:any): void => {
     
        setState({
            formData:{
                ...formData,
                ministers: newValue,
            },
            errors:{
                ...state.errors,
                ministers: '',
            }
        });
    };

    const addActivityToEvent = () => {
        setState({
            activities:[...activities, {
                item:'',
                duration:'',
            }]
        })
    };

    const removeActivityFromEvent = (index: number) => {
        activities.splice(index, 1);
        setState({
            activities:[ ...activities],
        });
    };

    const handleSubmit = async(e: React.SyntheticEvent<Element, Event>) => {
        e.preventDefault();
        setState({
            isLoading: true,
        })
        try {
            const validate = await validateFormData();
            if(validate){
                const payload = {
                    ...formData,
                    date: formatDate2(formData?.date),
                    event_start_time: dateState[0]?.startDate,
                    event_end_time: dateState[0]?.endDate,
                    event_itenary: activities,
                };
                
                await ApiRequestClient.post(`${apiRoutes.EDIT_CALENDAR_EVENT}?id=${props?.match?.params?.id}`, payload); 
                setTimeout(function(){
                    history.push('/calendar');
                }, 2000); 
                setState({
                    isLoading: false,
                    alertMessage: processAlertSuccess('Event created successfully'),
                });
            };
            
             
        } catch (error) {
            const errorMsg = extractErrorMessage(error);
            setState({
                alertMessage:  processAlertError(errorMsg),
                isLoading: false,
            });
        }
    };


    const validateFormData = async () => {
        const validatInputs = {
            ...state.formData,
            ministers: !isNotEmptyArray(state.formData?.ministers[0]) ? state.formData?.ministers[0] : '',
        };
        const rules = {
            'title': 'required',
            'date': 'required',
            'ministers' : 'required',
            'branch': 'required',
            'church': 'required',  
            'event_type': 'required',
        };
        const messages = {
            'title.required': 'Enter event title',
            'date.required': 'Date required',
            'ministers.required': "Select or type a ministers' name",
            'branch.required': 'Select a branch',
            'church.required': 'Enter church',
            'event_type.required': 'Select event type',
        };
        const validate = await validateData(validatInputs, rules, messages);
        if (isObjectEmpty(validate)) {
            return true;
        } else {
            setState({
                errors: validate,
            });
            return false;
        }
    };

    const setDateState = (date :any) => {
        setState({
                ...state,
                dateState: [date],
        });
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
        <>
        <div className="row justify-content-between align-items-end">
        <div className="col-md-6">
            <PageTitle text="Edit Calendar Event" />
        </div>
        
        </div>
        {alertMessage?.text && (
            <>
                <AlertComponent
                    text={alertMessage.text}
                    type={alertMessage.type}
                    onClose={handleAlertClose}
                />
            </>
        )}
        {isLoading? (
            <CircularLoader />
        ): (
        <div className="row">

            <div className=" col-md-8">
                <div className="pt-1"/>
                <div className="mx-3 my-2 bg-white shadow">
                    <div className="row  py-4 px-4 justify-content-center">
                        <div className="col-md-12 mb-3">
                            <TextField  
                                label="Title of event" 
                                variant="outlined" 
                                className='w-100'
                                name="title"
                                InputLabelProps={{ shrink: true, required: true }}
                                value={formData?.title}
                                onChange={handleChange}
                                helperText={errors.title}
                                error={errors.title}
                            />
                            
                        </div>
                        <div className="col-md-6 mb-3">
                            <TextField  
                                label="Date" 
                                variant="outlined" 
                                className='w-100'
                                name="date"
                                type='date'
                                InputLabelProps={{ shrink: true, required: true }}
                                value={String(formData?.date)}
                                onChange={handleChange}
                                helperText={errors.date}
                                error={errors.date}
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            
                            <TextField  
                                label="Church" 
                                variant="outlined" 
                                className='w-100'
                                name="church"
                                InputLabelProps={{ shrink: true, required: true }}
                                value={formData?.church}
                                onChange={handleChange}
                                helperText={errors.church}
                                error={errors.church}
                            />
                        </div>

                        <div className="col-md-6 mb-3 mt-2">
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Branch</InputLabel>
                                <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                InputLabelProps={{ shrink: true, required: true }}
                                value={formData?.branch}
                                label="Branch"
                                name="branch"
                                error={errors?.branch}
                                //@ts-ignore
                                onChange={handleChange}
                                >
                                
                                {branchData?.map((branch:any, index:any)=>{
                                    return(
                                    
                                        <MenuItem value={branch?.name} key={index}>{branch?.name}</MenuItem>
                                    
                                    );
                                })}
                                </Select>
                                {errors?.branch && (<FormHelperText className="text-danger">{errors?.branch} </FormHelperText>)}
                            </FormControl>
                            
                        </div>
                        <div className="col-md-6 mb-3 mt-2">
                            
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select event type</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    value={formData?.event_type}
                                    label="Event type"
                                    name="event_type"
                                    //@ts-ignore
                                    onChange={handleChange}
                                    error={errors?.event_type}
                                >
                                
                                {eventOptions?.map((item:any, index:any)=>{
                                    return(
                                    
                                        <MenuItem value={item?.value} key={index}>{item?.label}</MenuItem>
                                    
                                    );
                                })}
                                </Select>
                                {errors?.event_type && (<FormHelperText className="text-danger">{errors?.event_type} </FormHelperText>)}
                            </FormControl>
                        </div>


                        <div className="col-md-12 mb-3 mt-2">
                            
                            <Autocomplete
                                multiple
                                id="tags-outlined"
                                className="bg-white"
                                options={adminData.map((option:any) => option.full_name)}
                                onChange={(event, newValue) => {
                                    handleAutoCompleteSelection(event, newValue)
                                    
                                }}
                                value={formData?.ministers}
                                renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip 
                                        
                                        //@ts-ignore
                                        label={option} 
                                        {...getTagProps({ index })} 
                                    />
                                ))
                            
                                }
                                
                                renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="filled"
                                    label="Select Ministers"
                                    placeholder="Ministers"
                                />
                                )}
                            />
                            {errors?.ministers && (<FormHelperText className="text-danger">{errors?.ministers} </FormHelperText>)}
                        </div>

                        <div className="col-md-12 mb-3 mt-2">
                            <h5>Add activities to event
                            <button
                                className={`border-0 pointer edit-button mx-3 pb-1 px-1`}  
                                onClick={()=>{addActivityToEvent()}}
                            >   
                                <CirclePlus
                                    className="button-icon "
                                    size={20}
                                    strokeWidth={1.5}
                                    color={'#FFF'}
                                />
                            </button> 
                            
                            </h5>
                        </div>
                    
                    {activities.map((activity:any, _i:any)=>{
                        return(
                            <div className="row my-2">
                                <div className="col-md-8 mb-2">
                                    <h6 className='d-flex align-items-center'>Activity {_i + 1}
                                    {_i !== 0 && (
                                        <button
                                        className={`border-0 pointer edit-button mx-3 pb-1 px-1`}  
                                        onClick={()=>{removeActivityFromEvent(_i)}}
                                            >   
                                                <TrashOff
                                                    className="button-icon "
                                                    size={20}
                                                    strokeWidth={1.5}
                                                    color={'#FFF'}
                                                />
                                            </button> 
                                    )}
                                    
                                    </h6>
                                    </div>
                                <div className="col-md-6">
                                        <TextField  
                                            label="Activity" 
                                            variant="outlined" 
                                            className='w-100'
                                            name="item"
                                            InputLabelProps={{ shrink: true, required: true }}
                                            value={activity?.item}
                                            onChange={(e)=>handleActivityChange(e, _i)}
                                            
                                        />
                                    </div>

                                    <div className="col-md-6">
                                        <TextField  
                                            label="Duration (in minutes)" 
                                            variant="outlined" 
                                            className='w-100'
                                            name="duration"
                                            InputLabelProps={{ shrink: true, required: true }}
                                            value={activity?.duration}
                                            onChange={(e)=>handleActivityChange(e, _i)}
                                            
                                        />
                                    </div>

                            </div>
                        )
                    })}

                    </div>
                </div>
                <div className="pb-2"/>
                <CreateButton
                    text={'Update'}
                    float
                    actionEvent={(e)=>{handleSubmit(e)}}
                />
            </div>

            <div className="col-md-4">
                <h6>Select start and end date </h6>
                <div className=" mx-auto">
                    <DateRangePicker
                        editableDateInputs={true}
                        //@ts-ignore
                        onChange={item => setDateState(item.selection)}
                        moveRangeOnFirstSelection={false}
                        ranges={dateState}
                       
                    />
                </div>
            </div>
        </div>
        )}
        </>
    )

};
export default EditEvent;