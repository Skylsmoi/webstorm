import { put, takeEvery, all, select } from 'redux-saga/effects'
import {
  MATERIAL_ATTRIBUTE_SETTER as MAS,
  SET_MATERIAL_IS_MODIFIED,

  VARIATION_ATTRIBUTE_SETTER as VAS,
  SET_VARIATION_IS_MODIFIED,
  SET_VARIATION_LIST_IS_MODIFIED
} from './action-creator.sync.js'

export function * watchMaterialIsModified () {
  yield takeEvery(Object.keys(MAS).map(oneKey => oneKey), materialIsModified)
}

export function * materialIsModified () {
  yield put({ type: SET_MATERIAL_IS_MODIFIED })
}

export function * watchVariationIsModified () {
  yield takeEvery(Object.keys(VAS).map(oneKey => oneKey), variationIsModified)
}

export function * variationIsModified () {
  const variationId = yield select(state => state.currentVariation.unique_id)
  yield put({ type: SET_VARIATION_IS_MODIFIED, isModified: true })
  yield put({ type: SET_VARIATION_LIST_IS_MODIFIED, unique_id: variationId, isModified: true })
}

export default function * rootSaga () {
  yield all([
    watchMaterialIsModified(),
    watchVariationIsModified()
  ])
}
