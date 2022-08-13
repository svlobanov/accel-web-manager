
import { useEffect, useCallback, useState } from 'react';
import axios from 'axios';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { processColumnSettings } from './utils/processColumnSettings'
import { getSessions } from './utils/getSessions';
import { getTime } from './utils/getTime';
import { getStats } from './utils/getStats';
import StatsViewer from './components/StatsViewer';
import BrasList from './components/BrasList';
import InfoBox from './components/InfoBox';
import { renderSessionContextMenu } from './utils/ui/renderSessionContextMenu';

import './App.css';

import { Button } from 'rsuite'
import 'rsuite/dist/rsuite.min.css';
//import 'custom-theme.less';

const App = () => {
  const [whatToShow, setWhatToShow] = useState('sessions') // what to show (grid of sessions, stats, etc)
  const [sessionInfoReady, setSessionInfoReady] = useState(false) // true if info received from backend (columns, filters, etc)
  const [disableActions, setDisableActions] = useState(true) // true if action is currently performed (to disable buttons)
  const [updateInfo, setUpdateInfo] = useState({}) // update status
  const [columns, setColumns] = useState([]); // session columns on grid received from backend
  const [sessions, setSessions] = useState(false); // sessions received from backend
  const [stats, setStats] = useState(false); // sessions received from backend
  const [filterValue, setFilterValue] = useState([]); // session filters on grid received from backend
  const [brasList, setBrasList] = useState([]); // bras list received from backend
  const [selectedBras, setSelectedBras] = useState(null); // currently selected bras
  const [gridSettings, setGridSettings] = useState({}); // grid settings received from backend (pagination, etc)
  const [toastSettings, setToastSettings] = useState({}); // notifications settings
  const [selectedSessions, setSelectedSessions] = useState({}) // selected sessions (to save selected sessions on reload)
  const [privileges, setPrivileges] = useState({}) //useState({showStat: false, dropSession: false, showSessions: false})

  // load settings from backend
  useEffect(() => {
    const initSettings = async () => {
      //get base settings (API url) from fronted config file
      if (axios.defaults.baseURL === undefined) {
        if (process.env.REACT_APP_FORCE_BASE_URL === undefined) {
          let baseSettings = await axios.get(process.env.REACT_APP_SETTINGS_LINK)
          axios.defaults.baseURL = baseSettings.data['baseUrl']
        } else {
          axios.defaults.baseURL = process.env.REACT_APP_FORCE_BASE_URL
        }
      }
      // get grid settings
      let resp = await axios.get("settings")
      let columns = resp.data['columns'];
      processColumnSettings(columns);
      setColumns(columns);
      setFilterValue(columns);
      setGridSettings(resp.data['gridSettings']);
      setBrasList(resp.data['brasList']);
      setToastSettings(resp.data['toastSettings']);
      setPrivileges(resp.data['privileges'] === undefined ? {} : resp.data['privileges']);
      setSessionInfoReady(true);
    }
    initSettings()
  }, [])

  // load sessions when it's ready 
  useEffect(() => {
    if (sessionInfoReady === true && privileges['showSessions'] === true)
      loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionInfoReady])

  // change last updated when update sesssions
  useEffect(() => {
    if (sessions !== false)
      //sessions['sessions'].length
      setUpdateInfo({ lastUpdated: getTime() + " sessions:" + sessions['sessions'].length, issues: sessions['issues'] })
    else
      setUpdateInfo({ lastUpdated: 'never', issues: {} })
  }, [sessions])

  // change last updated when update stats
  useEffect(() => {
    if (stats !== false)
      setUpdateInfo({ lastUpdated: getTime() + " count:" + Object.keys(stats['stats']).length, issues: stats['issues'] })
    else
      setUpdateInfo({ lastUpdated: 'never', issues: {} })
  }, [stats])

  // (re)load session from backend
  const loadSessions = async () => {
    setDisableActions(true)
    const sessions = await getSessions(selectedBras === null ? 'all' : selectedBras)
    if (typeof sessions === 'string') {
      toast.error('Error loading sessions at ' + getTime() + ': ' + sessions)
    } else {
      setSessions(sessions)
    }
    setDisableActions(false)
  }

  const onGetSessions = async () => {
    toast.clearWaitingQueue()
    toast.dismiss()
    await loadSessions()
    setWhatToShow('sessions')
  }

  const loadStats = async () => {
    setDisableActions(true)
    const stats = await getStats(selectedBras === null ? 'all' : selectedBras)
    if (typeof stats === 'string') {
      toast.error('Error loading stats at ' + getTime() + ': ' + stats)
    } else {
      setStats(stats)
    }
    setDisableActions(false)
  }

  const onGetStats = async () => {
    toast.clearWaitingQueue()
    toast.dismiss()
    await loadStats()
    setWhatToShow('stats')
  }


  const renderSessionContextMenu2 = useCallback((menuProps, other) => {
    if (privileges['dropSession'] === true)
      renderSessionContextMenu(loadSessions, menuProps, other)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privileges])

  const onSessionSelectionChange = useCallback(({ selected }) => {
    setSelectedSessions(selected)
  }, [])

  return (
    <div className="App">
      <ToastContainer {...toastSettings} />
      <div className='Menu'>
        <div className='MenuButtons'>
          <BrasList value={selectedBras} brasList={brasList} setSelectedBras={setSelectedBras} />&nbsp;
          {privileges['showSessions'] === true ?
            <Button size='xs' onClick={onGetSessions} style={{ cursorDisabled: "default" }} disabled={disableActions || !sessionInfoReady}>Get Sessions</Button>
            : ''
          }
          &nbsp;
          {privileges['showStats'] === true ?
            <Button size='xs' onClick={onGetStats} disabled={disableActions}>Get Stats</Button>
            : ''
          }
        </div>
        <div className='MenuInfo'>
          <InfoBox updateInfo={updateInfo['lastUpdated']} issues={updateInfo['issues']} />
        </div>
      </div>
      <div className='MainDiv'>
        {sessionInfoReady === true && whatToShow === 'sessions' ?
          <ReactDataGrid
            idProperty="ke" /* key (bras+sid) */
            columns={columns}
            dataSource={sessions.hasOwnProperty('sessions') ? sessions['sessions'] : []} // session list
            defaultFilterValue={filterValue}
            renderRowContextMenu={renderSessionContextMenu2}
            showColumnMenuGroupOptions={false} /* non-free feature, doesn't work in community version */
            showColumnMenuLockOptions={false} /* non-free feature, doesn't work in community version */
            enableColumnAutosize={false} /* non-free feature, doesn't work in community version */
            showColumnMenuFilterOptions={false}
            enableFiltering={true}
            columnUserSelect={true}
            className='Grid'
            selected={selectedSessions}
            onSelectionChange={onSessionSelectionChange}
            {...gridSettings}
          /> : (whatToShow === 'stats' ? <StatsViewer data={stats['stats']} />
            : <p>System is not ready</p>)
        }
      </div>
    </div>
  );
}

export default App;
