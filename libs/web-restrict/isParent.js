/**
 * @description test if parentObj is parent of obj
 * @param {DomElement} obj target dom element
 * @param {DomElement} parentObj test parent dom element
 * @returns 
 */
export default function isParent(obj, parentObj) {
    while (obj != undefined && obj != null && obj.tagName.toUpperCase() != 'BODY') {
        if (obj == parentObj) {
            return true;
        }
        obj = obj.parentNode;
    }
    return false;
}