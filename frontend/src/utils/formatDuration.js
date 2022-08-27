import { Duration } from 'luxon'

export const formatDuration = value => Duration.fromMillis(value * 1000).toFormat('d.hh:mm:ss')