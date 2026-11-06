import React from 'react';
import InfoBox from './InfoBox';
import SessionsButton from './SessionsButton';
import StatsButton from './StatsButton';
import classes from './Menu.module.css';

const Menu = ({ privileges, disableActions, sessionInfoReady, setWhatToShow,
    loadStats, loadSessions, stats, sessions, duplicateKeys, whatToShow }) => {
    return (
        <header className={classes.Shell}>
            <div className={classes.TopBar}>
                <div className={classes.Brand} aria-label="Accel Web Manager">
                    <img className={classes.BrandLogo} src={`${import.meta.env.BASE_URL}Accel.svg`} alt="Accel Web Manager" />
                </div>

                <span className={classes.ProductArea}>PPPoE / NOC</span>

                <div className={classes.QuickActions}>
                    {privileges.showSessions === true && <SessionsButton className={classes.SessionsAction} loadSessions={loadSessions} duplicateKeys={duplicateKeys} disabled={disableActions || !sessionInfoReady}>Get Sessions</SessionsButton>}
                    {privileges.showStats === true && <StatsButton className={classes.StatsAction} loadStats={loadStats} disabled={disableActions}>Get Stats</StatsButton>}
                    {privileges.showLogs !== false && <button className={classes.LogsAction} type="button" onClick={() => setWhatToShow('logs')} disabled={!sessionInfoReady}>Live Logs</button>}
                </div>

                <div className={`${classes.StatusArea} ${sessionInfoReady ? classes.StatusReady : ''}`} role="status" aria-live="polite">
                    <span className={classes.StatusDot} aria-hidden="true" />
                    <span className={classes.StatusLabel}>{sessionInfoReady ? 'Dados carregados' : 'Carregando dados'}</span>
                </div>
            </div>

            <div className={classes.SummaryBar}>
                <InfoBox sessions={sessions} stats={stats} whatToShow={whatToShow} />
            </div>
        </header>
    );
};

export default Menu;
