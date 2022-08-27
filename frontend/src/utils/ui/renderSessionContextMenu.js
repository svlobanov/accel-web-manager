import { toast } from 'react-toastify';
import { dropSession } from '../dropSession';

export const renderSessionContextMenu = (privileges, loadSessions, trafficModal, setTrafficModal, menuProps, { rowProps, cellProps }) => {
  const sessionName = (ses) => {
    return [ses['ke'], ses['if'], ses['us']].join(' ')
  }

  const terminateLabel = (ses, mode) => {
    return "Terminate " + mode + " (" + ses['if'] + ", " + ses['us'] + ") by sid " + ses['ke']
  }

  const trafficLabel = (ses) => {
    return "Show Traffic for (" + ses['if'] + ", " + ses['us'] + ") by sid " + ses['ke']
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

  const openTrafficModal = (ses) => {
    setTrafficModal({ ...trafficModal, open: true, ses: ses })
    menuProps.onDismiss();
  }

  const ses = rowProps.data
  const menuItems = []

  if (privileges['showSessions'] === true) {
    menuItems.push(
      {
        label: trafficLabel(ses),
        onClick: () => { openTrafficModal(ses) }
      }
    )
  }

  if (privileges['dropSession'] === true) {
    menuItems.push(
      {
        label: terminateLabel(ses, 'soft'),
        onClick: async () => { terminate(ses, 'soft') }
      },
      {
        label: terminateLabel(ses, 'hard'),
        onClick: async () => { terminate(ses, 'hard') }
      }
    )
  }

  if (menuItems.length > 0) {
    menuProps.autoDismiss = false
    menuProps.items = menuItems
  }
}
