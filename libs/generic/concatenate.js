/**
 * @description TypedArray concat helper
 * @param {TypedArray} resultConstructor TypedArray Constructor eg.Uint8Array
 * @param  {...typedArray} arrays TypedArray instance array to concat
 * @returns 
 */
export default function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}