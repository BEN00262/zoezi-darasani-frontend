import { useContext, useState } from "react";
import {Navigate, Outlet, Route, useLocation } from "react-router-dom";
import MessagesComp from "../components/Messages";
import { GlobalContext } from "../contexts/GlobalContext";
import ErrorPage from "../_pages/404";

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

// this comes after the guy is logged in :)
export const AdminScopedRoute = () => {
    // the communicationId is the users id ( use it to login into the page :) )
    const { isTeacher, communicationId } = useContext(GlobalContext);

    if (isTeacher) {
        // redirect to the home of the teacher :)
        return <Navigate to={`/teacher/${communicationId}`} state={{ from: location }}/>
    }

    // proceed :)
    return <Outlet/>
}

export const ForwardProtectedRoute = () => {
    let location = useLocation();
    const { authToken, communicationId, isTeacher } = useContext(GlobalContext);


    if (authToken) {
        return <Navigate to={
            isTeacher ? `/teacher/${communicationId}` : "/dashboard"
        } state={{ from: location }}/>
    }

    return <Outlet/>
}

export default ProtectedRoute