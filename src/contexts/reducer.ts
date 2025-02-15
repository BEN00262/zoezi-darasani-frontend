import { ActionType, UPDATE_AUTH_TOKEN, WIPE_GLOBAL_CONTEXT } from "./ActionTypes";
import { IGlobalContext } from "./GlobalContext";

export interface IAction {
    type: ActionType
    payload: any
}

export default (state: IGlobalContext, action: IAction) => {

    switch(action.type) {
        case WIPE_GLOBAL_CONTEXT: {
            return {
                authToken: null,
                isTeacher: true,
                communicationId: null
            }
        }

        case UPDATE_AUTH_TOKEN: {
            // get the data from the payload and update the everything
            // we can also get the status if its a school account or not :)
            const { authToken, isTeacher, communicationId } = action.payload

            return {
                ...state,
                authToken, isTeacher, communicationId
            }
        }
    }

    return state
}