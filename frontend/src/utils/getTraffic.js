import axios from 'axios';

// generate zero data for demo purposes (real data will be generated during deltas calculation)
const getTrafficDemo = async () => {
    const ts = Date.now() / 1000
    await new Promise(r => setTimeout(r, 300)) // 300 ms delays
    return {
        ts: ts,
        rb: 0,
        tb: 0,
        rp: 0,
        tp: 0,
        up: 0
    }
}

export const getTraffic = async (bras, sid) => {

    if(process.env.REACT_APP_DEMO_MODE==='1')
        return getTrafficDemo()

    let getResp = await axios.get("traffic/bras/" + bras + "/sid/" + sid)
        .catch((e) => { return e.toString() })

    if (typeof getResp === 'string') { // exception
        return getResp
    } else if (getResp.data === undefined)
        return "reply is empty"
    else {
        if (getResp.data['status'] === 'ok')
            return getResp.data['traffic']
        else
            return getResp.data['status']
    }
}
