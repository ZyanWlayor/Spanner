/**
 * @description Handle file size readability
 * @param {Integer} value file size of byte unit
 * @returns {String} readable file size
 */
export default function readableSize(value){
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