import React, { useEffect, useState, useRef } from 'react';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import TrafficModalChartTooltip from './TrafficModalChartTooltip';
import { formatTimestamp } from '../utils/formatTimestamp';
import { chartUnitInfo } from '../utils/chartUnitInfo';

const TrafficModalChart = ({ data, showTraffic, showPps }) => {

    const [deltas, setDeltas] = useState([]) // deltas (array of (val-prevVal)/deltaTimestamp)
    const [trafficUnitInfo, setTrafficUnitInfo] = useState([1, '']) // used for Traffic Y-axis formatting (divisor, unit)
    const [ppsUnitInfo, setPpsUnitInfo] = useState([1, '']) // used for Traffic Y-axis formatting (divisor, unit)

    const metricNames = { 'rb': 'RX Speed', 'tb': 'TX Speed', 'rp': 'RX PPS', 'tp': 'TX PPS' }

    // demoNextTs, demoPrevSeed and getValuesPerSecDemo are used only for demo
    const demoNextTs = useRef(-1)
    const demoPrevSeed = useRef(Math.floor(Date.now()) % 86400) // initial seed based on current time
    const demoMaxSpeed = useRef((1 + Math.random() * 50) * 1000000) // 1 to 51 mbit/s

    const getValuesPerSecDemo = (data, metrics) => {
        if (data.length < 2) // no way to calculate deltas
            return []

        let seed = demoPrevSeed.current // assume that data was not shifted
        if (demoNextTs.current === data[0].ts) { // data was shifted
            seed += 4 // 4 random() calls in this function
        }
        demoNextTs.current = data[1].ts // save second timestamp. if array is cur, then second timestamp will be first 
        demoPrevSeed.current = seed // save current seed to use it on next call

        // random implementaion with seed ability
        const random = max => {
            const x = Math.sin(seed++) * 100;
            return (x - Math.floor(x)) * max;
        }

        const result = []
        for (let i = 1; i < data.length; i++) {
            //skip first value (deltas.len = data.len - 1)

            const val = data[i]
            const delta = { ts: val.ts } // copy timestamp to the result

            /*  uptime calculation = timestamp(now) - timestamp(start of current month) + some value (4222)
                it will produce non-monotonous timestamp in the end of the month */
            const now = new Date()
            delta.up = Math.floor(val.ts - (new Date(now.getFullYear(), now.getMonth(), 1)).getTime() / 1000) + 4222

            const tb = random(demoMaxSpeed.current) // 0 to max speed

            delta.tb = tb
            delta.rb = delta.tb / 100 + random(0.015 * tb) // rx = tx/100 + some random
            delta.tp = delta.tb / 8000 + random(0.0002 * tb) + 1 // packet size = 1000, bits to bytes (8)
            delta.rp = delta.rb / 1600 + random(0.0006 * delta.rb) + 1 // packet size = 200, bites to bytes (8)

            result.push(delta)
        }
        return result
    }

    const getValuesPerSec = (data, metrics) => {
        if (data.length < 2) // no way to calculate deltas
            return []

        let lastVal = undefined
        const result = []
        for (const val of data) {
            if (lastVal !== undefined) { // not first step
                const delta = { ts: val.ts, up: val.up } // copy timestamp and uptime
                const timeDelta = val.ts - lastVal.ts
                for (const metric of metrics) {
                    delta[metric] = val[metric] - lastVal[metric] // delta calculation
                    if (metric === 'rb' || metric === 'tb')
                        delta[metric] *= 8 // bytes to bits
                    delta[metric] /= timeDelta // make per sec
                }
                result.push(delta)
            }
            lastVal = val
        }
        return result
    }

    useEffect(() => { // calculate deltas and max values
        const metrics = ['rb', 'tb', 'rp', 'tp']
        const deltas = process.env.REACT_APP_DEMO_MODE === '1' ?
            getValuesPerSecDemo(data, metrics) :
            getValuesPerSec(data, metrics);

        if (deltas.length > 0) { // calculate max values, Y-units, Y-divisors and deltas
            const trafficUnitInfo = chartUnitInfo(Math.max(...deltas.map(o => o.rb), ...deltas.map(o => o.tb)))
            const ppsUnitInfo = chartUnitInfo(Math.max(...deltas.map(o => o.rp), ...deltas.map(o => o.tp)))
            setDeltas(deltas)
            setTrafficUnitInfo(trafficUnitInfo)
            setPpsUnitInfo(ppsUnitInfo)
        }
    }, [data])

    return (
        <ResponsiveContainer>
            <LineChart data={deltas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ts" type='number' domain={['dataMin', 'dataMax']} tickFormatter={formatTimestamp} />
                {showTraffic ?
                    <>
                        <YAxis
                            label={{ value: 'Traffic, bps', angle: -90, position: 'insideLeft' }}
                            yAxisId={1}
                            tickFormatter={(val) => val / trafficUnitInfo[0]}
                            unit={trafficUnitInfo[1]}
                        />
                        <Line type="monotone" isAnimationActive={false} dataKey="rb" stroke="#bd7ebe" yAxisId={1} />
                        <Line type="monotone" isAnimationActive={false} dataKey="tb" stroke="#ef5675" yAxisId={1} />
                    </> : ''
                }
                {showPps ?
                    <>
                        <YAxis
                            label={showTraffic ? { value: 'Packets, pps', angle: -90, position: 'right', offset: -10 } :
                                { value: 'Packets, pps', angle: -90, position: 'insideLeft' }
                            }
                            yAxisId={2}
                            orientation={showTraffic ? 'right' : 'left'}
                            tickFormatter={(val) => val / ppsUnitInfo[0]}
                            unit={ppsUnitInfo[1]}
                        />
                        <Line type="monotone" isAnimationActive={false} dataKey="rp" stroke="#00b7c7" yAxisId={2} />
                        <Line type="monotone" isAnimationActive={false} dataKey="tp" stroke="#4421af" yAxisId={2} />
                    </> : ''
                }

                <Tooltip
                    content={<TrafficModalChartTooltip />}
                />
                <Legend formatter={(value) => metricNames[value]} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default TrafficModalChart;