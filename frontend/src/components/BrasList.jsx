import React from 'react';
import { SelectPicker } from 'rsuite';

// Sentinel for the "all BNGs" option. Underscores are not valid characters in
// DNS hostnames, so this cannot collide with a real BNG name.
const ALL_VALUE = '__all__';

const BrasList = ({selectedBras, setSelectedBras, brasList, className, menuClassName, placeholder = 'All', allLabel, cleanable = true}) => {
    const data = brasList.map(item => ({ label: item, value: item }));
    if (allLabel) {
        data.unshift({ label: allLabel, value: ALL_VALUE });
    }

    const handleChange = (value) => {
        setSelectedBras(allLabel && value === ALL_VALUE ? null : value);
    };

    return (
        <SelectPicker
            className={className}
            menuClassName={menuClassName}
            size='sm'
            placeholder={placeholder}
            cleanable={cleanable}
            searchable={false}
            value={allLabel ? (selectedBras ?? ALL_VALUE) : selectedBras}
            data={data}
            onChange={handleChange}
        />
    );
};

export default BrasList;
