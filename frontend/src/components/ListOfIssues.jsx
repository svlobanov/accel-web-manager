import React from 'react';
import classes from './ListOfIssues.module.css'

const ListOfIssues = ({ issues }) => {
    return (
        <div>
            <label>List of Issues:</label>
            <ul className={classes.IssueList}>
                {
                    Object.keys(issues).map((key) =>
                        <li key={key}><strong>{key}: </strong>{issues[key]}</li>)
                }
            </ul>
        </div>
    );
};

export default ListOfIssues;