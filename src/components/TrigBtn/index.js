import { ACTIONS } from '../../App'

export default function TrigBtn({ dispatch, trig }) {
    return <button onClick={() => dispatch({ type: ACTIONS.CHOOSE_TRIG, payload: { trig }})}>
        {trig}
        </button>
}
