
import { useEffect, useState } from 'react';
import axios from 'axios';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Menu from './components/Menu';
import MainView from './components/MainView';
import { processColumnSettings } from './utils/processColumnSettings'
import { getSessions } from './utils/getSessions';
import { getTime } from './utils/getTime';
import { getStats } from './utils/getStats';

import classes from './App.module.css';

import './custom-theme.less';


const App = () => {
  const [whatToShow, setWhatToShow] = useState('sessions') // what to show (grid of sessions, stats, etc)
  const [sessionInfoReady, setSessionInfoReady] = useState(false) // true if info received from backend (columns, filters, etc)
  const [disableActions, setDisableActions] = useState(true) // true if action is currently performed (to disable buttons)
  const [columns, setColumns] = useState([]); // session columns on grid received from backend
  const [sessions, setSessions] = useState(false); // sessions received from backend
  const [stats, setStats] = useState(false); // sessions received from backend
  const [brasList, setBrasList] = useState([]); // bras list received from backend
  const [selectedBras, setSelectedBras] = useState(null); // currently selected bras
  const [gridSettings, setGridSettings] = useState({}); // grid settings received from backend (pagination, etc)
  const [toastSettings, setToastSettings] = useState({}); // notifications settings
  const [privileges, setPrivileges] = useState({});
  const [duplicateKeys, setDuplicateKeys] = useState({}); // find session by .., (key => display name)
  const [lastDupSettings, setLastDupSettings] = useState(undefined); //for sessions reloading

  // load settings from backend
  useEffect(() => {
    const initSettings = async () => {
      //get base settings (API url) from fronted config file
      if (axios.defaults.baseURL === undefined) {
        if (import.meta.env.VITE_FORCE_BASE_URL === undefined) {
          const baseSettings = await axios.get(import.meta.env.VITE_SETTINGS_LINK)
          axios.defaults.baseURL = baseSettings.data['baseUrl']
        } else {
          axios.defaults.baseURL = import.meta.env.VITE_FORCE_BASE_URL
        }
      }
      // get grid settings
      const resp = await axios.get("settings")
      const columns = resp.data['columns'];
      processColumnSettings(columns);
      setColumns(columns);
      setGridSettings(resp.data['gridSettings']);
      setBrasList(resp.data['brasList']);
      setToastSettings(resp.data['toastSettings']);
      setPrivileges(resp.data['privileges'] === undefined ? {} : resp.data['privileges']);
      setDuplicateKeys(resp.data['duplicateKeys'] === undefined ? {} : resp.data['duplicateKeys']);

      const sessions = await getSessions('all')
      if (typeof sessions === 'string') {
        toast.error('Error loading sessions at ' + getTime() + ': ' + sessions)
      } else {
        setSessions(sessions)
      }
      setSessionInfoReady(true);
      setDisableActions(false)
    }
    initSettings()
  }, [])

  // (re)load session from backend
  const loadSessions = async (dupSettings, reload = false, clearToasts = true, brasOverride = selectedBras) => {
    if (clearToasts) {
      toast.clearWaitingQueue()
      toast.dismiss()
    }
    setDisableActions(true)
    const sessions = await getSessions(brasOverride === null ? 'all' : brasOverride, reload ? lastDupSettings : dupSettings)
    if (typeof sessions === 'string') {
      toast.error('Error loading sessions at ' + getTime() + ': ' + sessions)
    } else {
      if (!reload)
        setLastDupSettings(dupSettings) // store settings for reload
      setSessions(sessions)
      setWhatToShow('sessions')
    }
    setDisableActions(false)
  }

  const loadStats = async (mode, brasOverride = selectedBras) => {
    toast.clearWaitingQueue()
    toast.dismiss()
    setDisableActions(true)
    const stats = await getStats(brasOverride === null ? 'all' : brasOverride, mode)
    if (typeof stats === 'string') {
      toast.error('Error loading stats at ' + getTime() + ': ' + stats)
    } else {
      setStats(stats)
      setWhatToShow('stats')
    }
    setDisableActions(false)
  }

  // switch the active BNG and refresh the current view with it
  const changeBras = (value) => {
    setSelectedBras(value)
    // A BNG switch is a fresh query, same as pressing "Get Sessions": the
    // previous duplicate-search mode is intentionally not carried over.
    if (whatToShow === 'sessions') loadSessions(undefined, false, true, value)
    if (whatToShow === 'stats') loadStats('general', value)
  }

  return (
    <div className={classes.App}>
      <ToastContainer {...toastSettings} />
      <Menu
        privileges={privileges}
        whatToShow={whatToShow}
        disableActions={disableActions}
        sessionInfoReady={sessionInfoReady}
        setWhatToShow={setWhatToShow}
        loadStats={loadStats}
        loadSessions={loadSessions}
        duplicateKeys={duplicateKeys}
        sessions={sessions} /* for InfoBox */
        stats={stats} /* for InfoBox */
      />
      <MainView
        sessionInfoReady={sessionInfoReady}
        whatToShow={whatToShow}
        columns={columns}
        sessions={sessions}
        gridSettings={gridSettings}
        stats={stats}
        privileges={privileges} /* for dropping session */
        loadSessions={loadSessions} /* for dropping session */
        brasList={brasList}
        selectedBras={selectedBras}
        changeBras={changeBras}
      />

    </div>
  );
}

export default App;
