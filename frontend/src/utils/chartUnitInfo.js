export const chartUnitInfo = val => {
    if (val > 2000000000)
        return [1000000000, 'g']
    else if (val > 2000000)
        return [1000000, 'm']
    else if (val > 2000)
        return [1000, 'k']
    else
        return [1, '']
}
