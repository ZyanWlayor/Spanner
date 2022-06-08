/**
 * @description wait ms millisecond
 * @param {integer} ms duration for wait in millisecond
 * @returns {Promise}
 */
export default function wait(ms){
    return new Promise((resolve)=>{
        setTimeout(resolve,ms)
    })
}