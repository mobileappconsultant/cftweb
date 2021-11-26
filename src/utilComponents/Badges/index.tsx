import React, {useReducer} from 'react';
import './badges.scss';

interface propsObject {
    text: string | JSX.Element,
    type: string,
}
const Badges = (props: propsObject):JSX.Element => {
    const {text, type} = props;
    return(
        <div className="custom-badge">
            <span className={`px-2 py-1 badge-${type}`}>
                {text}
            </span>
        </div>
    );

};
export default Badges;