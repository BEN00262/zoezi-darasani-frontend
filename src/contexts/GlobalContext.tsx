import React, { useReducer } from "react";
import axios, { AxiosError } from 'axios';
import reducer, { IAction } from "./reducer";
import { UPDATE_AUTH_TOKEN, WIPE_GLOBAL_CONTEXT } from "./ActionTypes";
import verifyToken from "../utils/verify";
import { atom } from "recoil";
import { setRecoil } from "recoil-nexus";
import { createContainer } from "react-tracked";

export interface IGlobalContext {
    authToken: string | null
    isTeacher: boolean
    communicationId: string
}

// @ts-ignore
export const initialContext: IGlobalContext = {
    ...verifyToken(localStorage.getItem("authToken") || "")
}

// export a monitor for global errors :)
export const ForbiddenErrorState = atom<string | null>({
    key: 'ForbiddenErrorStateId',
    default: null
})

// @ts-ignore
axios.defaults.baseURL = import.meta.env.VITE_MAIN_SERVER_ENDPOINT; // "http://localhost:3500/"; // set the base url here :)
axios.interceptors.response.use(response => response, (error: AxiosError | Error) => {
    // we check for a 403 type of an error ( if there is a 403 ---> we can log the guy out )
    if (axios.isAxiosError(error) && error.response && error.response.status === 403){
        console.log(error);
        // we now have a forbidden error thing :) ( what should we do ---> ask if they want to relog in );
        setRecoil(ForbiddenErrorState, "Forbidden access. Please re-login");
        // we wont throw the error again :)
        return;
    }

    throw error; // rethrow it :)
});

const useValue = () => useReducer(reducer, initialContext);

export const {
    Provider: GlobalContextComp,
    useTrackedState: useGlobalZoeziTrackedState,
    useUpdate: useGlobalZoeziDispatch,
} = createContainer(useValue);

export const setAuthorizationToken = (_authToken: string, dispatch: React.Dispatch<IAction>) => {
    const { authToken, isTeacher, communicationId } = verifyToken(_authToken)
    localStorage.setItem("authToken", _authToken);

    dispatch({
        type: UPDATE_AUTH_TOKEN,
        payload: { authToken, isTeacher, communicationId }
    });
}

export const wipeCurrentContext = (dispatch: React.Dispatch<IAction>) => {
    localStorage.setItem("authToken", "");

    dispatch({
        type: WIPE_GLOBAL_CONTEXT,
        payload: null
    });
}