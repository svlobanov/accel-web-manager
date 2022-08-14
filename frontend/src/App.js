
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
  const [filterValue, setFilterValue] = useState([]); // session filters on grid received from backend
  const [brasList, setBrasList] = useState([]); // bras list received from backend
  const [selectedBras, setSelectedBras] = useState(null); // currently selected bras
  const [gridSettings, setGridSettings] = useState({}); // grid settings received from backend (pagination, etc)
  const [toastSettings, setToastSettings] = useState({}); // notifications settings
  const [privileges, setPrivileges] = useState({}) //useState({showStat: false, dropSession: false, showSessions: false})

  // load settings from backend
  useEffect(() => {
    const initSettings = async () => {
      //get base settings (API url) from fronted config file
      if (axios.defaults.baseURL === undefined) {
        if (process.env.REACT_APP_FORCE_BASE_URL === undefined) {
          const baseSettings = await axios.get(process.env.REACT_APP_SETTINGS_LINK)
          axios.defaults.baseURL = baseSettings.data['baseUrl']
        } else {
          axios.defaults.baseURL = process.env.REACT_APP_FORCE_BASE_URL
        }
      }
      // get grid settings
      const resp = await axios.get("settings")
      const columns = resp.data['columns'];
      processColumnSettings(columns);
      setColumns(columns);
      setFilterValue(columns);
      setGridSettings(resp.data['gridSettings']);
      setBrasList(resp.data['brasList']);
      setToastSettings(resp.data['toastSettings']);
      setPrivileges(resp.data['privileges'] === undefined ? {} : resp.data['privileges']);

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
  const loadSessions = async () => {
    setDisableActions(true)
    const sessions = await getSessions(selectedBras === null ? 'all' : selectedBras)
    if (typeof sessions === 'string') {
      toast.error('Error loading sessions at ' + getTime() + ': ' + sessions)
    } else {
      setSessions(sessions)
      setWhatToShow('sessions')
    }
    setDisableActions(false)
  }

  const loadStats = async () => {
    setDisableActions(true)
    const stats = await getStats(selectedBras === null ? 'all' : selectedBras)
    if (typeof stats === 'string') {
      toast.error('Error loading stats at ' + getTime() + ': ' + stats)
    } else {
      setStats(stats)
      setWhatToShow('stats')
    }
    setDisableActions(false)
  }

  return (
    <div className={classes.App}>
      <ToastContainer {...toastSettings} />
      <Menu
        privileges={privileges}
        selectedBras={selectedBras}
        setSelectedBras={setSelectedBras}
        brasList={brasList}
        disableActions={disableActions}
        sessionInfoReady={sessionInfoReady}
        setWhatToShow={setWhatToShow}
        loadStats={loadStats}
        loadSessions={loadSessions}
        sessions={sessions} /* for InfoBox */
        stats={stats} /* for InfoBox */
      />
      <MainView
        sessionInfoReady={sessionInfoReady}
        whatToShow={whatToShow}
        columns={columns}
        sessions={sessions}
        filterValue={filterValue}
        gridSettings={gridSettings}
        stats={stats}
        privileges={privileges} /* for dropping session */
        loadSessions={loadSessions} /* for dropping session */
      />
    </div>
  );
}

export default App;
