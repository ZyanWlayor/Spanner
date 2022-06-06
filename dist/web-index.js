(function () {
    'use strict';

    /**
     * @description Handle file size readability
     * @param {Integer} value file size of byte unit
     * @returns {String} readable file size
     */
    function readableSize(value){
        if(null==value||value==''){
            return "0 Bytes";
        }
        var unitArr = new Array("Bytes","KB","MB","GB","TB","PB","EB","ZB","YB");
        var index=0;
        var srcsize = parseFloat(value);
        index=Math.floor(Math.log(srcsize)/Math.log(1024));
        var size =srcsize/Math.pow(1024,index);
        size=size.toFixed(2);// decimal digit to keep
        return size+unitArr[index];
    }

    /**
     * @description random num between min and max (include min and max)
     * @param {Integer} rMi min
     * @param {Integer} rMa max
     * @returns {Integer}
     */
    function random(rMi, rMa) { return ~~((Math.random() * (rMa - rMi + 1)) + rMi); }

    /**
     * @description a guid generator
     * @returns {String} a guid eg. '9a9681bb-4dfa-6750-5ae4-9530209d8a9d'
     */
    function newGuid() {
        var guid = "";
        for (var i = 1; i <= 32; i++) {
            var n = Math.floor(Math.random() * 16.0).toString(16);
            guid += n;
            if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
                guid += "-";
        }
        return guid;
    }

    /**
     * @description datetime formatter
     * @param {Date} value a date object struct by `new Date(*)`
     * @param {String} fmt a fmt string like "MM-dd ..."
     * @returns {String}
     */
    function dateTimeFormat(value, fmt) {
        var o = {
            "M+": value.getMonth() + 1, //月份
            "d+": value.getDate(), //日
            "h+": value.getHours(), //小时
            "m+": value.getMinutes(), //分
            "s+": value.getSeconds(), //秒
            "q+": Math.floor((value.getMonth() + 3) / 3), //季度
            "S": value.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (value.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    /**
     * @description TypedArray concat helper
     * @param {TypedArray} resultConstructor TypedArray Constructor eg.Uint8Array
     * @param  {...typedArray} arrays TypedArray instance array to concat
     * @returns 
     */
    function concatenate(resultConstructor, ...arrays) {
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

    /**
     * @description retry helpers regenerator promise object every time
     * @param promiseFn Promise function to reExecute each retry time
     * @param times times
     * @returns Promise<T>
     */
    function retryPromise(promiseFn, times = 5, retryInterval = 0) {
        return new Promise((resolve, reject) => {
            let runtimes = 0;
            function retryWrapperFn() {
                promiseFn().then((result) => {
                    resolve(result);
                }).catch((err) => {
                    // detect strike reject to whole, it ignore retry times option and reject directly
                    if (err.mode === 'strike') {
                        reject(err);
                        return
                    }
                    if (!times) {
                        setTimeout(() => retryWrapperFn(), retryInterval);
                    } else if (runtimes < times) {
                        setTimeout(() => retryWrapperFn(), retryInterval);
                    } else {
                        const retryError = new Error(`retryPromise exceed ${times} times : ${err.toString()}`);
                        reject(retryError);
                    }

                }).finally(() => {
                    runtimes++;
                });
            }

            retryWrapperFn();

        })
    }

    var spannerGeneric = /*#__PURE__*/Object.freeze({
        __proto__: null,
        readableSize: readableSize,
        random: random,
        guid: newGuid,
        dateTimeFormat: dateTimeFormat,
        concatenate: concatenate,
        retryPromise: retryPromise
    });

    /**
     * @description test if parentObj is parent of obj
     * @param {DomElement} obj target dom element
     * @param {DomElement} parentObj test parent dom element
     * @returns 
     */
    function isParent(obj, parentObj) {
        while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
            if (obj == parentObj) {
                return true;
            }
            obj = obj.parentNode;
        }
        return false;
    }

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
    function loadComponents(components) {
        return Promise.all(components.map(component => {
            return new Promise((resolve) => {
                return requestRaw(`/components/templates/${component}.html`).then(templateContent => {
                    // inject web component template
                    const templateElement = document.createElement("template");
                    templateElement.setAttribute("id", `${component}-template`);
                    templateElement.innerHTML = templateContent;
                    document.querySelector('head').appendChild(templateElement);

                    // inject web component definition class
                    const scriptElement = document.createElement('script');
                    scriptElement.setAttribute('src', `/components/${component}.js`);
                    document.querySelector("head").append(scriptElement);
                    resolve();
                }).catch((error) => {
                    console.log(`load component [${component}] error :`, error);
                    resolve();
                })
            })
        }))
    }

    /**
         * @description infinite wait before module loaded
         * @param {string[]} modules name arrays for module injected window
         * @returns {module[]} modules loaded
         */
    function loadPublicModule(modules) {
        return Promise.all(modules.map(module => {
            return new Promise(async (resolve) => {
                while (true) {
                    if (window[module]) {
                        resolve(window[module]);
                        break;
                    } else {
                        await Utils.wait(500);
                    }
                }

            })
        }))
    }

    /**
     * @description resolve query params current page
     * @returns {Object} querystring object eg {id:1}
     */
    function resolveQueryString(){
        var query = location.href.split('?')[1] || '';
        var re = /([^&=]+)=?([^&]*)/g,
        decodeRE = /\+/g,
        decode = function (str) { return decodeURIComponent( str.replace(decodeRE, " ") ); };
        var params = {}, e;
        while ( e = re.exec(query) ){
           params[ decode(e[1]) ] = decode( e[2] );
        }    return params;
     
     }

    /**
     * 
     * @param {Element} node current dom element
     * @param {String} className className for parent element to find
     * @returns {Element} dom node to find
     */
    function getParentByClassName(node, className) {
        let parentNode = node, currentNode = node;
        while (!(parentNode && parentNode.classList && parentNode.classList.contains(className))) {
            if (currentNode.parentNode) {
                currentNode = parentNode;
                parentNode = currentNode.parentNode;
            } else {
                return null
            }

        }
        return parentNode
    }

    var spannerWebRestrict = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isParent: isParent,
        loadWebComponents: loadComponents,
        loadPublicModule: loadPublicModule,
        resolveQueryString: resolveQueryString,
        getParentByClassName: getParentByClassName
    });

    window.spanner = Object.assign({},spannerGeneric,spannerWebRestrict);

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLWluZGV4LmpzIiwic291cmNlcyI6WyIuLi9saWJzL2dlbmVyaWMvcmVhZGFibGVTaXplLmpzIiwiLi4vbGlicy9nZW5lcmljL3JhbmRvbS5qcyIsIi4uL2xpYnMvZ2VuZXJpYy9ndWlkLmpzIiwiLi4vbGlicy9nZW5lcmljL2RhdGVUaW1lRm9ybWF0LmpzIiwiLi4vbGlicy9nZW5lcmljL2NvbmNhdGVuYXRlLmpzIiwiLi4vbGlicy9nZW5lcmljL3JldHJ5UHJvbWlzZS5qcyIsIi4uL2xpYnMvd2ViLXJlc3RyaWN0L2lzUGFyZW50LmpzIiwiLi4vbGlicy93ZWItcmVzdHJpY3QvbG9hZFdlYkNvbXBvbmVudHMuanMiLCIuLi9saWJzL3dlYi1yZXN0cmljdC9sb2FkUHVibGljTW9kdWxlLmpzIiwiLi4vbGlicy93ZWItcmVzdHJpY3QvcmVzb2x2ZVF1ZXJ5U3RyaW5nLmpzIiwiLi4vbGlicy93ZWItcmVzdHJpY3QvZ2V0UGFyZW50QnlDbGFzc05hbWUuanMiLCIuLi93ZWItaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZGVzY3JpcHRpb24gSGFuZGxlIGZpbGUgc2l6ZSByZWFkYWJpbGl0eVxuICogQHBhcmFtIHtJbnRlZ2VyfSB2YWx1ZSBmaWxlIHNpemUgb2YgYnl0ZSB1bml0XG4gKiBAcmV0dXJucyB7U3RyaW5nfSByZWFkYWJsZSBmaWxlIHNpemVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVhZGFibGVTaXplKHZhbHVlKXtcbiAgICBpZihudWxsPT12YWx1ZXx8dmFsdWU9PScnKXtcbiAgICAgICAgcmV0dXJuIFwiMCBCeXRlc1wiO1xuICAgIH1cbiAgICB2YXIgdW5pdEFyciA9IG5ldyBBcnJheShcIkJ5dGVzXCIsXCJLQlwiLFwiTUJcIixcIkdCXCIsXCJUQlwiLFwiUEJcIixcIkVCXCIsXCJaQlwiLFwiWUJcIik7XG4gICAgdmFyIGluZGV4PTA7XG4gICAgdmFyIHNyY3NpemUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICBpbmRleD1NYXRoLmZsb29yKE1hdGgubG9nKHNyY3NpemUpL01hdGgubG9nKDEwMjQpKTtcbiAgICB2YXIgc2l6ZSA9c3Jjc2l6ZS9NYXRoLnBvdygxMDI0LGluZGV4KTtcbiAgICBzaXplPXNpemUudG9GaXhlZCgyKTsvLyBkZWNpbWFsIGRpZ2l0IHRvIGtlZXBcbiAgICByZXR1cm4gc2l6ZSt1bml0QXJyW2luZGV4XTtcbn0iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiByYW5kb20gbnVtIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1ZGUgbWluIGFuZCBtYXgpXG4gKiBAcGFyYW0ge0ludGVnZXJ9IHJNaSBtaW5cbiAqIEBwYXJhbSB7SW50ZWdlcn0gck1hIG1heFxuICogQHJldHVybnMge0ludGVnZXJ9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJhbmRvbShyTWksIHJNYSkgeyByZXR1cm4gfn4oKE1hdGgucmFuZG9tKCkgKiAock1hIC0gck1pICsgMSkpICsgck1pKTsgfSIsIi8qKlxuICogQGRlc2NyaXB0aW9uIGEgZ3VpZCBnZW5lcmF0b3JcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGEgZ3VpZCBlZy4gJzlhOTY4MWJiLTRkZmEtNjc1MC01YWU0LTk1MzAyMDlkOGE5ZCdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbmV3R3VpZCgpIHtcbiAgICB2YXIgZ3VpZCA9IFwiXCI7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzI7IGkrKykge1xuICAgICAgICB2YXIgbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2LjApLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgZ3VpZCArPSBuO1xuICAgICAgICBpZiAoKGkgPT0gOCkgfHwgKGkgPT0gMTIpIHx8IChpID09IDE2KSB8fCAoaSA9PSAyMCkpXG4gICAgICAgICAgICBndWlkICs9IFwiLVwiO1xuICAgIH1cbiAgICByZXR1cm4gZ3VpZDtcbn0iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiBkYXRldGltZSBmb3JtYXR0ZXJcbiAqIEBwYXJhbSB7RGF0ZX0gdmFsdWUgYSBkYXRlIG9iamVjdCBzdHJ1Y3QgYnkgYG5ldyBEYXRlKCopYFxuICogQHBhcmFtIHtTdHJpbmd9IGZtdCBhIGZtdCBzdHJpbmcgbGlrZSBcIk1NLWRkIC4uLlwiXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRlVGltZUZvcm1hdCh2YWx1ZSwgZm10KSB7XG4gICAgdmFyIG8gPSB7XG4gICAgICAgIFwiTStcIjogdmFsdWUuZ2V0TW9udGgoKSArIDEsIC8v5pyI5Lu9XG4gICAgICAgIFwiZCtcIjogdmFsdWUuZ2V0RGF0ZSgpLCAvL+aXpVxuICAgICAgICBcImgrXCI6IHZhbHVlLmdldEhvdXJzKCksIC8v5bCP5pe2XG4gICAgICAgIFwibStcIjogdmFsdWUuZ2V0TWludXRlcygpLCAvL+WIhlxuICAgICAgICBcInMrXCI6IHZhbHVlLmdldFNlY29uZHMoKSwgLy/np5JcbiAgICAgICAgXCJxK1wiOiBNYXRoLmZsb29yKCh2YWx1ZS5nZXRNb250aCgpICsgMykgLyAzKSwgLy/lraPluqZcbiAgICAgICAgXCJTXCI6IHZhbHVlLmdldE1pbGxpc2Vjb25kcygpIC8v5q+r56eSXG4gICAgfTtcbiAgICBpZiAoLyh5KykvLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAodmFsdWUuZ2V0RnVsbFllYXIoKSArIFwiXCIpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpO1xuICAgIGZvciAodmFyIGsgaW4gbylcbiAgICAgICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAoUmVnRXhwLiQxLmxlbmd0aCA9PSAxKSA/IChvW2tdKSA6ICgoXCIwMFwiICsgb1trXSkuc3Vic3RyKChcIlwiICsgb1trXSkubGVuZ3RoKSkpO1xuICAgIHJldHVybiBmbXQ7XG59IiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gVHlwZWRBcnJheSBjb25jYXQgaGVscGVyXG4gKiBAcGFyYW0ge1R5cGVkQXJyYXl9IHJlc3VsdENvbnN0cnVjdG9yIFR5cGVkQXJyYXkgQ29uc3RydWN0b3IgZWcuVWludDhBcnJheVxuICogQHBhcmFtICB7Li4udHlwZWRBcnJheX0gYXJyYXlzIFR5cGVkQXJyYXkgaW5zdGFuY2UgYXJyYXkgdG8gY29uY2F0XG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gY29uY2F0ZW5hdGUocmVzdWx0Q29uc3RydWN0b3IsIC4uLmFycmF5cykge1xuICAgIGxldCB0b3RhbExlbmd0aCA9IDA7XG4gICAgZm9yIChsZXQgYXJyIG9mIGFycmF5cykge1xuICAgICAgICB0b3RhbExlbmd0aCArPSBhcnIubGVuZ3RoO1xuICAgIH1cbiAgICBsZXQgcmVzdWx0ID0gbmV3IHJlc3VsdENvbnN0cnVjdG9yKHRvdGFsTGVuZ3RoKTtcbiAgICBsZXQgb2Zmc2V0ID0gMDtcbiAgICBmb3IgKGxldCBhcnIgb2YgYXJyYXlzKSB7XG4gICAgICAgIHJlc3VsdC5zZXQoYXJyLCBvZmZzZXQpO1xuICAgICAgICBvZmZzZXQgKz0gYXJyLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIHJlc3VsdDtcbn0iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiByZXRyeSBoZWxwZXJzIHJlZ2VuZXJhdG9yIHByb21pc2Ugb2JqZWN0IGV2ZXJ5IHRpbWVcbiAqIEBwYXJhbSBwcm9taXNlRm4gUHJvbWlzZSBmdW5jdGlvbiB0byByZUV4ZWN1dGUgZWFjaCByZXRyeSB0aW1lXG4gKiBAcGFyYW0gdGltZXMgdGltZXNcbiAqIEByZXR1cm5zIFByb21pc2U8VD5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmV0cnlQcm9taXNlKHByb21pc2VGbiwgdGltZXMgPSA1LCByZXRyeUludGVydmFsID0gMCkge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIGxldCBydW50aW1lcyA9IDBcbiAgICAgICAgZnVuY3Rpb24gcmV0cnlXcmFwcGVyRm4oKSB7XG4gICAgICAgICAgICBwcm9taXNlRm4oKS50aGVuKChyZXN1bHQpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3VsdClcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAvLyBkZXRlY3Qgc3RyaWtlIHJlamVjdCB0byB3aG9sZSwgaXQgaWdub3JlIHJldHJ5IHRpbWVzIG9wdGlvbiBhbmQgcmVqZWN0IGRpcmVjdGx5XG4gICAgICAgICAgICAgICAgaWYgKGVyci5tb2RlID09PSAnc3RyaWtlJykge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKVxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lcykge1xuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHJldHJ5V3JhcHBlckZuKCksIHJldHJ5SW50ZXJ2YWwpXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChydW50aW1lcyA8IHRpbWVzKSB7XG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoKCkgPT4gcmV0cnlXcmFwcGVyRm4oKSwgcmV0cnlJbnRlcnZhbClcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCByZXRyeUVycm9yID0gbmV3IEVycm9yKGByZXRyeVByb21pc2UgZXhjZWVkICR7dGltZXN9IHRpbWVzIDogJHtlcnIudG9TdHJpbmcoKX1gKVxuICAgICAgICAgICAgICAgICAgICByZWplY3QocmV0cnlFcnJvcilcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pLmZpbmFsbHkoKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJ1bnRpbWVzKytcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cblxuICAgICAgICByZXRyeVdyYXBwZXJGbigpXG5cbiAgICB9KVxufSIsIi8qKlxuICogQGRlc2NyaXB0aW9uIHRlc3QgaWYgcGFyZW50T2JqIGlzIHBhcmVudCBvZiBvYmpcbiAqIEBwYXJhbSB7RG9tRWxlbWVudH0gb2JqIHRhcmdldCBkb20gZWxlbWVudFxuICogQHBhcmFtIHtEb21FbGVtZW50fSBwYXJlbnRPYmogdGVzdCBwYXJlbnQgZG9tIGVsZW1lbnRcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBpc1BhcmVudChvYmosIHBhcmVudE9iaikge1xuICAgIHdoaWxlIChvYmogIT0gdW5kZWZpbmVkICYmIG9iaiAhPSBudWxsICYmIG9iai50YWdOYW1lLnRvVXBwZXJDYXNlKCkgIT0gJ0JPRFknKSB7XG4gICAgICAgIGlmIChvYmogPT0gcGFyZW50T2JqKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBvYmogPSBvYmoucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xufSIsIi8qKlxuICogQGRlc2NyaXB0aW9uIGEgc2ltcGxlIHdyYXBwZXIgZm9yIGZldGNoIHJhdyBjb250ZW50IGZvciBhIGFzc2V0XG4gKiBAcGFyYW0ge1N0cmluZ3xSZXF1ZXN0fSBpbnB1dCB0YXJnZXQgdG8gcmVxdWVzdFxuICogQHBhcmFtIHtyZXF1ZXN0SW5pdH0gaW5pdCByZXF1ZXN0IHBhcmFtc1xuICogQHJldHVybnMgXG4gKi9cbmZ1bmN0aW9uIHJlcXVlc3RSYXcoaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gZmV0Y2goaW5wdXQsIGluaXQpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XG4gICAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnRleHQoKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KClcbiAgICAgICAgfVxuICAgIH0pXG59XG5cbi8qKlxuICAgICogQGRlc2NyaXB0aW9uIHV0aWwgZnVuY3Rpb24gdG8gbG9hZCB3ZWIgY29tcG9uZW50cyxyZWNvbW1hbmQgdG8gaW52b2tlIHRoaXMgZnVuY3Rpb24gYmVmb3JlIGJvZHkgcGFyc2VcbiAgICAqIEBwYXJhbSBzdHJpbmdbXSB3ZWIgY29tcG9uZXRzIG5hbWUgYXJyYXkgdG8gbG9hZFxuICAgICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkQ29tcG9uZW50cyhjb21wb25lbnRzKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKGNvbXBvbmVudHMubWFwKGNvbXBvbmVudCA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3RSYXcoYC9jb21wb25lbnRzL3RlbXBsYXRlcy8ke2NvbXBvbmVudH0uaHRtbGApLnRoZW4odGVtcGxhdGVDb250ZW50ID0+IHtcbiAgICAgICAgICAgICAgICAvLyBpbmplY3Qgd2ViIGNvbXBvbmVudCB0ZW1wbGF0ZVxuICAgICAgICAgICAgICAgIGNvbnN0IHRlbXBsYXRlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ0ZW1wbGF0ZVwiKVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJpZFwiLCBgJHtjb21wb25lbnR9LXRlbXBsYXRlYClcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZUVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVDb250ZW50XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaGVhZCcpLmFwcGVuZENoaWxkKHRlbXBsYXRlRWxlbWVudClcblxuICAgICAgICAgICAgICAgIC8vIGluamVjdCB3ZWIgY29tcG9uZW50IGRlZmluaXRpb24gY2xhc3NcbiAgICAgICAgICAgICAgICBjb25zdCBzY3JpcHRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0JylcbiAgICAgICAgICAgICAgICBzY3JpcHRFbGVtZW50LnNldEF0dHJpYnV0ZSgnc3JjJywgYC9jb21wb25lbnRzLyR7Y29tcG9uZW50fS5qc2ApXG4gICAgICAgICAgICAgICAgZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcImhlYWRcIikuYXBwZW5kKHNjcmlwdEVsZW1lbnQpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICB9KS5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgbG9hZCBjb21wb25lbnQgWyR7Y29tcG9uZW50fV0gZXJyb3IgOmAsIGVycm9yKVxuICAgICAgICAgICAgICAgIHJlc29sdmUoKVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfSlcbiAgICB9KSlcbn1cblxuIiwiLyoqXG4gICAgICogQGRlc2NyaXB0aW9uIGluZmluaXRlIHdhaXQgYmVmb3JlIG1vZHVsZSBsb2FkZWRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfSBtb2R1bGVzIG5hbWUgYXJyYXlzIGZvciBtb2R1bGUgaW5qZWN0ZWQgd2luZG93XG4gICAgICogQHJldHVybnMge21vZHVsZVtdfSBtb2R1bGVzIGxvYWRlZFxuICAgICAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbG9hZFB1YmxpY01vZHVsZShtb2R1bGVzKSB7XG4gICAgcmV0dXJuIFByb21pc2UuYWxsKG1vZHVsZXMubWFwKG1vZHVsZSA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShhc3luYyAocmVzb2x2ZSkgPT4ge1xuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgICAgICBpZiAod2luZG93W21vZHVsZV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh3aW5kb3dbbW9kdWxlXSlcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYXdhaXQgVXRpbHMud2FpdCg1MDApXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0pXG4gICAgfSkpXG59IiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gcmVzb2x2ZSBxdWVyeSBwYXJhbXMgY3VycmVudCBwYWdlXG4gKiBAcmV0dXJucyB7T2JqZWN0fSBxdWVyeXN0cmluZyBvYmplY3QgZWcge2lkOjF9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlc29sdmVRdWVyeVN0cmluZygpe1xuICAgIHZhciBxdWVyeSA9IGxvY2F0aW9uLmhyZWYuc3BsaXQoJz8nKVsxXSB8fCAnJ1xuICAgIHZhciByZSA9IC8oW14mPV0rKT0/KFteJl0qKS9nLFxuICAgIGRlY29kZVJFID0gL1xcKy9nLFxuICAgIGRlY29kZSA9IGZ1bmN0aW9uIChzdHIpIHsgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudCggc3RyLnJlcGxhY2UoZGVjb2RlUkUsIFwiIFwiKSApOyB9O1xuICAgIHZhciBwYXJhbXMgPSB7fSwgZTtcbiAgICB3aGlsZSAoIGUgPSByZS5leGVjKHF1ZXJ5KSApe1xuICAgICAgIHBhcmFtc1sgZGVjb2RlKGVbMV0pIF0gPSBkZWNvZGUoIGVbMl0gKVxuICAgIH07XG4gICAgcmV0dXJuIHBhcmFtcztcbiBcbiB9IiwiLyoqXG4gKiBcbiAqIEBwYXJhbSB7RWxlbWVudH0gbm9kZSBjdXJyZW50IGRvbSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lIGNsYXNzTmFtZSBmb3IgcGFyZW50IGVsZW1lbnQgdG8gZmluZFxuICogQHJldHVybnMge0VsZW1lbnR9IGRvbSBub2RlIHRvIGZpbmRcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZ2V0UGFyZW50QnlDbGFzc05hbWUobm9kZSwgY2xhc3NOYW1lKSB7XG4gICAgbGV0IHBhcmVudE5vZGUgPSBub2RlLCBjdXJyZW50Tm9kZSA9IG5vZGVcbiAgICB3aGlsZSAoIShwYXJlbnROb2RlICYmIHBhcmVudE5vZGUuY2xhc3NMaXN0ICYmIHBhcmVudE5vZGUuY2xhc3NMaXN0LmNvbnRhaW5zKGNsYXNzTmFtZSkpKSB7XG4gICAgICAgIGlmIChjdXJyZW50Tm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICBjdXJyZW50Tm9kZSA9IHBhcmVudE5vZGVcbiAgICAgICAgICAgIHBhcmVudE5vZGUgPSBjdXJyZW50Tm9kZS5wYXJlbnROb2RlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbFxuICAgICAgICB9XG5cbiAgICB9XG4gICAgcmV0dXJuIHBhcmVudE5vZGVcbn0iLCJpbXBvcnQgKiBhcyBzcGFubmVyR2VuZXJpYyBmcm9tICcuL2xpYnMvZ2VuZXJpYy9pbmRleCdcbmltcG9ydCAqIGFzIHNwYW5uZXJXZWJSZXN0cmljdCBmcm9tICcuL2xpYnMvd2ViLXJlc3RyaWN0L2luZGV4J1xuXG53aW5kb3cuc3Bhbm5lciA9IE9iamVjdC5hc3NpZ24oe30sc3Bhbm5lckdlbmVyaWMsc3Bhbm5lcldlYlJlc3RyaWN0KVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDZSxTQUFTLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDM0MsSUFBSSxHQUFHLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztJQUM5QixRQUFRLE9BQU8sU0FBUyxDQUFDO0lBQ3pCLEtBQUs7SUFDTCxJQUFJLElBQUksT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0UsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDaEIsSUFBSSxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN2RCxJQUFJLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9COztJQ2hCQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDZSxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs7SUNOOUY7SUFDQTtJQUNBO0lBQ0E7SUFDZSxTQUFTLE9BQU8sR0FBRztJQUNsQyxJQUFJLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNsQixJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFFLEVBQUU7SUFDbEMsUUFBUSxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUQsUUFBUSxJQUFJLElBQUksQ0FBQyxDQUFDO0lBQ2xCLFFBQVEsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNELFlBQVksSUFBSSxJQUFJLEdB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
