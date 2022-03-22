import { useContext } from "react";
import {Navigate, Outlet, useLocation } from "react-router-dom";
import ForbiddenErrorComp from "../components/ForbiddenErrorComp";
import MessagesComp from "../components/Messages";
import { GlobalContext, useGlobalZoeziTrackedState } from "../contexts/GlobalContext";

const ProtectedRoute = () => {
    const location = useLocation();
    const { authToken } = useGlobalZoeziTrackedState();


    if (!authToken) {
        return <Navigate to="/login" state={{ from: location }}/>
    }
    
    return (
        <>
            <MessagesComp/>
            <ForbiddenErrorComp/>
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
    const location = useLocation();
    const { authToken, communicationId, isTeacher } = useContext(GlobalContext);


    if (authToken) {
        return <Navigate to={
            isTeacher ? `/teacher/${communicationId}` : "/dashboard"
        } state={{ from: location }}/>
    }

    return <Outlet/>
}

export default ProtectedRoute