// sort function for rate-limit presented in string to use as compareFn in Array.prototype.sort()
export const sortRate = (rate1, rate2) => {
    // parseInt() converts '1000/1245' to 1000
    const rate1Int = parseInt(rate1)
    const rate2Int = parseInt(rate2)

    // parseInt() return NaN if input string is empty. Empty string means 'no rate-limit' = max speed
    return (isNaN(rate1Int) ? Number.MAX_SAFE_INTEGER : rate1Int) - (isNaN(rate2Int) ? Number.MAX_SAFE_INTEGER : rate2Int)
}
