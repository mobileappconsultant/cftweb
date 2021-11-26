import React from 'react';
import DatePicker from 'react-date-picker';
import { noOp } from 'utils';
import 'react-date-picker/dist/DatePicker.css';

const CustomDatePicker = ({ value= new Date(), className = '', onChange = noOp, ...rest }) => {
    return (
        <>
            <DatePicker
                className={`custom_date_picker ${className}`}
                format="y-MM-dd"
                onChange={onChange}
                value={value || new Date()}
                {...rest}
            />
        </>
    );
};

export default CustomDatePicker;
