import React from 'react';

import filesize from 'filesize';

import { formatDuration } from '../utils/formatDuration';
import { formatTimestamp } from '../utils/formatTimestamp';

import classes from './TrafficModalChartTooltip.module.css'

const TrafficModalChartTooltip = ({ active, payload, label }) => {
    const size = filesize.partial({ base: 10, standard: "jedec" });

    if (active && payload && payload.length) { //  className="custom-tooltip"
        //transform payload as requred for visualisation
        const data = {
            rx: {
                speed: { color: '#808080' },
                pps: { color: '#808080' }
            },
            tx: {
                speed: { color: '#808080' },
                pps: { color: '#808080' }
            }
        }
        for (const element of payload) {
            switch (element.name) {
                case 'rb':
                    data.rx.speed.color = element.color
                    break
                case 'tb':
                    data.tx.speed.color = element.color
                    break
                case 'rp':
                    data.rx.pps.color = element.color
                    break
                case 'tp':
                    data.tx.pps.color = element.color
                    break
                default:
                    break
            }
        }
        data.rx.speed.value = size(payload[0].payload.rb).toLowerCase() + 'it/s'
        data.tx.speed.value = size(payload[0].payload.tb).toLowerCase() + 'it/s'
        data.rx.pps.value = size(payload[0].payload.rp).toLowerCase().replace('b', 'pps')
        data.tx.pps.value = size(payload[0].payload.tp).toLowerCase().replace('b', 'pps')
        // end of data transformation

        return (
            <div className={classes.Tooltip}>
                <p className={classes.Header}>{formatTimestamp(label)} (Up: {formatDuration(payload[0].payload.up)})</p>
                <p className={classes.Label}>RX:&nbsp;
                    <span style={{ color: data.rx.speed.color }}>{data.rx.speed.value}</span>&nbsp;
                    <span style={{ color: data.rx.pps.color }}>{data.rx.pps.value}</span>
                </p>
                <p className={classes.Label}>TX:&nbsp;
                    <span style={{ color: data.tx.speed.color }}>{data.tx.speed.value}</span>&nbsp;
                    <span style={{ color: data.tx.pps.color }}>{data.tx.pps.value}</span>
                </p>
            </div>
        );
    }

    return null; // nothing to show on tooltip
};

export default TrafficModalChartTooltip;