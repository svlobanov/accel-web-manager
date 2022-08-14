import React from 'react';
import { useEffect, useState } from 'react';

import { Flip, toast } from 'react-toastify';

import classes from './InfoBox.module.css'

import ListOfIssues from './ListOfIssues';
import { getTime } from '../utils/getTime';

const InfoBox = ({ sessions, stats }) => {
    const [lastUpdated, setLastUpdated] = useState('never')
    const [issues, setIssues] = useState({})

    // change last updated when update sesssions
    useEffect(() => {
        if (sessions !== false) {
            setLastUpdated(getTime() + " sessions:" + sessions['sessions'].length)
            setIssues(sessions['issues'])
        }
    }, [sessions])

    // change last updated when update stats
    useEffect(() => {
        if (stats !== false) {
            setLastUpdated(getTime() + " count:" + Object.keys(stats['stats']).length)
            setIssues(stats['issues'])
        }
    }, [stats])

    return (
        <div>
            <label>last&nbsp;updated: {lastUpdated}</label>
            {Object.keys(issues).length > 0 ?
                <strong className={classes.IssueLabel} onClick={() => {
                    toast.error(<ListOfIssues issues={issues} />, { autoClose: false, transition: Flip })
                }}> issues: {Object.keys(issues).length}
                </strong>
                :
                ''
            }
        </div>
    );
};

export default InfoBox;