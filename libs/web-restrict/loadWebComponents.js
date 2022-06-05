/**
 * @description a simple wrapper for fetch raw content for a asset
 * @param {String|Request} input target to request
 * @param {requestInit} init request params
 * @returns 
 */
function requestRaw(input, init) {
    return fetch(input, init).then(function (response) {
        if (response.ok) {
            return response.text()
        } else {
            return Promise.reject()
        }
    })
}

/**
    * @description util function to load web components,recommand to invoke this function before body parse
    * @param string[] web componets name array to load
    */
export default function loadComponents(components) {
    return Promise.all(components.map(component => {
        return new Promise((resolve) => {
            return requestRaw(`/components/templates/${component}.html`).then(templateContent => {
                // inject web component template
                const templateElement = document.createElement("template")
                templateElement.setAttribute("id", `${component}-template`)
                templateElement.innerHTML = templateContent
                document.querySelector('head').appendChild(templateElement)

                // inject web component definition class
                const scriptElement = document.createElement('script')
                scriptElement.setAttribute('src', `/components/${component}.js`)
                document.querySelector("head").append(scriptElement)
                resolve()
            }).catch((error) => {
                console.log(`load component [${component}] error :`, error)
                resolve()
            })
        })
    }))
}

