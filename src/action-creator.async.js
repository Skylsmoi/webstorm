import { store } from './store.js'
import {
  GLOBAL_API_PATH,
  GLOBAL_API_FETCH_CONFIG,
  handleFetchResponse
} from './helper.js'
import {
  mapMaterialWithApi,
  mapVariationListWithApi,
  mapVariationWithApi,
  setSearchResultList,
  setVariationUniqueId,
  addVariationList,
  startFetch,
  stopFetch,
  setMaterialCodeBdd,
  newFlashMsg,
  setVariationIsModified,
  setVariationTabFilterBrand,
  setVariationTabFilterCollaboration,
  setVariationTabFilterSeason,
  setVariationTabFilterCollection,
  updateVariationListItem
} from './action-creator.sync.js'

// for debug purpose
// this function overrides whatwg-fetch to add loging in console
// sessionStorage doesn't work since we can't stringify [Object Response]
const fetchAndLog = fetch
fetch = (url, param) => fetchAndLog(url, param).then(res => { // eslint-disable-line
  res.clone().json().then(json => console.log(`req :`, url, param, `\nres :`, res, `\nres body :`, json))
  return Promise.resolve(res)
})

export const viewMaterial = codeBdd => dispatch => {
  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/data/raw-materials/${encodeURIComponent(codeBdd)}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => {
    dispatch(mapMaterialWithApi(json))
    dispatch(stopFetch())
  })
}

export const viewVariation = variationId => dispatch => {
  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas/${encodeURIComponent(variationId)}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => {
    dispatch(mapVariationWithApi(json))

    dispatch(setVariationTabFilterBrand({value: json.brand.id, label: json.brand.description}))
    dispatch(setVariationTabFilterCollaboration({value: json.collaborations.id, label: json.collaborations.description}))
    dispatch(setVariationTabFilterSeason({value: json.season.id, label: json.season.description}))
    dispatch(setVariationTabFilterCollection({value: json.collections.id, label: json.collections.description}))

    dispatch(addVariationList(store.getState().currentVariation, true))
    dispatch(stopFetch())
  })
}

export const saveMaterialComposition = curMat =>
  fetch(`${GLOBAL_API_PATH}/api/data/raw-materials/${curMat.unique_id}/composition`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'POST',
    body: JSON.stringify(curMat.composition.filter(c => c.material.value !== '').map(oneCompo => ({
      textile_abbreviation_id: oneCompo.material.value,
      percentage: parseFloat(oneCompo.percent)
    })))
  })

export const saveVariationImage = curVar => {
  const promise = new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(curVar.image.file)

    reader.onloadend = () => {
      fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas/${curVar.unique_id}/image`, {
        ...GLOBAL_API_FETCH_CONFIG,
        method: 'POST',
        // the split is to remove the 'data:image/png;base64,' from the b64 encoded File
        // https://stackoverflow.com/questions/24289182/how-to-strip-type-from-javascript-filereader-base64-string
        body: JSON.stringify({image: reader.result.split(',')[1]})
      })
      .then(res => resolve(res))
    }
  })

  return promise
}

export const deleteVariationImage = curVar =>
  fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas/${curVar.unique_id}/image`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'DELETE'
  })

export const saveVariationTheme = curVar =>
  fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas/${curVar.unique_id}/themes`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'POST',
    body: JSON.stringify(curVar.theme.filter(t => t.code.value !== '').map(oneTheme => ({
      theme_id: oneTheme.code.value,
      temporary_description: oneTheme.temporary ? oneTheme.description : ''
    })))
  })

export const saveVariationColor = curVar =>
  fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas/${curVar.unique_id}/colors`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'POST',
    body: JSON.stringify(curVar.color.filter(c => c.value !== '').map(c => ({
      color_id: c.value,
      sizes: c.size.map(oneSize => oneSize.value)
    })))
  })

export const saveMaterial = (curMat, curVar) =>
  fetch(`${GLOBAL_API_PATH}/api/data/raw-materials`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'POST',
    body: JSON.stringify({
      _brand_id: curVar.brand.value,
      _collaboration_id: curVar.collaboration.value,
      _season_id: curVar.season.value,
      _collection_id: curVar.collection.value,
      description: curMat.description,
      definition_uom_id: curMat.definitionUom.value,
      type_id: curMat.type.value,
      width: parseFloat(curMat.width),
      width_uom_id: curMat.widthUom.value,
      thickness: curMat.thickness,
      thickness_uom_id: curMat.thicknessUom.value,
      weight: parseFloat(curMat.weight),
      weight_uom_id: curMat.weightUom.value,
      care_instructions_id: curMat.careInstruction.id,
      sap_id: curMat.codeSap,
      nature_id: curMat.nature.value,
      class_id: curMat.class.value,
      subclass_id: curMat.subClass.value
    })
  })

