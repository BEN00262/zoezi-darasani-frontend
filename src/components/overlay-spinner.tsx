import { SpinnerRoundOutlined } from 'spinners-react';

export interface IOverlaySpinnerComp {
    isLoading: boolean
    text?: string
}

const OverlaySpinnerComp: React.FC<IOverlaySpinnerComp> = ({ isLoading, text }) => {
    return (
        <>
            {
                isLoading ? 
                    <div style={{
                        zIndex: 11,
                        position: "fixed",
                        height: "100vh",
                        width: "100%",
                        backgroundColor: "rgba(0,0,0,.8)",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center"
                    }}>
                        <SpinnerRoundOutlined color='teal' thickness={200} />
                        {text ? <span className="center black-text sub-modal-texts">{text}</span> : null}
                    </div>
                    : null
            }
        </>
    )
}

export default OverlaySpinnerComp