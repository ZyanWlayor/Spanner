/**
 * @description retry helpers regenerator promise object every time
 * @param promiseFn Promise function to reExecute each retry time
 * @param times times
 * @returns Promise<T>
 */
export default function retryPromise(promiseFn, times = 5, retryInterval = 0) {
    return new Promise((resolve, reject) => {
        let runtimes = 0
        function retryWrapperFn() {
            promiseFn().then((result) => {
                resolve(result)
            }).catch((err) => {
                // detect strike reject to whole, it ignore retry times option and reject directly
                if (err.mode === 'strike') {
                    reject(err)
                    return
                }
                if (!times) {
                    setTimeout(() => retryWrapperFn(), retryInterval)
                } else if (runtimes < times) {
                    setTimeout(() => retryWrapperFn(), retryInterval)
                } else {
                    const retryError = new Error(`retryPromise exceed ${times} times : ${err.toString()}`)
                    reject(retryError)
                }

            }).finally(() => {
                runtimes++
            })
        }

        retryWrapperFn()

    })
}