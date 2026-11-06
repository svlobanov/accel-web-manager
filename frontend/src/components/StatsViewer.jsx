import React from 'react';
import classes from './StatsViewer.module.css';

const parseStats = (raw) => {
    if (typeof raw !== 'string') return [];
    const sections = [];
    let current = { title: 'Geral', rows: [] };
    for (const line of raw.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        const section = trimmed.match(/^([\w -]+):$/);
        if (section) {
            if (current.rows.length) sections.push(current);
            current = { title: section[1], rows: [] };
            continue;
        }
        const pair = trimmed.match(/^([^:]+):\s*(.*)$/);
        if (pair) current.rows.push([pair[1].trim(), pair[2].trim()]);
        else current.rows.push([trimmed, '']);
    }
    if (current.rows.length) sections.push(current);
    return sections;
};

const StatsViewer = ({ stats }) => (
    <main className={classes.container}>
        <header className={classes.header}>
            <div><span className={classes.eyebrow}>Monitoramento / Infraestrutura</span><h1>Estatísticas dos servidores</h1><p>Dados operacionais por BNG.</p></div>
            <span className={classes.count}>{stats?.stats ? Object.keys(stats.stats).length : 0} servidores</span>
        </header>
        <section className={classes.cards}>
            {stats?.stats && Object.entries(stats.stats).map(([bras, raw]) => {
                // The backend reports failed BNGs explicitly in `issues`; never
                // infer failure from the output text (it contains counters such
                // as "errors" in healthy dumps).
                const failed = Object.prototype.hasOwnProperty.call(stats.issues || {}, bras);
                const sections = parseStats(raw);
                return <article key={bras} className={`${classes.card} ${failed ? classes.failed : ''}`}>
                    <div className={classes.cardHead}><div><h2>{bras}</h2><span>Saída de stats</span></div><span className={failed ? classes.errorBadge : classes.okBadge}>{failed ? 'Erro' : 'OK'}</span></div>
                    {failed ? <pre className={classes.errorText}>{raw}</pre> : <div className={classes.sections}>{sections.map((section, index) => <section key={`${section.title}-${index}`} className={classes.section}><h3>{section.title}</h3><dl>{section.rows.map(([label, value], row) => <React.Fragment key={`${label}-${row}`}><dt>{label}</dt><dd>{value || '—'}</dd></React.Fragment>)}</dl></section>)}</div>}
                </article>;
            })}
        </section>
    </main>
);

export default StatsViewer;
