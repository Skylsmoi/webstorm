import { store } from './store.js'
import {
  addMaterialErrorInField,
  setVariationErrorInField,
  newFlashMsg
} from './action-creator.sync.js'

export const PAGE_LIST = {
  NEW_MATERIAL: '/material/new',
  VIEW_MATERIAL: '/material/view',
  EDIT_MATERIAL: '/material/edit',
  NEW_VARIATION: '/variation/new',
  SEARCH_PAGE: '/'
}

// Carefull ! GLOBAL_SERVER_URL should not be used for production since api in on same server than app
export let GLOBAL_SERVER_URL
export function setGlobalServerUrl (newServerUrl) {
  GLOBAL_SERVER_URL = newServerUrl
}

export let GLOBAL_API_PATH
export function setGlobalApiPath (newApiPath) {
  GLOBAL_API_PATH = newApiPath
}
export const GLOBAL_API_FETCH_CONFIG = {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa('apc:apc2017#')
  }
}

export function generateNewMaterialCompositionId () {
  return (store.getState().currentMaterial.composition.reduce((acc, curComposition) => curComposition.id >= acc.id ? curComposition : acc, {id: 0}).id) + 1
}
export function generateNewVariationThemeId () {
  return (store.getState().currentVariation.theme.reduce((acc, curTheme) => curTheme.id >= acc.id ? curTheme : acc, {id: 0}).id) + 1
}
export function generateNewVariationColorId () {
  return (store.getState().currentVariation.color.reduce((acc, curColor) => curColor.id >= acc.id ? curColor : acc, {id: 0}).id) + 1
}
export function generateNewVariationColorSizeId (colorId) {
  return (store.getState().currentVariation.color.find(oneColor => oneColor.id === colorId).size.reduce(
    (acc, curSize) => curSize.id >= acc.id ? curSize : acc, {id: 0}
  ).id) + 1
}

export function mapSearchTermToApi (searchVar) {
  const mapLocalAppToApi = {
    materialDescription: 'raw_materials_description',
    themeCode: 'raw_materials_themes_theme_id',
    themeDescription: 'raw_material_themes_description',
    codeSap: 'raw_materials_sap_id',
    codeBdd: 'raw_materials_id',
    nature: 'raw_materials_nature_id',
    type: 'raw_materials_type_id',
    brand: 'raw_materials_variable_data_brand_id',
    collaboration: 'raw_materials_variable_data_collaboration_id',
    season: 'raw_materials_variable_data_season_id',
    collection: 'raw_materials_variable_data_collection_id',
    status: 'raw_materials_variable_data_status_id'
  }

  return Object.keys(searchVar).reduce((acc, oneSearchTerm) => searchVar[oneSearchTerm] !== ''
    ? `${acc}${mapLocalAppToApi[oneSearchTerm]}=${encodeURIComponent(searchVar[oneSearchTerm])}&`
    : acc
  , '?').slice(0, -1)
}

export function handleFetchResponse (res, dispatch) {
  switch (res.status) {
    case 204:
      return Promise.resolve('') // no-content
    case 200:
    case 304:
      return res.json() // json() returns a promise
    case 400:
      dispatch(newFlashMsg('Erreur, un ou plusieurs champs sont invalides.', 'warning')); break
    case 404:
      dispatch(newFlashMsg('Erreur, matière et/ou variation inconnue.', 'danger')); break
    case 409:
      dispatch(newFlashMsg('Erreur, conflit de donées. Généralement lié au code Sap ou au quadruplé.', 'danger')); break
    case 401:
    case 403:
    case 500:
    case 501:
    case 502:
    case 503:
    case 504:
    default:
      dispatch(newFlashMsg('Une erreur est survenue.', 'danger'))
  }
  return res.json().then(json => Promise.reject(json))
}

export function handleMaterialApiError (err, dispatch) {
  const propertyMatch = {
    unique_id: 'codeBdd',
    sap_id: 'codeSap',
    description: 'description',
    definition_uom: 'definitionUom',
    type: 'type',
    width: 'width',
    width_uom: 'widthUom',
    thickness: 'thickness',
    thickness_uom: 'thicknessUom',
    weight: 'weight',
    weight_uom: 'weightUom',
    care_instructions: 'careInstruction',
    nature: 'nature',
    class: 'class',
    subclass: 'subClass',
    composition: 'composition'
  }
  dispatch(addMaterialErrorInField(err.errors.map(oneErr => propertyMatch[oneErr.path[0]])))
}

// // with dynamic variable name NOTE : you must call this function with 'new' but standard.js doesn't like it.
// // see https://stackoverflow.com/questions/5117127/use-dynamic-variable-names-in-javascript
// export function handleApiError (err, prefix, dispatch) {
//   this.materialPropertyMatch = {
//     unique_id: 'codeBdd', ...
//   }
//   const errorList = err.map(oneErr => this[prefix + 'PropertyMatch'][oneErr.path[0]])
//   dispatch(addMaterialErrorInField(errorList))
// }

export function handleVariationApiError (err, dispatch) {
  const propertyMatch = {
    unique_id: 'unique_id',
    image_url: 'image',
    comment: 'comment',
    collaboration: 'collaboration',
    status: 'status',
    main_component: 'mainComponent',
    brand: 'brand',
    themes: 'theme',
    colors: 'color'
  }
  dispatch(setVariationErrorInField(err.errors.map(oneErr => propertyMatch[oneErr.path[0]])))
}
