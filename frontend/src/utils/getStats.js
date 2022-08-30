import axios from 'axios';

export const getStats = async (bras, mode) => {
    const resp = await axios.get("stats/" + bras + "/" + mode).catch((e) => { return e.toString() })
    if (typeof resp === 'string') { // exception
        return resp
    } else if (resp.data === undefined)
        return "no data in reply"
    else {
        return resp.data // {issues: ... , stats: ...}
    }
}
