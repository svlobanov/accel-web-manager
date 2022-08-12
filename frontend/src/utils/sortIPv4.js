// sort function for ipv4 addresses presented in string to use as compareFn in Array.prototype.sort()
export const sortIPv4 = (ip1, ip2) => {
    const ip1Int = ip1.split('.').reduce((ipI, oct) => { return (ipI << 8) + parseInt(oct, 10) }, 0) >>> 0
    const ip2Int = ip2.split('.').reduce((ipI, oct) => { return (ipI << 8) + parseInt(oct, 10) }, 0) >>> 0
    return ip1Int - ip2Int
}
