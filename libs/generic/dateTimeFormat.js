/**
 * @description datetime formatter
 * @param {Date} value a date object struct by `new Date(*)`
 * @param {String} fmt a fmt string like "MM-dd ..."
 * @returns {String}
 */
export default function dateTimeFormat(value, fmt) {
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