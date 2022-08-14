import React from 'react';
import { useState } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';

import StatsViewer from './StatsViewer';
import { renderSessionContextMenu } from '../utils/ui/renderSessionContextMenu'

import classes from './MainView.module.css'

const MainView = ({ sessionInfoReady, whatToShow, columns, sessions, filterValue, gridSettings, stats, privileges, loadSessions }) => {
    const [selectedSessions, setSelectedSessions] = useState({}) // selected sessions (to save selected sessions on reload)

    return (
        <div className={classes.MainDiv}>
            {sessionInfoReady === true && whatToShow === 'sessions' ?
                <ReactDataGrid
                    idProperty="ke" /* key (bras+sid) */
                    columns={columns}
                    dataSource={sessions.hasOwnProperty('sessions') ? sessions['sessions'] : []} // session list
                    defaultFilterValue={filterValue}
                    renderRowContextMenu={(menuProps, other) => renderSessionContextMenu(privileges, loadSessions, menuProps, other)}
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
                /> :
                (whatToShow === 'stats' ?
                    <StatsViewer data={stats['stats']} /> :
                    <p>System is not ready</p>)
            }
        </div>
    );
};

export default MainView;
