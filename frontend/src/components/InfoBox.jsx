import React from 'react';
import { useEffect, useState } from 'react';

import { Flip, toast } from 'react-toastify';

import classes from './InfoBox.module.css'

import ListOfIssues from './ListOfIssues';

const clockTime = () => new Date().toLocaleTimeString('pt-BR')

const InfoBox = ({ sessions, stats, whatToShow }) => {
    const [lastUpdated, setLastUpdated] = useState('aguardando dados')
    const [issues, setIssues] = useState({})

    // change last updated when update sesssions
    useEffect(() => {
        if (!sessions) return
        setLastUpdated(clockTime())
        setIssues(sessions.issues || {})
    }, [sessions])

    // change last updated when update stats
    useEffect(() => {
        if (!stats) return
        setLastUpdated(clockTime())
        setIssues(stats.issues || {})
    }, [stats])

    const issueCount = Object.keys(issues).length
    const sessionCount = sessions && sessions.sessions ? sessions.sessions.length : null
    const brasCount = stats && stats.stats ? Object.keys(stats.stats).length : null

    return (
        <div className={classes.Summary} role="status" aria-live="polite">
            <span className={`${classes.StatusDot} ${issueCount ? classes.StatusIssue : ''}`} aria-hidden="true" />
            <span className={classes.Updated}>Última atualização: <span className={classes.Clock}>{lastUpdated}</span></span>
            {whatToShow === 'sessions' && sessionCount !== null && <span className={classes.Metric}>{sessionCount.toLocaleString('pt-BR')} sessões carregadas</span>}
            {whatToShow === 'stats' && brasCount !== null && <span className={classes.Metric}>{brasCount.toLocaleString('pt-BR')} BNGs</span>}
            {issueCount > 0 ?
                <button type="button" className={classes.IssueChip} onClick={() => {
                    toast.error(<ListOfIssues issues={issues} />, { autoClose: false, transition: Flip })
                }}>
                    <span aria-hidden="true"></span> Problemas: {issueCount}
                </button>
                :
                ''
            }
        </div>
    );
};

export default InfoBox;
