import {
  GLOBAL_API_PATH,
  GLOBAL_API_FETCH_CONFIG,
  handleFetchResponse
} from './helper.js'
import {
  startFetch,
  stopFetch,
  setCustoBrand,
  setCustoSeason,
  setCustoTaxonomyNature,
  setCustoCareSymbol,
  setCustoMesureUnit,
  setCustoTextileAbbreviation,
  setCustoColor,
  setCustoTheme,
  setCustoStatus,
  setCustoCollection,
  setCustoCollaboration,
  setCustoTaxonomyType,
  setCustoCareInstruction,
  setCustoTaxonomyClass,
  setCustoTaxonomySubClass
} from './action-creator.sync.js'

// for debug purpose
// this function overrides whatwg-fetch to add loging in console
// sessionStorage doesn't work since we can't stringify [Object Response]
const fetchAndLog = fetch
fetch = (url, param) => fetchAndLog(url, param).then(res => { // eslint-disable-line
  res.clone().json().then(json => console.log(`req :`, url, param, `\nres :`, res, `\nres body :`, json))
  return Promise.resolve(res)
})

export const getCustoBrand = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/apc-brands`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoBrand(json)))
  .catch(e => console.log('Error fetching apc-brands.', e))
}

export const getCustoSeason = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/seasons`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoSeason(json)))
  .catch(e => console.log('Error fetching apc-seasons.', e))
}

export const getCustoCollection = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/collections`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoCollection(json)))
  .catch(e => console.log('Error fetching collections.', e))
}

export const getCustoCollaboration = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/apc-collaborations`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoCollaboration(json)))
  .catch(e => console.log('Error fetching apc-collaborations.', e))
}

export const getCustoWashingSymbol = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/care-symbols?where=${encodeURIComponent('{"care_type":"WASHING"}')}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoCareSymbol(json)))
  .catch(e => console.log('Error fetching care-symbols.', e))
}

export const getCustoUnitOfMesure = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/unit-of-measures`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoMesureUnit(json)))
  .catch(e => console.log('Error fetching unit-of-measures.', e))
}

export const getCustoTextileAbreviation = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/textile-abbrevations`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoTextileAbbreviation(json)))
  .catch(e => console.log('Error fetching textile-abbrevations.', e))
}

export const getCustoColor = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/apc-colors`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoColor(json)))
  .catch(e => console.log('Error fetching apc-colors.', e))
}

export const getCustoTheme = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/raw-material-themes`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoTheme(json)))
  .catch(e => console.log('Error fetching raw-material-themes.', e))
}

export const getCustoStatus = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/raw-metarial-statuses`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoStatus(json)))
  .catch(e => console.log('Error fetching raw-material-statuses.', e))
}

export const getCustoTaxoNature = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/raw-material-taxonomy-natures`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoTaxonomyNature(json)))
  .catch(e => console.log('Error fetching raw-material-taxonomy-natures.', e))
}

export const getCustoTaxoType = () => dispatch => {
  return fetch(`${GLOBAL_API_PATH}/api/custo/raw-material-taxonomy-types`, {...GLOBAL_API_FETCH_CONFIG, method: 'GET'})
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoTaxonomyType(json)))
  .catch(e => console.log('Error fetching raw-material-taxonomy-types.', e))
}

export const getCustoDataForNewMaterial = () => dispatch => {
  dispatch(startFetch())

  return Promise.all([
    dispatch(getCustoDataQuadruple()),
    dispatch(getCustoTaxoNature()),
    dispatch(getCustoWashingSymbol()),
    dispatch(getCustoUnitOfMesure()),
    dispatch(getCustoTextileAbreviation()),
    dispatch(getCustoColor()),
    dispatch(getCustoTheme()),
    dispatch(getCustoStatus())
  ])
    .then(() => dispatch(stopFetch()))
    .catch(e => console.log('Error fetching CUSTO data', e))
}

export const getCustoDataQuadruple = () => dispatch => {
  return Promise.all([
    dispatch(getCustoBrand()),
    dispatch(getCustoSeason())
  ])
}

