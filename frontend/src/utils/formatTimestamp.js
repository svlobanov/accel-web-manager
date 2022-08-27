import { DateTime } from 'luxon'

export const formatTimestamp = timestamp => DateTime.fromSeconds(timestamp).toFormat('HH:mm:ss')