import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import filesize from 'filesize'
import { Duration } from 'luxon'

import { sortIPv4 } from './sortIPv4'

export const processColumnSettings = (columns) => {
    columns.forEach((column) => {
        if (column['filterEditor'] === "SelectFilter")
            column['filterEditor'] = SelectFilter;

        if (column['sort'] === 'ipv4')
            column['sort'] = sortIPv4 // correct sort ipv4 (1.1.1.8 < 1.1.1.10)

        switch (column['render']) {
            case 'size': // bytes to KB, MB, etc (using 1024 divisor)
                column['render'] = ({ value }) => filesize(value)
                break
            case 'size2': // pkts to kilo-, mega-, etc-pkts (using 1000 divisor)
                column['render'] = ({ value }) => filesize(value, {
                    base: 10, standard: 'jedec',
                    symbols: { "B": " ", "kB": "K", "MB": "M", "GB": "G", "TB": "T", "PB": "P", "EB": "E", "ZB": "Z", "YB": "Y" }
                })
                break
            case 'Duration':
                column['render'] = ({ value }) => Duration.fromMillis(value * 1000).toFormat('d.hh:mm:ss');
                break
            default:
                break
        }
    });
}
