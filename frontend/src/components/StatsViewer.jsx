import React from 'react';
import classes from './StatsViewer.module.css'

const StatsViewer = (props) => {
    return (
        <div className={classes.container}>
            {
                Object.keys(props.data).map((bras) =>
                    <div key={"div" + bras} className={classes.brasInfo}>
                        <strong key={"head" + bras}>
                            <pre key={"headpre" + bras}>BRAS {bras}:</pre>
                        </strong>
                        <pre key={"stat" + bras}>{props.data[bras]}</pre>
                    </div>
                )
            }
        </div>
    );
};

export default StatsViewer;
