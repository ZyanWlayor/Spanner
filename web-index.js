import * as spannerGeneric from './libs/generic/index'
import * as spannerWebRestrict from './libs/web-restrict/index'

window.spanner = Object.assign({},spannerGeneric,spannerWebRestrict)
