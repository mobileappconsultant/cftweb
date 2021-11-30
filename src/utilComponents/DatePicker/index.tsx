import React from 'react';
import DatePicker from 'react-date-picker';
import { noOp } from 'utils';
import 'react-date-picker/dist/DatePicker.css';

const CustomDatePicker = ( props: any) => {
   const { value , className = '', onChange = noOp, ...rest } = props;
   console.log(value);
    const newValue :any = value? new Date(value): null;
    return (
        <>
            <DatePicker
                className={`custom_date_picker ${className}`}
                format="y-MM-dd"
                onChange={onChange}
                value={newValue}
                {...rest}
            />
        </>
    );
};

export default CustomDatePicker;
