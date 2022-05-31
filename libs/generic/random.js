/**
 * @description random num between min and max (include min and max)
 * @param {Integer} rMi min
 * @param {Integer} rMa max
 * @returns 
 */
export default function random(rMi, rMa) { return ~~((Math.random() * (rMa - rMi + 1)) + rMi); }