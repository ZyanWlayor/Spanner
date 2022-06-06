/**
 * 
 * @param {Element} node current dom element
 * @param {String} className className for parent element to find
 * @returns {Element} dom node to find
 */
export default function getParentByClassName(node, className) {
    let parentNode = node, currentNode = node
    while (!(parentNode && parentNode.classList && parentNode.classList.contains(className))) {
        if (currentNode.parentNode) {
            currentNode = parentNode
            parentNode = currentNode.parentNode
        } else {
            return null
        }

    }
    return parentNode
}