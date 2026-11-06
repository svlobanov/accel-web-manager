import React, { useMemo, useState } from 'react';

import StatsViewer from './StatsViewer';

import classes from './MainView.module.css'
import SessionsViewer from './SessionsViewer';
import LogsViewer from './LogsViewer';
import BrasList from './BrasList';

const MainView = ({ sessionInfoReady, whatToShow, columns, sessions, gridSettings, stats, privileges, loadSessions, brasList, selectedBras, changeBras }) => {
    const [query, setQuery] = useState('');
    const [stateFilter, setStateFilter] = useState('all');
    const [columnFilters, setColumnFilters] = useState({});
    const [hiddenColumns, setHiddenColumns] = useState([]);
    const sessionRows = sessions && sessions.sessions ? sessions.sessions : [];
    const sessionState = (session) => String(session.st || session.state || '').toLowerCase();
    const countByState = (state) => sessionRows.filter((session) => sessionState(session) === state).length;
    const filteredSessions = useMemo(() => sessionRows.filter((session) => {
        const matchesQuery = Object.values(session).some((value) => String(value).toLowerCase().includes(query.trim().toLowerCase()));
        const matchesState = stateFilter === 'all' || sessionState(session) === stateFilter;
        const matchesColumns = Object.entries(columnFilters).every(([name, value]) => (
            !value.trim() || String(session[name] ?? '').toLowerCase().includes(value.trim().toLowerCase())
        ));
        return matchesQuery && matchesState && matchesColumns;
    }), [columnFilters, query, sessionRows, stateFilter]);
    const visibleColumns = useMemo(
        () => columns.filter((column) => !hiddenColumns.includes(column.name)),
        [columns, hiddenColumns]
    );
    const gridSessions = sessions && sessions.sessions ? { ...sessions, sessions: filteredSessions } : { sessions: [] };
    const toggleColumn = (name) => setHiddenColumns((current) => (
        current.includes(name) ? current.filter((item) => item !== name) : [...current, name]
    ));

    return (
        <main className={classes.MainDiv}>
            {whatToShow === 'sessions' && <>
                <section className={classes.Workspace}>
                    <div className={classes.PageIntro}>
                        <div className={classes.Heading}>
                            <span className={classes.Eyebrow}>Monitoramento / PPPoE</span>
                            <h1>Sessões</h1>
                            <p>Visibilidade de ponta a ponta das sessões dos seus BNGs.</p>
                        </div>
                        <div className={classes.Metrics}>
                            <Metric label="Sessões" value={sessions === false ? '—' : sessionRows.length.toLocaleString('pt-BR')} />
                            <Metric label="Ativas" value={sessions === false ? '—' : countByState('active').toLocaleString('pt-BR')} tone="success" />
                            <Metric label="Iniciando" value={sessions === false ? '—' : countByState('start').toLocaleString('pt-BR')} tone="warning" />
                            <Metric label="Finalizando" value={sessions === false ? '—' : countByState('finish').toLocaleString('pt-BR')} tone="muted" />
                        </div>
                    </div>
                    <div className={classes.Toolbar}>
                        <label className={classes.SearchBox}>
                            <SearchIcon />
                            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar username, IP ou SID…" aria-label="Buscar sessões" />
                        </label>
                        <div className={classes.BngFilter}>
                            <span className={classes.BngFilterLabel}>BNG:</span>
                            <BrasList className={classes.BngPicker} menuClassName={classes.BngPickerMenu} placeholder="Todos" allLabel="Todos" cleanable={false} brasList={brasList} selectedBras={selectedBras} setSelectedBras={changeBras} />
                        </div>
                        <label className={classes.StateSelect}>
                            <span>Estado:</span>
                            <select value={stateFilter} onChange={(event) => setStateFilter(event.target.value)} aria-label="Filtrar por estado">
                                <option value="all">todos</option>
                                <option value="active">active</option>
                                <option value="start">start</option>
                                <option value="finish">finishing</option>
                                <option value="unk">unknown</option>
                            </select>
                        </label>
                        <span className={classes.ResultsCount}>{filteredSessions.length.toLocaleString('pt-BR')} de {sessionRows.length.toLocaleString('pt-BR')} sessões</span>
                        <details className={classes.ColumnsPicker}>
                            <summary className={classes.ColumnsButton}>
                                <ColumnsIcon />
                                <span>Colunas</span>
                            </summary>
                            <div className={classes.ColumnsMenu}>
                                {columns.map((column) => (
                                    <label key={column.name} className={classes.ColumnsItem}>
                                        <input type="checkbox" checked={!hiddenColumns.includes(column.name)} onChange={() => toggleColumn(column.name)} />
                                        <span>{column.header}</span>
                                    </label>
                                ))}
                            </div>
                        </details>
                    </div>
                </section>
            </>}
            {sessionInfoReady === true && whatToShow === 'sessions' ?
                <SessionsViewer
                    columns={visibleColumns}
                    sessions={gridSessions}
                    columnFilters={columnFilters}
                    setColumnFilters={setColumnFilters}
                    privileges={privileges}
                    loadSessions={loadSessions}
                    gridSettings={gridSettings}
                /> :
                (whatToShow === 'stats' ?
                    <StatsViewer stats={stats} /> :
                    (whatToShow === 'logs' ? <LogsViewer /> : <p className={classes.EmptyState}>System is not ready</p>))
            }
        </main>
    );
};

const SearchIcon = () => (
    <svg className={classes.SearchIcon} viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
        <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M10.5 10.5 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

const ColumnsIcon = () => (
    <svg className={classes.ColumnsIcon} viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
        <rect x="1.5" y="2.5" width="13" height="11" rx="1.5" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M6 2.5v11M10.5 2.5v11" fill="none" stroke="currentColor" strokeWidth="1.3" />
    </svg>
);

const Metric = ({ label, value, tone = '' }) => <div className={classes.MetricCard}><span>{label}</span><strong className={tone ? classes[tone] : ''}>{value}</strong></div>;
export default MainView;
