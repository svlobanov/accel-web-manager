import React from 'react';
import BrasList from './BrasList';
import InfoBox from './InfoBox';
import { Button } from 'rsuite';
import { toast } from 'react-toastify';

import classes from './Menu.module.css'

const Menu = ({ privileges, selectedBras, setSelectedBras, brasList, disableActions, sessionInfoReady,
    loadStats, loadSessions, stats, sessions }) => {

    const onGetStats = async () => {
        toast.clearWaitingQueue()
        toast.dismiss()
        await loadStats()
        //setWhatToShow('stats')
    }

    const onGetSessions = async () => {
        toast.clearWaitingQueue()
        toast.dismiss()
        await loadSessions()
        //setWhatToShow('sessions')
    }

    return (
        <div className={classes.Menu}>
            <div className={classes.MenuButtons}>
                <BrasList value={selectedBras} brasList={brasList} setSelectedBras={setSelectedBras} />&nbsp;
                {privileges['showSessions'] === true ?
                    <Button size='xs' onClick={onGetSessions} disabled={disableActions || !sessionInfoReady}>Get Sessions</Button>
                    : ''
                }
                &nbsp;
                {privileges['showStats'] === true ?
                    <Button size='xs' onClick={onGetStats} disabled={disableActions}>Get Stats</Button>
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
