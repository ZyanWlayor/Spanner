/**
 * @description resolve query params current page
 * @returns {Object} querystring object eg {id:1}
 */
export default function resolveQueryString(){
    var query = location.href.split('?')[1] || ''
    var re = /([^&=]+)=?([^&]*)/g,
    decodeRE = /\+/g,
    decode = function (str) { return decodeURIComponent( str.replace(decodeRE, " ") ); };
    var params = {}, e;
    while ( e = re.exec(query) ){
       params[ decode(e[1]) ] = decode( e[2] )
    };
    return params;
 
 }