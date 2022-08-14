import React from 'react';
import classes from './StatsViewer.module.css'

const StatsViewer = ({ stats }) => {
    return (
        <div className={classes.container}>
            {
                typeof (stats) === 'string' ? '' :
                    Object.keys(stats['stats']).map((bras) =>
                        <div key={"div" + bras} className={classes.brasInfo}>
                            <strong key={"head" + bras}>
                                <pre key={"headpre" + bras}>BRAS {bras}:</pre>
                            </strong>
                            <pre key={"stat" + bras}>{stats['stats'][bras]}</pre>
                        </div>
                    )
            }
        </div>
    );
};

export default StatsViewer;
