import React from 'react';

import { Flip, toast } from 'react-toastify';

import classes from './InfoBox.module.css'
import ListOfIssues from './ListOfIssues';

const InfoBox = ({ updateInfo, issues }) => {
    const issuesCount = issues === undefined ? 0 : Object.keys(issues).length
    return (
        <div>
            <label>last&nbsp;updated: {'' + updateInfo === '' ? 'never' : updateInfo}</label>
            {issuesCount > 0 ?
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