export const saveVariation = (curMat, curVar) =>
  fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'POST',
    body: JSON.stringify({
      raw_material_id: curMat.unique_id ? curMat.unique_id : curMat.codeBdd,
      brand_id: curVar.brand.value,
      collaboration_id: curVar.collaboration.value,
      season_id: curVar.season.value,
      collection_id: curVar.collection.value,
      comment: curVar.comment,
      main_component: curVar.mainComponent
    })
  })

export const processSaveMaterialAndVariation = (curMat, curVar) => dispatch => {
  dispatch(startFetch())

  return saveMaterial(curMat, curVar)
  .then(res => handleFetchResponse(res, dispatch))
  .then(apiMatJson => {
    dispatch(setMaterialCodeBdd(apiMatJson.unique_id))

    return saveVariation(apiMatJson, curVar)
    .then(res => handleFetchResponse(res, dispatch))
    .then(apiVarJson => {
      dispatch(setVariationUniqueId(apiVarJson.unique_id))

      return Promise.resolve({
        ...curMat, // resolve curMat instead of apiMatJson because curMat has the composition
        unique_id: apiMatJson.unique_id,
        ownVar: {
          ...curVar, // resolve curVar instead of apiVarJson because curVar has the themes and colors/sizes
          unique_id: apiVarJson.unique_id
        }
      })
    })
  })
  .then(fullApiJson => new Promise((resolve, reject) => {
    saveMaterialComposition(fullApiJson)
    .then(res => handleFetchResponse(res, dispatch))
    .then(() => resolve(fullApiJson))
  }))
  .then(fullApiJson => new Promise((resolve, reject) => {
    saveVariationTheme(fullApiJson.ownVar)
    .then(res => handleFetchResponse(res, dispatch))
    .then(() => resolve(fullApiJson))
  }))
  .then(fullApiJson => new Promise((resolve, reject) => {
    saveVariationColor(fullApiJson.ownVar)
    .then(res => handleFetchResponse(res, dispatch))
    .then(() => resolve(fullApiJson))
  }))
  .then(fullApiJson => new Promise((resolve, reject) => {
    if (fullApiJson.ownVar.image.isModified && fullApiJson.ownVar.image.file !== '') {
      saveVariationImage(fullApiJson.ownVar)
      .then(() => resolve(fullApiJson))
    } else {
      resolve(fullApiJson)
    }
  }))
  .then(fullApiJson => {
    dispatch(stopFetch())
    return Promise.resolve(fullApiJson)
  })
  .catch(() => dispatch(stopFetch()))
}

