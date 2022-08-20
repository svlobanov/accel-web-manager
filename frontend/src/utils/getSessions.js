import axios from 'axios';

export const getSessions = async (bras, dupSettings) => {
    let request = "sessions/" + bras
    if (dupSettings !== undefined) {
        request = "duplicates/" + bras + "/" + dupSettings['key']
    }
    const resp = await axios.get(request).catch((e) => { return e.toString() })
    if (typeof resp === 'string') { // exception
        return resp
    } else if (resp.data === undefined)
        return "no data in reply"
    else {
        return resp.data // {issues: ... , sessions: ...}
    }
}
