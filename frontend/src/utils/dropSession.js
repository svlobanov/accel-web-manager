import axios from 'axios';

export const dropSession = async (bras, sid, mode) => {
    let delResp = await axios.delete("session/bras/" + bras + "/sid/" + sid + "/mode/" + mode)
        .catch((e) => { return e.toString() })

    if (typeof delResp === 'string') { // exception
        return delResp
    } else if (delResp.data === undefined)
        return "reply is empty"
    else {
        if (delResp.data['status'] === 'ok')
            return "ok"
        else
            return delResp.data['status']
    }
}