export const getCustoDataQuadrupleFull = () => dispatch => {
  return Promise.all([
    dispatch(getCustoBrand()),
    dispatch(getCustoCollaboration()),
    dispatch(getCustoSeason()),
    dispatch(getCustoCollection())
  ])
}

export const getCustoDataForSearchTerm = () => dispatch => {
  return Promise.all([
    dispatch(getCustoDataQuadruple()),
    dispatch(getCustoCollection()),
    dispatch(getCustoCollaboration()),
    dispatch(getCustoTheme()),
    dispatch(getCustoStatus()),
    dispatch(getCustoTaxoNature()),
    dispatch(getCustoTaxoType())
  ])
}

export const getCustoCareInstructionForCareSymbol = careSymbol => dispatch => {
  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/custo/apc-care-instructions?where=${encodeURIComponent(`{"washing_symbol_id":"${careSymbol}"}`)}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
    .then(res => handleFetchResponse(res, dispatch))
    .then(json => dispatch(setCustoCareInstruction(json)))
    .then(() => dispatch(stopFetch()))
    .catch(e => console.log('Error fetching apc-care-instructions.', e))
}

// //---------------- async/await version ----------------
// export const getCustoCareInstructionForCareSymbol = careSymbol => async dispatch => {
//   dispatch(startFetch())
//   try {
//     const fetchCareInstruction = await fetch(GLOBAL_API_PATH + `custo/apc-care-instructions?where=${encodeURIComponent(`{"washing_symbol_id":"${careSymbol}"}`)}`, {
//       ...GLOBAL_API_FETCH_CONFIG,
//       method: 'GET'
//     })
//     const json = await fetchCareInstruction.json()
//     await dispatch(setCustoCareInstruction(json))
//     await dispatch(stopFetch())
//   } catch (e) {
//     console.log('Error fetching apc-care-instructions.', e)
//   }
// }

export const getCustoTypeForNature = natureId => dispatch => {
  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/custo/raw-material-taxonomy-types?raw_material_taxonomy_natures_id=${natureId}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoTaxonomyType(json)))
  .then(() => dispatch(stopFetch()))
  .catch(e => {
    dispatch(stopFetch())
    console.log('Error fetching raw-material-taxonomy-types?raw_material_taxonomy_natures_id.', e)
  })
}

export const getCustoClassForType = typeId => dispatch => {
  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/custo/raw-material-taxonomy-classes?raw_material_taxonomy_types_id=${typeId}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoTaxonomyClass(json)))
  .then(() => dispatch(stopFetch()))
  .catch(e => {
    dispatch(stopFetch())
    console.log('Error fetching raw-material-taxonomy-classes?raw_material_taxonomy_types_id.', e)
  })
}

export const getCustoSubClassForClass = classId => dispatch => {
  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/custo/raw-material-taxonomy-subclasses?raw_material_taxonomy_classes_id=${classId}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoTaxonomySubClass(json)))
  .then(() => dispatch(stopFetch()))
  .catch(e => {
    dispatch(stopFetch())
    console.log('Error fetching raw-material-taxonomy-subclasses?raw_material_taxonomy_classes_id.', e)
  })
}

export const getCustoCollaborationForBrand = brandId => dispatch => {
  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/custo/apc-collaborations?where=${encodeURIComponent(`{"brand_id":"${brandId}"}`)}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoCollaboration(json)))
  .then(() => dispatch(stopFetch()))
  .catch(e => {
    dispatch(stopFetch())
    console.log('Error fetching apc-collaborations.', e)
  })
}

export const getCustoCollectionForSeason = seasonId => dispatch => {
  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/custo/collections?where=${encodeURIComponent(`{"season_id":"${seasonId}"}`)}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setCustoCollection(json)))
  .then(() => dispatch(stopFetch()))
  .catch(e => {
    dispatch(stopFetch())
    console.log('Error fetching apc-collections.', e)
  })
}
