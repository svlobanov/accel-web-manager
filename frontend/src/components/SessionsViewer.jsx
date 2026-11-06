import React, { useEffect, useMemo, useState } from 'react';

import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css';
import '@inovua/reactdatagrid-community/theme/default-dark.css';

import TrafficModal from './TrafficModal';

import { renderSessionContextMenu } from '../utils/ui/renderSessionContextMenu'

import classes from './SessionsViewer.module.css'

const MONO_COLUMNS = ['si', 'if', 'up', 'ip', 'i6', 'i6d', 'cgs', 'cds', 'cm', 'rl', 'rb', 'tb', 'rp', 'tp']
const STATE_LABELS = { active: 'active', start: 'start', finish: 'finishing', unk: 'unknown' }

// Styling hooks consumed by SessionsViewer.module.css. The grid keeps its
// theme CSS, so the presentation is layered on top instead of reimplemented.
const decorateColumn = (column) => {
    if (column.name === 'st') {
        return {
            ...column,
            render: ({ value }) => {
                const state = String(value ?? '').toLowerCase()
                return <span className={`awm-state awm-state--${STATE_LABELS[state] ? state : 'unk'}`}>{STATE_LABELS[state] || state || '—'}</span>
            },
        }
    }
    if (column.name === 'us') return { ...column, cellClassName: 'awm-cell awm-cell--strong' }
    if (MONO_COLUMNS.includes(column.name)) return { ...column, cellClassName: 'awm-cell awm-cell--mono' }
    return column
}

const SessionsViewer = ({ columns, sessions, columnFilters, setColumnFilters, privileges, loadSessions, gridSettings }) => {
    const [selectedSessions, setSelectedSessions] = useState({}) // selected sessions (to save selected sessions on reload)
    const [trafficModal, setTrafficModal] = useState({ open: false, ses: {} })
    const [openFilterColumn, setOpenFilterColumn] = useState(null)
    const [isDarkTheme, setIsDarkTheme] = useState(() => document.documentElement.dataset.theme === 'synthwave')
    const gridColumns = useMemo(() => columns.map(column => {
        const decorated = decorateColumn(column)
        return {
            ...decorated,
            renderHeader: ({ children }) => {
                const parts = Array.isArray(children) ? children : [children]
                const sortTools = parts.length > 1 ? parts.slice(1) : null
                const active = Boolean(columnFilters[column.name]?.trim())
                const expanded = openFilterColumn === column.name
                return <div className={classes.ColumnHeaderContent}>
                    <div className={classes.ColumnHeaderLine}>
                        <span className={classes.ColumnHeaderLabel}>{column.header}</span>
                        {active && <button
                            type="button"
                            className={classes.ActiveFilterIndicator}
                            aria-label={`Limpar filtro da coluna ${column.header}`}
                            title={`Limpar filtro de ${column.header}`}
                            onClick={event => {
                                event.stopPropagation()
                                setColumnFilters(current => ({ ...current, [column.name]: '' }))
                            }}
                        ><FilterIcon /></button>}
                        {sortTools}
                    </div>
                    {expanded && <input
                        autoFocus
                        className={classes.ColumnFilterInput}
                        type="search"
                        value={columnFilters[column.name] || ''}
                        placeholder={`Filtrar ${column.header}…`}
                        aria-label={`Filtrar coluna ${column.header}`}
                        onClick={event => event.stopPropagation()}
                        onKeyDown={event => event.stopPropagation()}
                        onChange={event => setColumnFilters(current => ({ ...current, [column.name]: event.target.value }))}
                    />}
                </div>
            },
        }
    }), [columns, columnFilters, openFilterColumn, setColumnFilters])

    useEffect(() => {
        const themeObserver = new MutationObserver(() => {
            setIsDarkTheme(document.documentElement.dataset.theme === 'synthwave')
        })
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
        return () => themeObserver.disconnect()
    }, [])

    return (
        <>
            <ReactDataGrid
                idProperty="ke" /* key (bras+sid) */
                columns={gridColumns}
                dataSource={sessions.hasOwnProperty('sessions') ? sessions['sessions'] : []} // session list
                renderRowContextMenu={(menuProps, other) => renderSessionContextMenu(privileges, loadSessions, trafficModal, setTrafficModal, menuProps, other)}
                showColumnMenuGroupOptions={false} /* non-free feature, doesn't work in community version */
                showColumnMenuLockOptions={false} /* non-free feature, doesn't work in community version */
                enableColumnAutosize={false} /* non-free feature, doesn't work in community version */
                showColumnMenuFilterOptions={false}
                enableFiltering={false}
                renderColumnContextMenu={(menuProps, { cellProps, computedProps }) => {
                    const column = columns.find(item => item.name === cellProps.id)
                    if (!column) return undefined
                    const active = Boolean(columnFilters[column.name]?.trim())
                    const expanded = openFilterColumn === column.name
                    menuProps.items = [
                        {
                            label: expanded ? `Fechar filtro de ${column.header}` : active ? `Editar filtro de ${column.header}…` : `Filtrar ${column.header}…`,
                            itemId: `toggle-filter-${column.name}`,
                            onClick: () => {
                                setOpenFilterColumn(expanded ? null : column.name)
                                computedProps.hideColumnContextMenu()
                            },
                        },
                        active ? {
                            label: `Desativar filtro de ${column.header}`,
                            itemId: `clear-filter-${column.name}`,
                            onClick: () => {
                                setColumnFilters(current => ({ ...current, [column.name]: '' }))
                                setOpenFilterColumn(null)
                                computedProps.hideColumnContextMenu()
                            },
                        } : null,
                        ...(menuProps.items.length ? ['-'] : []),
                        ...menuProps.items,
                    ].filter(Boolean)
                    return undefined
                }}
                columnUserSelect={true}
                rowHeight={44}
                headerHeight={openFilterColumn ? 76 : 44}
                className={classes.Grid}
                selected={selectedSessions}
                onSelectionChange={({ selected }) => { setSelectedSessions(selected) }}
                {...gridSettings}
                theme={isDarkTheme ? 'default-dark' : 'default-light'}
            />
            {trafficModal.open ?
                <TrafficModal modal={trafficModal} setModal={setTrafficModal} /> :
                ''
            }
        </>
    );
};

export default SessionsViewer;

const FilterIcon = () => <svg viewBox="0 0 16 16" width="13" height="13" aria-hidden="true">
    <path d="M2 3h12l-4.5 5v4l-3 1V8L2 3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
</svg>
