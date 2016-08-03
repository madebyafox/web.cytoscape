import {handleActions} from 'redux-actions'
import {Map} from 'immutable'

const defaultState = Map({
  backgroundColor: '#FAFAFA',
})

export default handleActions({
  SET_BACKGROUND_COLOR: (state, action) => (
    state.set('backgroundColor', action.payload)
  )
}, defaultState)

