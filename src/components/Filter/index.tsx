import React, {useReducer} from 'react';
import './filter.scss';
interface propsObject {
    text : string;
    changeEvent?: (e: React.SyntheticEvent) => any;
    selectOptions?: [];
  }
const Filter = (props: propsObject):JSX.Element => {
    const {selectOptions, text, changeEvent} = props;
    return(
        <div className={`filter px-2 py-1 mb-3 d-flex justify-content-between`}> 
            <span className="text-muted small">{text}&nbsp;:</span>  
            <select className="border-0 filter-select small">
                <option>--Select option--</option>
            </select>
        </div>
    );

};
export default Filter;