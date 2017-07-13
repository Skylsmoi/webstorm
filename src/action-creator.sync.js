export const SET_HELLO_DATA = 'SET_HELLO_DATA'
export const MAP_HELLO_WITH_API = 'MAP_HELLO_WITH_API'
export const RESET_HELLO = 'RESET_HELLO'
export const UNUSED_ACION = 'UNUSED_ACION'

export const setHelloData = helloData => ({ type: SET_HELLO_DATA, hello: helloData })
export const mapHelloWithApi = apiData => ({ type: MAP_HELLO_WITH_API, hello: apiData })
