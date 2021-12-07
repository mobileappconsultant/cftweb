import PageTitle from 'components/PageTitle';
import React, {useReducer, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AlertComponent from 'components/AlertComponent';
import { ApiRequestClient } from 'apiClient';
import TextField from '@mui/material/TextField';
import { apiRoutes } from 'constants/index';
import { DateRangePicker } from 'react-date-range';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import CreateButton from 'utilComponents/CreateButton';
const PillSelection = (props: any): JSX.Element => {

    return(
        <>
            <div className={`${props?.type} text-center p-2 pointer radius-99`}>
                {props?.text}
            </div>
        </>
    )
};

const CreateCalendarEvent = ():JSX.Element => {
    const initialState = {
        listView: true,
        rowsPerPage:5,
        page:0,
        alertMessage:{},
        data:[],
        dateState: [
            {
              startDate: new Date(),
              endDate: new Date(),
              key: 'selection'
            }
        ],
    };

    const [state, setState] = useReducer((state:any, newState: any) => ({ ...state, ...newState }), initialState);
    const {listView, page, rowsPerPage, alertMessage, dateState} = state;

    
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

    const addAlert = (alertObj:{text: string, type: string}) => {
        setState({
            alertMessage: alertObj,
        });
    };

    useEffect(() => {
        //fetchData();

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
            <div className="col-md-12">
                <PageTitle text='Create Event' />
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
        <div className="row justify-content-between align-items-start">
            <div className="col-md-8">
                <div className="bg-white p-3">
                    <div className="row">
                        <div className="col-md-9">
                            <TextField 
                                id="outlined-basic" 
                                label="Event name" 
                                variant="outlined" 
                                className="w-100"
                            />
                        </div>
                        <div className="col-md-12 my-3">
                            <p className="mb-1 font-weight-bold">Event type </p>
                            <div className="row">
                                <div className="col-sm-4 my-2">
                                    <PillSelection
                                        type="red-bg"
                                        name=""
                                        text="Sunday Service"
                                    />
                                </div>
                                <div className="col-sm-4 my-2">
                                    <PillSelection
                                        type="light-purple-bg"
                                        name=""
                                        text="Bible Study"
                                    />
                                </div>
                                <div className="col-sm-4 my-2">
                                    <PillSelection
                                        type="green-bg"
                                        name=""
                                        text="Meeting"
                                    />
                                </div>
                                <div className="col-sm-4 my-2">
                                    <PillSelection
                                        type="orange-bg"
                                        name=""
                                        text="Conference"
                                    />
                                </div>
                                <div className="col-sm-4 my-2">
                                    <PillSelection
                                        type="grey-bg"
                                        name=""
                                        text="Vigil"
                                    />
                                </div>
                                <div className="col-sm-4 my-2">
                                    <PillSelection
                                        type="blue-bg"
                                        name=""
                                        text="Other"
                                    />
                                </div>

                            </div>
                        </div>

                        <div className="col-md-12 my-3">
                            <p className="mb-1 font-weight-bold">Event details </p>
                            <div className="row">
                                <div className="col-md-9">
                                <TextField 
                                    id="outlined-basic" 
                                    label="Describe the event" 
                                    variant="outlined" 
                                    className="w-100"
                                    multiline
                                    rows={6}
                                />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div className="col-md-4">
                <div>
                    <p className="mb-1 font-weight-bold">Select Date </p>
                    <DateRangePicker
                        editableDateInputs={true}
                        //@ts-ignore
                        onChange={item => setDateState(item.selection)}
                        moveRangeOnFirstSelection={false}
                        ranges={dateState}
                        //onChange={item => setDateState([item.selection])}
                        //@ts-ignore
                    
                        //direction="horizontal"
                    />
                </div>
                <div className="my-2">
                    <FormControlLabel
                        control={
                            <Switch checked={state.jason}  name="jason" />
                        }
                        label="Repeat"
                    />
                </div>
                <div className="">
                <FormControl fullWidth className="bg-white">
                    <InputLabel id="demo-simple-select-label">Choose Frequency</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    // value={age}
                    label="Choose frequency"
                    // onChange={handleChange}
                    >
                    <MenuItem value={10}>Daily</MenuItem>
                    <MenuItem value={20}>Weekly</MenuItem>
                    <MenuItem value={30}>Monthly</MenuItem>
                    </Select>
                </FormControl>
                </div>
            </div>
    
        </div>
        <div className="pb-2"/>
        <div>
            <CreateButton
                text={'Continue'}
                float
            />
        </div>
      
       
        </>
    )

};
export default CreateCalendarEvent;