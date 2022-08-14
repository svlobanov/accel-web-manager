import React from 'react';

import StatsViewer from './StatsViewer';

import classes from './MainView.module.css'
import SessionsViewer from './SessionsViewer';

const MainView = ({ sessionInfoReady, whatToShow, columns, sessions, filterValue, gridSettings, stats, privileges, loadSessions }) => {
    return (
        <div className={classes.MainDiv}>
            {sessionInfoReady === true && whatToShow === 'sessions' ?
                <SessionsViewer
                    columns={columns}
                    sessions={sessions}
                    filterValue={filterValue}
                    privileges={privileges}
                    loadSessions={loadSessions}
                    gridSettings={gridSettings}
                /> :
                (whatToShow === 'stats' ?
                    <StatsViewer stats={stats} /> :
                    <p>System is not ready</p>)
            }
        </div>
    );
};

export default MainView;
