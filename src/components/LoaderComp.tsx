import { SpinnerInfinity } from "spinners-react"

const LoaderComp = () => {
    return (
        <div style={{
            height: "200px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <SpinnerInfinity color="teal"/>
        </div>
    )
}

export default LoaderComp