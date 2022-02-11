const EmptyComp: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div style={{
            height: "200px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }}>
           <p className="sub-modal-texts"><b>{message}</b></p>
        </div>
    )
}

export default EmptyComp