import { useContext, useState } from "react";
import {Navigate, Outlet, Route, useLocation } from "react-router-dom";
import MessagesComp from "../components/Messages";
import { GlobalContext } from "../contexts/GlobalContext";

const ProtectedRoute = () => {
    let location = useLocation();
    const { authToken } = useContext(GlobalContext);


    if (!authToken) {
        return <Navigate to="/login" state={{ from: location }}/>
    }

    return (
        <>
            <MessagesComp/>
            <Outlet/>
        </>
    )
}

export const ForwardProtectedRoute = () => {
    let location = useLocation();
    const { authToken } = useContext(GlobalContext);


    if (authToken) {
        return <Navigate to="/dashboard" state={{ from: location }}/>
    }

    return <Outlet/>
}

export default ProtectedRoute