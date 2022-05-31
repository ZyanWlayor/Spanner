(function () {
    'use strict';

    /**
     * @description Handle file size readability
     * @param {Integer} value file size of byte unit
     * @returns string
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
     * @returns 
     */
    function random(rMi, rMa) { return ~~((Math.random() * (rMa - rMi + 1)) + rMi); }

    var spannerGeneric = /*#__PURE__*/Object.freeze({
        __proto__: null,
        readableSize: readableSize,
        random: random
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

    var spannerWebRestrict = /*#__PURE__*/Object.freeze({
        __proto__: null,
        isParent: isParent
    });

    window.spanner = Object.assign(spannerGeneric,spannerWebRestrict);

})();
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2ViLWluZGV4LmpzIiwic291cmNlcyI6WyIuLi9saWJzL2dlbmVyaWMvcmVhZGFibGVTaXplLmpzIiwiLi4vbGlicy9nZW5lcmljL3JhbmRvbS5qcyIsIi4uL2xpYnMvd2ViLXJlc3RyaWN0L2lzUGFyZW50LmpzIiwiLi4vd2ViLWluZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGRlc2NyaXB0aW9uIEhhbmRsZSBmaWxlIHNpemUgcmVhZGFiaWxpdHlcbiAqIEBwYXJhbSB7SW50ZWdlcn0gdmFsdWUgZmlsZSBzaXplIG9mIGJ5dGUgdW5pdFxuICogQHJldHVybnMgc3RyaW5nXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHJlYWRhYmxlU2l6ZSh2YWx1ZSl7XG4gICAgaWYobnVsbD09dmFsdWV8fHZhbHVlPT0nJyl7XG4gICAgICAgIHJldHVybiBcIjAgQnl0ZXNcIjtcbiAgICB9XG4gICAgdmFyIHVuaXRBcnIgPSBuZXcgQXJyYXkoXCJCeXRlc1wiLFwiS0JcIixcIk1CXCIsXCJHQlwiLFwiVEJcIixcIlBCXCIsXCJFQlwiLFwiWkJcIixcIllCXCIpO1xuICAgIHZhciBpbmRleD0wO1xuICAgIHZhciBzcmNzaXplID0gcGFyc2VGbG9hdCh2YWx1ZSk7XG4gICAgaW5kZXg9TWF0aC5mbG9vcihNYXRoLmxvZyhzcmNzaXplKS9NYXRoLmxvZygxMDI0KSk7XG4gICAgdmFyIHNpemUgPXNyY3NpemUvTWF0aC5wb3coMTAyNCxpbmRleCk7XG4gICAgc2l6ZT1zaXplLnRvRml4ZWQoMik7Ly8gZGVjaW1hbCBkaWdpdCB0byBrZWVwXG4gICAgcmV0dXJuIHNpemUrdW5pdEFycltpbmRleF07XG59IiwiLyoqXG4gKiBAZGVzY3JpcHRpb24gcmFuZG9tIG51bSBiZXR3ZWVuIG1pbiBhbmQgbWF4IChpbmNsdWRlIG1pbiBhbmQgbWF4KVxuICogQHBhcmFtIHtJbnRlZ2VyfSByTWkgbWluXG4gKiBAcGFyYW0ge0ludGVnZXJ9IHJNYSBtYXhcbiAqIEByZXR1cm5zIFxuICovXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiByYW5kb20ock1pLCByTWEpIHsgcmV0dXJuIH5+KChNYXRoLnJhbmRvbSgpICogKHJNYSAtIHJNaSArIDEpKSArIHJNaSk7IH0iLCIvKipcbiAqIEBkZXNjcmlwdGlvbiB0ZXN0IGlmIHBhcmVudE9iaiBpcyBwYXJlbnQgb2Ygb2JqXG4gKiBAcGFyYW0ge0RvbUVsZW1lbnR9IG9iaiB0YXJnZXQgZG9tIGVsZW1lbnRcbiAqIEBwYXJhbSB7RG9tRWxlbWVudH0gcGFyZW50T2JqIHRlc3QgcGFyZW50IGRvbSBlbGVtZW50XG4gKiBAcmV0dXJucyBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gaXNQYXJlbnQob2JqLCBwYXJlbnRPYmopIHtcbiAgICB3aGlsZSAob2JqICE9IHVuZGVmaW5lZCAmJiBvYmogIT0gbnVsbCAmJiBvYmoudGFnTmFtZS50b1VwcGVyQ2FzZSgpICE9ICdCT0RZJykge1xuICAgICAgICBpZiAob2JqID09IHBhcmVudE9iaikge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgb2JqID0gb2JqLnBhcmVudE5vZGU7XG4gICAgfVxuICAgIHJldHVybiBmYWxzZTtcbn0iLCJpbXBvcnQgKiBhcyBzcGFubmVyR2VuZXJpYyBmcm9tICcuL2xpYnMvZ2VuZXJpYy9pbmRleCdcbmltcG9ydCAqIGFzIHNwYW5uZXJXZWJSZXN0cmljdCBmcm9tICcuL2xpYnMvd2ViLXJlc3RyaWN0L2luZGV4J1xuXG53aW5kb3cuc3Bhbm5lciA9IE9iamVjdC5hc3NpZ24oc3Bhbm5lckdlbmVyaWMsc3Bhbm5lcldlYlJlc3RyaWN0KVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDZSxTQUFTLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDM0MsSUFBSSxHQUFHLElBQUksRUFBRSxLQUFLLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQztJQUM5QixRQUFRLE9BQU8sU0FBUyxDQUFDO0lBQ3pCLEtBQUs7SUFDTCxJQUFJLElBQUksT0FBTyxHQUFHLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDN0UsSUFBSSxJQUFJLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDaEIsSUFBSSxJQUFJLE9BQU8sR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEMsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztJQUN2RCxJQUFJLElBQUksSUFBSSxFQUFFLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMzQyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3pCLElBQUksT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9COztJQ2hCQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDZSxTQUFTLE1BQU0sQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQzs7Ozs7Ozs7SUNOOUY7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ2UsU0FBUyxRQUFRLENBQUMsR0FBRyxFQUFFLFNBQVMsRUFBRTtJQUNqRCxJQUFJLE9BQU8sR0FBRyxJQUFJLFNBQVMsSUFBSSxHQUFHLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFLElBQUksTUFBTSxFQUFFO0lBQ25GLFFBQVEsSUFBSSxHQUFHLElBQUksU0FBUyxFQUFFO0lBQzlCLFlBQVksT0FBTyxJQUFJLENBQUM7SUFDeEIsU0FBUztJQUNULFFBQVEsR0FBRyxHQUFHLEdBQUcsQ0FBQyxVQUFVLENBQUM7SUFDN0IsS0FBSztJQUNMLElBQUksT0FBTyxLQUFLLENBQUM7SUFDakI7Ozs7Ozs7SUNYQSxNQUFNLENBQUMsT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLGtCQUFrQjs7Ozs7OyJ9
