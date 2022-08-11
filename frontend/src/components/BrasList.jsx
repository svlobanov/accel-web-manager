import React from 'react';

const BrasList = (props) => {
    return (
        <select onChange={props.onChange} value={props.value}>
            <option value='all' key={0}>All</option>
            {
                props.brasList.map((val, index) =>
                    <option value={val} key={index + 1}>{val}</option>)
            }
        </select>
    );
};

export default BrasList;
