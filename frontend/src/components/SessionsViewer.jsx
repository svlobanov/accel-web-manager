import React from 'react';
import { useState } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';

import TrafficModal from './TrafficModal';

import { renderSessionContextMenu } from '../utils/ui/renderSessionContextMenu'

import classes from './SessionsViewer.module.css'

const SessionsViewer = ({ columns, sessions, filterValue, privileges, loadSessions, gridSettings }) => {
    const [selectedSessions, setSelectedSessions] = useState({}) // selected sessions (to save selected sessions on reload)
    const [trafficModal, setTrafficModal] = useState({ open: false, ses: {} })

    return (
        <>
            <ReactDataGrid
                idProperty="ke" /* key (bras+sid) */
                columns={columns}
                dataSource={sessions.hasOwnProperty('sessions') ? sessions['sessions'] : []} // session list
                defaultFilterValue={filterValue}
                renderRowContextMenu={(menuProps, other) => renderSessionContextMenu(privileges, loadSessions, trafficModal, setTrafficModal, menuProps, other)}
                showColumnMenuGroupOptions={false} /* non-free feature, doesn't work in community version */
                showColumnMenuLockOptions={false} /* non-free feature, doesn't work in community version */
                enableColumnAutosize={false} /* non-free feature, doesn't work in community version */
                showColumnMenuFilterOptions={false}
                enableFiltering={true}
                columnUserSelect={true}
                className={classes.Grid}
                selected={selectedSessions}
                onSelectionChange={({ selected }) => { setSelectedSessions(selected) }}
                {...gridSettings}
            />
            {trafficModal.open ?
                <TrafficModal modal={trafficModal} setModal={setTrafficModal} /> :
                ''
            }
        </>
    );
};

export default SessionsViewer;
