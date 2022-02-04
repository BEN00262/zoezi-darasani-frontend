import { SpinnerInfinity } from "spinners-react";


const LoaderPage = () => {
    return (
        <main style={{display: "flex",justifyContent: "center",alignItems: "center"}}>
            <SpinnerInfinity color="teal"/>
        </main>
    )
}

export default LoaderPage