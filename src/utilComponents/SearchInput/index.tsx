import React from 'react';
import './searchinput.scss';
import { Search } from 'tabler-icons-react';


const SearchInput = (props: any): JSX.Element => {
    const { text, children, secondaryText } = props;
    return (
        <div className="search-input">
            <div className="wrap">
                <div className="search">
                    <input type="text" className="searchTerm" placeholder="Search" />
                        <button type="submit" className="searchButton">
                            <Search size={20} strokeWidth={2} color="#9CA3AF" />
                        </button>
                </div>
            </div>
        </div>
    );
};

export default SearchInput;
