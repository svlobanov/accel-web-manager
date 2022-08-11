import { toast } from 'react-toastify';
import { dropSession } from '../dropSession';

export const renderSessionContextMenu = (loadSessions, menuProps, { rowProps, cellProps }) => {
  const sessionName = (ses) => {
    return [ses['ke'], ses['if'], ses['us']].join(' ')
  }

  const terminateLabel = (ses, mode) => {
    return "Terminate " + mode + " (" + ses['if'] + ", " + ses['us'] + ") by sid " + ses['ke']
  }

  const terminate = async (ses, mode) => {
    const drop = await dropSession(ses['br'], ses['si'], mode)
    
    const msgPrefix = "Drop session (" + mode + ") " + sessionName(ses)

    if (drop === 'ok') {
      toast.success(msgPrefix + ": done")
      loadSessions()
    } else {
      toast.error(msgPrefix + ": " + drop)
      loadSessions()
    }
    menuProps.onDismiss();
  }

  const ses = rowProps.data
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