export const saveEditMaterial = (curMat, curVar) =>
  fetch(`${GLOBAL_API_PATH}/api/data/raw-materials/${curMat.codeBdd}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'PATCH',
    body: JSON.stringify({
      description: curMat.description,
      definition_uom_id: curMat.definitionUom.value,
      type_id: curMat.type.value,
      width: parseFloat(curMat.width),
      width_uom_id: curMat.widthUom.value,
      thickness: `${curMat.thickness}`,
      thickness_uom_id: curMat.thicknessUom.value,
      weight: parseFloat(curMat.weight),
      weight_uom_id: curMat.weightUom.value,
      care_instructions_id: curMat.careInstruction.id,
      sap_id: curMat.codeSap,
      nature_id: curMat.nature.value,
      class_id: curMat.class.value,
      subclass_id: curMat.subClass.value,
      _status_id: curVar.status.value
    })
  })

export const saveEditVariation = curVar =>
  fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas/${curVar.unique_id}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'PATCH',
    body: JSON.stringify({
      raw_material_id: curVar.materialId,
      brand_id: curVar.brand.value,
      collaboration_id: curVar.collaboration.value,
      season_id: curVar.season.value,
      collection_id: curVar.collection.value,
      comment: curVar.comment,
      status_id: curVar.status.value,
      main_component: curVar.mainComponent
    })
  })

export const processSaveEditMaterialAndVariation = (curMat, curVar) => dispatch => {
  dispatch(startFetch())

  return Promise.all([
    saveEditMaterial(curMat, curVar)
    .then(res => handleFetchResponse(res, dispatch)),

    saveEditVariation(curVar)
    .then(res => handleFetchResponse(res, dispatch)),

    saveMaterialComposition({...curMat, unique_id: curMat.codeBdd})
    .then(res => handleFetchResponse(res, dispatch)),

    saveVariationTheme(curVar)
    .then(res => handleFetchResponse(res, dispatch)),

    saveVariationColor(curVar)
    .then(res => handleFetchResponse(res, dispatch))
  ])
  .then(() => {
    dispatch(setVariationIsModified(false)) // will change currentVariation
    dispatch(updateVariationListItem({...curVar, isModified: false, isOpen: true})) // will change variationList

    let handleImage
    if (curVar.image.isModified) {
      if (curVar.image.file !== '') handleImage = saveVariationImage(curVar)
      else handleImage = deleteVariationImage(curVar)
    } else handleImage = Promise.resolve({status: 204})

    return handleImage.then(res => handleFetchResponse(res, dispatch))
  })
  .then(() => {
    dispatch(stopFetch())
    dispatch(newFlashMsg('Sauvegarde des modifications réussi.'))
  })
  .catch(() => stopFetch())
}

export const processSaveNewVariation = (curMat, curVar) => dispatch => {
  dispatch(startFetch())

  return saveVariation(curMat, curVar)
  .then(res => handleFetchResponse(res, dispatch))
  .then(apiVarJson => {
    dispatch(setVariationUniqueId(apiVarJson.unique_id))

    return Promise.resolve({
      ...curVar, // resolve curVar instead of apiVarJson because curVar has the themes and colors/sizes
      unique_id: apiVarJson.unique_id
    })
  })
  .then(fullApiJson => new Promise((resolve, reject) => {
    saveVariationTheme(fullApiJson)
    .then(res => handleFetchResponse(res, dispatch))
    .then(() => resolve(fullApiJson))
  }))
  .then(fullApiJson => new Promise((resolve, reject) => {
    saveVariationColor(fullApiJson)
    .then(res => handleFetchResponse(res, dispatch))
    .then(() => resolve(fullApiJson))
  }))
  .then(fullApiJson => new Promise((resolve, reject) => {
    if (fullApiJson.image.isModified && fullApiJson.image.file !== '') {
      saveVariationImage(fullApiJson)
      .then(() => resolve(fullApiJson))
    } else {
      resolve(fullApiJson)
    }
  }))
  .then(fullApiJson => {
    dispatch(stopFetch())
    return Promise.resolve(fullApiJson)
  })
  .catch(() => dispatch(stopFetch()))
}

export const searchTerm = searchVar => dispatch => {
  dispatch(startFetch())
  const mapProperties = {
    materialDescription: 'raw_materials_description',
    themeCode: 'raw_materials_themes_theme_id',
    themeDescription: 'raw_materials_themes_description',
    codeSap: 'raw_materials_sap_id',
    codeBdd: 'raw_materials_id',
    variationId: '', // this field cannot be set in the search page
    nature: 'raw_materials_nature_id',
    type: 'raw_materials_type_id',
    brand: 'raw_materials_variable_data_brand_id',
    collaboration: 'raw_materials_variable_data_collaboration_description',
    season: 'raw_materials_variable_data_season_id',
    collection: 'raw_materials_variable_data_collection_description',
    status: 'raw_materials_variable_data_status_id',
    includeDeleted: 'include_delete'
  }
  const GETParamString = `${Object.keys(searchVar).reduce((acc, p) => searchVar[p] !== '' ? `${acc}${mapProperties[p]}=${searchVar[p]}&` : acc, '?')}`.slice(0, -1)

  return fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas${GETParamString}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(setSearchResultList(json)))
  .then(() => dispatch(stopFetch()))
  .catch(e => {
    console.log('Error fetching apc-collections.', e)
    dispatch(stopFetch())
  })
}

export const filterVariationList = materialId => dispatch => {
  const { filterBrand, filterCollaboration, filterSeason, filterCollection } = store.getState().variationTab

  let filtersGetParam = '?'
  filtersGetParam += `raw_materials_id=${materialId}&`
  filtersGetParam += filterBrand.value !== '' ? `raw_materials_variable_data_brand_id=${encodeURIComponent(filterBrand.value)}&` : ''
  filtersGetParam += filterCollaboration.value !== '' ? `raw_materials_variable_data_collaboration_description=${encodeURIComponent(filterCollaboration.label)}&` : ''
  filtersGetParam += filterSeason.value !== '' ? `raw_materials_variable_data_season_id=${encodeURIComponent(filterSeason.value)}&` : ''
  filtersGetParam += filterCollection.value !== '' ? `raw_materials_variable_data_collection_description=${encodeURIComponent(filterCollection.label)}&` : ''
  filtersGetParam = filtersGetParam.slice(0, -1)

  if (filtersGetParam === '') return

  dispatch(startFetch())
  return fetch(`${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas${filtersGetParam}`, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'GET'
  })
  .then(res => handleFetchResponse(res, dispatch))
  .then(json => dispatch(mapVariationListWithApi(json)))
  .then(() => dispatch(stopFetch()))
}

export const deleteVariation = curVar => dispatch => {
  dispatch(startFetch())
  const fetchEndPoint = curVar.firstVariation
    ? `${GLOBAL_API_PATH}/api/data/raw-materials/${curVar.materialId}`
    : `${GLOBAL_API_PATH}/api/data/raw-materials-variable-datas/${curVar.unique_id}`

  return fetch(fetchEndPoint, {
    ...GLOBAL_API_FETCH_CONFIG,
    method: 'DELETE'
  })
  .then(res => dispatch(stopFetch()))
  .catch(e => {
    console.log('Error fetching delete raw-materials-variable-datas.', e)
    dispatch(stopFetch())
  })
}
