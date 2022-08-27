import React from 'react';

import { Modal } from 'rsuite';

import { useState, useEffect } from 'react';

import TrafficModalMenu from './TrafficModalMenu';
import TrafficModalChart from './TrafficModalChart';

import { getTime } from '../utils/getTime';
import { getTraffic } from '../utils/getTraffic';

import classes from './TrafficModal.module.css'

const TrafficModal = ({ modal, setModal }) => {
    const [data, setData] = useState([]) // raw data (not deltas)

    const defaultRefreshPeriod = { label: '1s', value: '1000' }
    const [refreshPeriod, setRefreshPeriod] = useState(defaultRefreshPeriod.value) // null - disable refresh

    const defaultMaxDataCount = { label: '50', value: 50 }
    const [maxDataCount, setMaxDataCount] = useState(defaultMaxDataCount.value)

    const [showTraffic, setShowTraffic] = useState(true) // show Traffic by default
    const [showPps, setShowPps] = useState(false) // do not show PPS by default

    const defaultLastRequestStatus = { isIssue: false, status: 'Start' }
    const [lastRequestStatus, setLastRequestStatus] = useState(defaultLastRequestStatus)

    const handleClose = () => {
        setModal(current => ({ ...current, open: false }))
    }

    const getTitle = (ses) => {
        return "Traffic for (" + ses['if'] + ", " + ses['us'] + ") by sid " + ses['ke']
    }

    useEffect(() => { // periodical get data
        let interval // timer object
        let isFinished = true // true if not in cycle
        let storeResult = true // true if not finished

        const getNewValue = async () => {
            if (!isFinished)
                return // skip this cycle if previous is not finished yet

            isFinished = false // do not allow to start this func in parallel

            const newData = await getTraffic(modal.ses['br'], modal.ses['si'], refreshPeriod) // get new values from backend

            if (storeResult && typeof newData !== 'string') { // store new data and cut off 'data' according to maxDataCount
                setData(current => current.length < maxDataCount + 1 ?
                    [...current, newData] :
                    [...current, newData].slice(current.length - maxDataCount)
                )
                setLastRequestStatus({ isIssue: false, status: 'Ok' })
            } else if (typeof newData === 'string') { // error during getting new data from backed
                if (newData === 'SESSION_NOT_FOUND') {
                    // stop refreshing (no reason to continue backend polling)
                    clearInterval(interval)
                    setLastRequestStatus({ isIssue: true, status: 'Stopped (no session)', timestamp: getTime() })
                } else { // other issues (e.g. backend is not available or BE-accel communication issues)
                    setLastRequestStatus({ isIssue: true, status: newData, timestamp: getTime() })
                }
            }
            isFinished = true // allow to run next cycle
        }

        if (modal.open === true) {
            if (refreshPeriod !== null) { // refresh is enabled
                getNewValue() // get a value immediately (no need to wait first timer tick)
                interval = setInterval(getNewValue, refreshPeriod); // start timer (periodical)
            } else { // refresh is not enabled. do nothing and set 'No refresh' status
                // disable refresh code is not required due to it is done on clear
                setLastRequestStatus({ isIssue: false, status: 'No Refresh' })
            }
        }

        return () => {
            //console.log('clear timer effect')
            clearInterval(interval) // stop timer (disable next cycle)
            storeResult = false // if timer is stopped during execution, then drop this value
        }
    }, [modal, refreshPeriod, maxDataCount])

    return (
        <Modal size='full' open={modal.open} onClose={handleClose}>
            <Modal.Header>
                <Modal.Title>{getTitle(modal.ses)}</Modal.Title>
            </Modal.Header>
            <Modal.Body className={classes.Body}>
                <div className={classes.Content}>
                    <TrafficModalMenu
                        defaultRefreshPeriod={defaultRefreshPeriod}
                        setRefreshPeriod={setRefreshPeriod}
                        setShowPps={setShowPps}
                        setShowTraffic={setShowTraffic}
                        defaultMaxDataCount={defaultMaxDataCount}
                        setMaxDataCount={setMaxDataCount}
                        lastRequestStatus={lastRequestStatus}
                        data={data}
                    />
                    <TrafficModalChart
                        data={data}
                        showTraffic={showTraffic}
                        showPps={showPps}
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default TrafficModal;