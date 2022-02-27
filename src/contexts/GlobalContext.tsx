import { createContext, useReducer } from "react";
import axios from 'axios';
import reducer from "./reducer";
import { UPDATE_AUTH_TOKEN, WIPE_GLOBAL_CONTEXT } from "./ActionTypes";
import verifyToken from "../utils/verify";

export interface IGlobalContext {
    authToken: string | null
    isTeacher: boolean
    communicationId: string
}

// @ts-ignore
export const initialContext: IGlobalContext = {
    ...verifyToken(localStorage.getItem("authToken") || "")
}

export const GlobalContext = createContext(initialContext);

axios.defaults.baseURL = "/"; //"http://localhost:3500/"; // set the base url here :)
// axios.interceptors.response.use(response => response, error => {
//     // we check for a 403 type of an error ( if there is a 403 ---> we can log the guy out )

// })

const GlobalContextComp = ({ children }: { children: any }) => {
    const [state, dispatch] = useReducer(reducer, initialContext);

    // this one hehehe
    const setAuthorizationToken = (_authToken: string) => {
        // open up the authTokena and we are done
        const { authToken, isTeacher, communicationId } = verifyToken(_authToken)
        localStorage.setItem("authToken", _authToken)

        dispatch({
            type: UPDATE_AUTH_TOKEN,
            payload: { authToken, isTeacher, communicationId }
        })
    }

    const wipeCurrentContext = () => {
        localStorage.setItem("authToken", "")

        // wipes the data off
        dispatch({
            type: WIPE_GLOBAL_CONTEXT,
            payload: null
        })
    }

    return (
        <GlobalContext.Provider value={{ 
            ...state,

            // @ts-ignore
            setAuthorizationToken, wipeCurrentContext
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextComp