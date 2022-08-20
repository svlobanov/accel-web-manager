import { toast } from 'react-toastify';
import { dropSession } from '../dropSession';

export const renderSessionContextMenu = (privileges, loadSessions, menuProps, { rowProps, cellProps }) => {
  const sessionName = (ses) => {
    return [ses['ke'], ses['if'], ses['us']].join(' ')
  }

  const terminateLabel = (ses, mode) => {
    return "Terminate " + mode + " (" + ses['if'] + ", " + ses['us'] + ") by sid " + ses['ke']
  }

  const terminate = async (ses, mode) => {
    const drop = await dropSession(ses['br'], ses['si'], mode)

    const msgPrefix = "Drop session (" + mode + ") " + sessionName(ses)

    toast.clearWaitingQueue()
    toast.dismiss()
    if (drop === 'ok') {
      toast.success(msgPrefix + ": done")
      loadSessions(undefined, true, false)
    } else {
      toast.error(msgPrefix + ": " + drop)
    }
    menuProps.onDismiss();
  }

  const ses = rowProps.data
  if (privileges['dropSession'] === true) {
    menuProps.autoDismiss = false
    menuProps.items = [
      {
        label: terminateLabel(ses, 'soft'),
        onClick: async () => { terminate(ses, 'soft') }
      },
      {
        label: terminateLabel(ses, 'hard'),
        onClick: async () => { terminate(ses, 'hard') }
      }
    ]
  }
}
