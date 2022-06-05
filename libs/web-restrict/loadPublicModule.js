/**
     * @description infinite wait before module loaded
     * @param {string[]} modules name arrays for module injected window
     * @returns {module[]} modules loaded
     */
export default function loadPublicModule(modules) {
    return Promise.all(modules.map(module => {
        return new Promise(async (resolve) => {
            while (true) {
                if (window[module]) {
                    resolve(window[module])
                    break;
                } else {
                    await Utils.wait(500)
                }
            }

        })
    }))
}