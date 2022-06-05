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

    var spannerGeneric = /*#__PURE__*/Object.freeze({
        __proto__: null,
        readableSize: readableSize,
        random: random,
        guid: newGuid,
        dateTimeFormat: dateTimeFormat
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

    var spannerWebRestrict = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isParent: isParent,
        loadWebComponents: loadComponents,
        loadPublicModule: loadPublicModule,
        resolveQueryString: resolveQueryString
    });

    window.spanner = Object.assign({},spannerGeneric,spannerWebRestrict);

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLWluZGV4LmpzIiwic291cmNlcyI6WyIuLi9saWJzL2dlbmVyaWMvcmVhZGFibGVTaXplLmpzIiwiLi4vbGlicy9nZW5lcmljL3JhbmRvbS5qcyIsIi4uL2xpYnMvZ2VuZXJpYy9ndWlkLmpzIiwiLi4vbGlicy9nZW5lcmljL2RhdGVUaW1lRm9ybWF0LmpzIiwiLi4vbGlicy93ZWItcmVzdHJpY3QvaXNQYXJlbnQuanMiLCIuLi9saWJzL3dlYi1yZXN0cmljdC9sb2FkV2ViQ29tcG9uZW50cy5qcyIsIi4uL2xpYnMvd2ViLXJlc3RyaWN0L2xvYWRQdWJsaWNNb2R1bGUuanMiLCIuLi9saWJzL3dlYi1yZXN0cmljdC9yZXNvbHZlUXVlcnlTdHJpbmcuanMiLCIuLi93ZWItaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZGVzY3JpcHRpb24gSGFuZGxlIGZpbGUgc2l6ZSByZWFkYWJpbGl0eVxuICogQHBhcmFtIHtJbnRlZ2VyfSB2YWx1ZSBmaWxlIHNpemUgb2YgYnl0ZSB1bml0XG4gKiBAcmV0dXJucyB7U3RyaW5nfSByZWFkYWJsZSBmaWxlIHNpemVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVhZGFibGVTaXplKHZhbHVlKXtcbiAgICBpZihudWxsPT12YWx1ZXx8dmFsdWU9PScnKXtcbiAgICAgICAgcmV0dXJuIFwiMCBCeXRlc1wiO1xuICAgIH1cbiAgICB2YXIgdW5pdEFyciA9IG5ldyBBcnJheShcIkJ5dGVzXCIsXCJLQlwiLFwiTUJcIixcIkdCXCIsXCJUQlwiLFwiUEJcIixcIkVCXCIsXCJaQlwiLFwiWUJcIik7XG4gICAgdmFyIGluZGV4PTA7XG4gICAgdmFyIHNyY3NpemUgPSBwYXJzZUZsb2F0KHZhbHVlKTtcbiAgICBpbmRleD1NYXRoLmZsb29yKE1hdGgubG9nKHNyY3NpemUpL01hdGgubG9nKDEwMjQpKTtcbiAgICB2YXIgc2l6ZSA9c3Jjc2l6ZS9NYXRoLnBvdygxMDI0LGluZGV4KTtcbiAgICBzaXplPXNpemUudG9GaXhlZCgyKTsvLyBkZWNpbWFsIGRpZ2l0IHRvIGtlZXBcbiAgICByZXR1cm4gc2l6ZSt1bml0QXJyW2luZGV4XTtcbn0iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiByYW5kb20gbnVtIGJldHdlZW4gbWluIGFuZCBtYXggKGluY2x1ZGUgbWluIGFuZCBtYXgpXG4gKiBAcGFyYW0ge0ludGVnZXJ9IHJNaSBtaW5cbiAqIEBwYXJhbSB7SW50ZWdlcn0gck1hIG1heFxuICogQHJldHVybnMge0ludGVnZXJ9XG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJhbmRvbShyTWksIHJNYSkgeyByZXR1cm4gfn4oKE1hdGgucmFuZG9tKCkgKiAock1hIC0gck1pICsgMSkpICsgck1pKTsgfSIsIi8qKlxuICogQGRlc2NyaXB0aW9uIGEgZ3VpZCBnZW5lcmF0b3JcbiAqIEByZXR1cm5zIHtTdHJpbmd9IGEgZ3VpZCBlZy4gJzlhOTY4MWJiLTRkZmEtNjc1MC01YWU0LTk1MzAyMDlkOGE5ZCdcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gbmV3R3VpZCgpIHtcbiAgICB2YXIgZ3VpZCA9IFwiXCI7XG4gICAgZm9yICh2YXIgaSA9IDE7IGkgPD0gMzI7IGkrKykge1xuICAgICAgICB2YXIgbiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDE2LjApLnRvU3RyaW5nKDE2KTtcbiAgICAgICAgZ3VpZCArPSBuO1xuICAgICAgICBpZiAoKGkgPT0gOCkgfHwgKGkgPT0gMTIpIHx8IChpID09IDE2KSB8fCAoaSA9PSAyMCkpXG4gICAgICAgICAgICBndWlkICs9IFwiLVwiO1xuICAgIH1cbiAgICByZXR1cm4gZ3VpZDtcbn0iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiBkYXRldGltZSBmb3JtYXR0ZXJcbiAqIEBwYXJhbSB7RGF0ZX0gdmFsdWUgYSBkYXRlIG9iamVjdCBzdHJ1Y3QgYnkgYG5ldyBEYXRlKCopYFxuICogQHBhcmFtIHtTdHJpbmd9IGZtdCBhIGZtdCBzdHJpbmcgbGlrZSBcIk1NLWRkIC4uLlwiXG4gKiBAcmV0dXJucyB7U3RyaW5nfVxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkYXRlVGltZUZvcm1hdCh2YWx1ZSwgZm10KSB7XG4gICAgdmFyIG8gPSB7XG4gICAgICAgIFwiTStcIjogdmFsdWUuZ2V0TW9udGgoKSArIDEsIC8v5pyI5Lu9XG4gICAgICAgIFwiZCtcIjogdmFsdWUuZ2V0RGF0ZSgpLCAvL+aXpVxuICAgICAgICBcImgrXCI6IHZhbHVlLmdldEhvdXJzKCksIC8v5bCP5pe2XG4gICAgICAgIFwibStcIjogdmFsdWUuZ2V0TWludXRlcygpLCAvL+WIhlxuICAgICAgICBcInMrXCI6IHZhbHVlLmdldFNlY29uZHMoKSwgLy/np5JcbiAgICAgICAgXCJxK1wiOiBNYXRoLmZsb29yKCh2YWx1ZS5nZXRNb250aCgpICsgMykgLyAzKSwgLy/lraPluqZcbiAgICAgICAgXCJTXCI6IHZhbHVlLmdldE1pbGxpc2Vjb25kcygpIC8v5q+r56eSXG4gICAgfTtcbiAgICBpZiAoLyh5KykvLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAodmFsdWUuZ2V0RnVsbFllYXIoKSArIFwiXCIpLnN1YnN0cig0IC0gUmVnRXhwLiQxLmxlbmd0aCkpO1xuICAgIGZvciAodmFyIGsgaW4gbylcbiAgICAgICAgaWYgKG5ldyBSZWdFeHAoXCIoXCIgKyBrICsgXCIpXCIpLnRlc3QoZm10KSkgZm10ID0gZm10LnJlcGxhY2UoUmVnRXhwLiQxLCAoUmVnRXhwLiQxLmxlbmd0aCA9PSAxKSA/IChvW2tdKSA6ICgoXCIwMFwiICsgb1trXSkuc3Vic3RyKChcIlwiICsgb1trXSkubGVuZ3RoKSkpO1xuICAgIHJldHVybiBmbXQ7XG59IiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gdGVzdCBpZiBwYXJlbnRPYmogaXMgcGFyZW50IG9mIG9ialxuICogQHBhcmFtIHtEb21FbGVtZW50fSBvYmogdGFyZ2V0IGRvbSBlbGVtZW50XG4gKiBAcGFyYW0ge0RvbUVsZW1lbnR9IHBhcmVudE9iaiB0ZXN0IHBhcmVudCBkb20gZWxlbWVudFxuICogQHJldHVybnMgXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGlzUGFyZW50KG9iaiwgcGFyZW50T2JqKSB7XG4gICAgd2hpbGUgKG9iaiAhPSB1bmRlZmluZWQgJiYgb2JqICE9IG51bGwgJiYgb2JqLnRhZ05hbWUudG9VcHBlckNhc2UoKSAhPSAnQk9EWScpIHtcbiAgICAgICAgaWYgKG9iaiA9PSBwYXJlbnRPYmopIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIG9iaiA9IG9iai5wYXJlbnROb2RlO1xuICAgIH1cbiAgICByZXR1cm4gZmFsc2U7XG59IiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gYSBzaW1wbGUgd3JhcHBlciBmb3IgZmV0Y2ggcmF3IGNvbnRlbnQgZm9yIGEgYXNzZXRcbiAqIEBwYXJhbSB7U3RyaW5nfFJlcXVlc3R9IGlucHV0IHRhcmdldCB0byByZXF1ZXN0XG4gKiBAcGFyYW0ge3JlcXVlc3RJbml0fSBpbml0IHJlcXVlc3QgcGFyYW1zXG4gKiBAcmV0dXJucyBcbiAqL1xuZnVuY3Rpb24gcmVxdWVzdFJhdyhpbnB1dCwgaW5pdCkge1xuICAgIHJldHVybiBmZXRjaChpbnB1dCwgaW5pdCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UudGV4dCgpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoKVxuICAgICAgICB9XG4gICAgfSlcbn1cblxuLyoqXG4gICAgKiBAZGVzY3JpcHRpb24gdXRpbCBmdW5jdGlvbiB0byBsb2FkIHdlYiBjb21wb25lbnRzLHJlY29tbWFuZCB0byBpbnZva2UgdGhpcyBmdW5jdGlvbiBiZWZvcmUgYm9keSBwYXJzZVxuICAgICogQHBhcmFtIHN0cmluZ1tdIHdlYiBjb21wb25ldHMgbmFtZSBhcnJheSB0byBsb2FkXG4gICAgKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGxvYWRDb21wb25lbnRzKGNvbXBvbmVudHMpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoY29tcG9uZW50cy5tYXAoY29tcG9uZW50ID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcmVxdWVzdFJhdyhgL2NvbXBvbmVudHMvdGVtcGxhdGVzLyR7Y29tcG9uZW50fS5odG1sYCkudGhlbih0ZW1wbGF0ZUNvbnRlbnQgPT4ge1xuICAgICAgICAgICAgICAgIC8vIGluamVjdCB3ZWIgY29tcG9uZW50IHRlbXBsYXRlXG4gICAgICAgICAgICAgICAgY29uc3QgdGVtcGxhdGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInRlbXBsYXRlXCIpXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVFbGVtZW50LnNldEF0dHJpYnV0ZShcImlkXCIsIGAke2NvbXBvbmVudH0tdGVtcGxhdGVgKVxuICAgICAgICAgICAgICAgIHRlbXBsYXRlRWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZUNvbnRlbnRcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdoZWFkJykuYXBwZW5kQ2hpbGQodGVtcGxhdGVFbGVtZW50KVxuXG4gICAgICAgICAgICAgICAgLy8gaW5qZWN0IHdlYiBjb21wb25lbnQgZGVmaW5pdGlvbiBjbGFzc1xuICAgICAgICAgICAgICAgIGNvbnN0IHNjcmlwdEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKVxuICAgICAgICAgICAgICAgIHNjcmlwdEVsZW1lbnQuc2V0QXR0cmlidXRlKCdzcmMnLCBgL2NvbXBvbmVudHMvJHtjb21wb25lbnR9LmpzYClcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiaGVhZFwiKS5hcHBlbmQoc2NyaXB0RWxlbWVudClcbiAgICAgICAgICAgICAgICByZXNvbHZlKClcbiAgICAgICAgICAgIH0pLmNhdGNoKChlcnJvcikgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBsb2FkIGNvbXBvbmVudCBbJHtjb21wb25lbnR9XSBlcnJvciA6YCwgZXJyb3IpXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgIH0pKVxufVxuXG4iLCIvKipcbiAgICAgKiBAZGVzY3JpcHRpb24gaW5maW5pdGUgd2FpdCBiZWZvcmUgbW9kdWxlIGxvYWRlZFxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IG1vZHVsZXMgbmFtZSBhcnJheXMgZm9yIG1vZHVsZSBpbmplY3RlZCB3aW5kb3dcbiAgICAgKiBAcmV0dXJucyB7bW9kdWxlW119IG1vZHVsZXMgbG9hZGVkXG4gICAgICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBsb2FkUHVibGljTW9kdWxlKG1vZHVsZXMpIHtcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwobW9kdWxlcy5tYXAobW9kdWxlID0+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGFzeW5jIChyZXNvbHZlKSA9PiB7XG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgICAgIGlmICh3aW5kb3dbbW9kdWxlXSkge1xuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHdpbmRvd1ttb2R1bGVdKVxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBhd2FpdCBVdGlscy53YWl0KDUwMClcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSlcbiAgICB9KSlcbn0iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiByZXNvbHZlIHF1ZXJ5IHBhcmFtcyBjdXJyZW50IHBhZ2VcbiAqIEByZXR1cm5zIHtPYmplY3R9IHF1ZXJ5c3RyaW5nIG9iamVjdCBlZyB7aWQ6MX1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gcmVzb2x2ZVF1ZXJ5U3RyaW5nKCl7XG4gICAgdmFyIHF1ZXJ5ID0gbG9jYXRpb24uaHJlZi5zcGxpdCgnPycpWzFdIHx8ICcnXG4gICAgdmFyIHJlID0gLyhbXiY9XSspPT8oW14mXSopL2csXG4gICAgZGVjb2RlUkUgPSAvXFwrL2csXG4gICAgZGVjb2RlID0gZnVuY3Rpb24gKHN0cikgeyByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KCBzdHIucmVwbGFjZShkZWNvZGVSRSwgXCIgXCIpICk7IH07XG4gICAgdmFyIHBhcmFtcyA9IHt9LCBlO1xuICAgIHdoaWxlICggZSA9IHJlLmV4ZWMocXVlcnkpICl7XG4gICAgICAgcGFyYW1zWyBkZWNvZGUoZVsxXSkgXSA9IGRlY29kZSggZVsyXSApXG4gICAgfTtcbiAgICByZXR1cm4gcGFyYW1zO1xuIFxuIH0iLCJpbXBvcnQgKiBhcyBzcGFubmVyR2VuZXJpYyBmcm9tICcuL2xpYnMvZ2VuZXJpYy9pbmRleCdcbmltcG9ydCAqIGFzIHNwYW5uZXJXZWJSZXN0cmljdCBmcm9tICcuL2xpYnMvd2ViLXJlc3RyaWN0L2luZGV4J1xuXG53aW5kb3cuc3Bhbm5lciA9IE9iamVjdC5hc3NpZ24oe30sc3Bhbm5lckdlbmVyaWMsc3Bhbm5lcldlYlJlc3RyaWN0KVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDZSxTQUFTLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDM0MsSUFBSSxHQUFHLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztJQUM5QixRQUFRLE9BQU8sU0FBUyxDQUFDO0lBQ3pCLEtBQUs7SUFDTCxJQUFJLElBQUksT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFB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
