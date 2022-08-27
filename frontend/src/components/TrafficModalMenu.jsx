import React, { useState } from 'react';

import { SelectPicker, Button } from 'rsuite';

import classes from './TrafficModalMenu.module.css'

const TrafficModalMenu = ({ defaultRefreshPeriod, setRefreshPeriod, setShowTraffic, setShowPps,
    defaultMaxDataCount, setMaxDataCount, lastRequestStatus, data }) => {

    const [refreshPeriodComp, setRefreshPeriodComp] = useState(null) // null - default value, 0 - disable refresh
    const [prevRefreshPeriodComp, setPrevRefreshPeriodComp] = useState(null) // for start/stop button
    const [maxDataCountComp, setMaxDataCountComp] = useState(null) // null - default value

    const [graphs, setGraphs] = useState(null) // null = Traffic

    const onChangeRefreshPeriod = (newRefreshPeriodComp) => {
        setPrevRefreshPeriodComp(refreshPeriodComp) // store old state for start/stop button
        setRefreshPeriodComp(newRefreshPeriodComp)
        if (newRefreshPeriodComp === null) // default period
            setRefreshPeriod(defaultRefreshPeriod.value)
        else if (newRefreshPeriodComp === 0) // disable refresh
            setRefreshPeriod(null)
        else
            setRefreshPeriod(newRefreshPeriodComp)
    }

    return (
        <div className={classes.Menu}>
            <div className={classes.MenuControls}>
                <SelectPicker
                    size='xs'
                    label='Refresh'
                    placeholder={defaultRefreshPeriod.label}
                    searchable={false}
                    value={refreshPeriodComp}
                    data={[
                        { label: 'No', value: 0 },
                        { label: '1s', value: 1000 },
                        { label: '2s', value: 2000 },
                        { label: '3s', value: 3000 },
                        { label: '5s', value: 5000 },
                        { label: '10s', value: 10000 },
                        { label: '30s', value: 30000 },
                    ]}
                    onChange={onChangeRefreshPeriod}
                />
                &nbsp;
                <SelectPicker
                    size='xs'
                    label='Show'
                    placeholder='Traffic'
                    searchable={false}
                    value={graphs}
                    data={[
                        { label: 'Traffic', value: 'Traffic' },
                        { label: 'PPS', value: 'PPS' },
                        { label: 'Traffic+PPS', value: 'Both' },
                    ]}
                    onChange={(graphs) => {
                        setGraphs(graphs)
                        if (graphs === null || graphs === 'Traffic') { // null = Traffic
                            setShowTraffic(true)
                            setShowPps(false)
                        } else if (graphs === 'PPS') {
                            setShowTraffic(false)
                            setShowPps(true)
                        } else if (graphs === 'Both') {
                            setShowTraffic(true)
                            setShowPps(true)
                        }
                    }}
                />
                &nbsp;
                <SelectPicker
                    size='xs'
                    label='Max Points'
                    placeholder={defaultMaxDataCount.label}
                    searchable={false}
                    value={maxDataCountComp}
                    data={[
                        { label: '10', value: 10 },
                        { label: '50', value: 50 },
                        { label: '100', value: 100 },
                        { label: '500', value: 500 },
                        { label: '1000', value: 1000 },
                    ]}
                    onChange={(maxDataCountComp) => {
                        setMaxDataCountComp(maxDataCountComp)
                        if (maxDataCountComp === null) // default period
                            setMaxDataCount(defaultMaxDataCount.value)
                        else
                            setMaxDataCount(maxDataCountComp)
                    }}
                />&nbsp;
                <Button size='xs'
                    onClick={() => {
                        if (refreshPeriodComp === 0) { // pressed start
                            onChangeRefreshPeriod(prevRefreshPeriodComp) // start refreshing using old value 
                        } else { // pressed stop
                            onChangeRefreshPeriod(0) // 0 - disable refresh
                        }
                    }}
                >
                    {
                        refreshPeriodComp === 0 ?
                            'Start'
                            :
                            'Stop'
                    }
                </Button>
            </div>
            <div className={classes.MenuInfo}>
                {lastRequestStatus.isIssue ?
                    <label className={classes.IssueLabel}>
                        Status: {lastRequestStatus.status} ({lastRequestStatus.timestamp})
                    </label>
                    :
                    <label className={classes.NormalLabel}>
                        Status: {lastRequestStatus.status} {data.length === 1 ? <strong>(Wait for 2nd request)</strong> : ''}
                    </label>
                }
            </div>
        </div>
    );
};

export default TrafficModalMenu;