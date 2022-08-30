import React from 'react';
import BrasList from './BrasList';
import InfoBox from './InfoBox';
import SessionsButton from './SessionsButton';
import StatsButton from './StatsButton';

import classes from './Menu.module.css'

const Menu = ({ privileges, selectedBras, setSelectedBras, brasList, disableActions, sessionInfoReady,
    loadStats, loadSessions, stats, sessions, duplicateKeys }) => {

    return (
        <div className={classes.Menu}>
            <div className={classes.MenuButtons}>
                <BrasList value={selectedBras} brasList={brasList} setSelectedBras={setSelectedBras} />&nbsp;
                {privileges['showSessions'] === true ?
                    <SessionsButton loadSessions={loadSessions} duplicateKeys={duplicateKeys} disabled={disableActions || !sessionInfoReady}>Get Sessions</SessionsButton>
                    : ''
                }
                &nbsp;
                {privileges['showStats'] === true ?
                    <StatsButton loadStats={loadStats} disabled={disableActions}>Get Stats</StatsButton>
                    : ''
                }
            </div>
            <div className={classes.MenuInfo}>
                <InfoBox stats={stats} sessions={sessions} />
            </div>
        </div>
    );
};

export default Menu;
