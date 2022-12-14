import SelectFilter from '@inovua/reactdatagrid-community/SelectFilter'
import filesize from 'filesize'

import { sortIPv4 } from './sortIPv4'
import { sortRate } from './sortRate'
import { formatDuration } from './formatDuration'

export const processColumnSettings = (columns) => {
    columns.forEach((column) => {
        if (column['filterEditor'] === "SelectFilter")
            column['filterEditor'] = SelectFilter;

        switch (column['sort']) {
            case 'ipv4':
                column['sort'] = sortIPv4 // correct sort ipv4 (1.1.1.8 < 1.1.1.10)
                break
            case 'rate':
                column['sort'] = sortRate // correct sort rate-limits ('50/50' < '4000/4000')
                break;
            default:
                break
        }

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
                column['render'] = ({ value }) => formatDuration(value)
                break
            default:
                break
        }
    });
}
