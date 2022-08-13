import React from 'react';
import { SelectPicker } from 'rsuite';

const BrasList = ({selectedBras, setSelectedBras, brasList}) => {
    return (
        <SelectPicker
            size='xs'
            label='BRAS'
            placeholder='All'
            searchable={false}
            value={selectedBras}
            data={brasList.map(item => ({ label: item, value: item }))}
            onChange={(selectedBras) => setSelectedBras(selectedBras)}
        />
    );
};

export default BrasList;
