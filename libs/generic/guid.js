/**
 * @description a guid generator
 * @returns {String} a guid eg. '9a9681bb-4dfa-6750-5ae4-9530209d8a9d'
 */
export default function newGuid() {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}