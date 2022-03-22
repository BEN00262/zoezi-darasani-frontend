import NotFoundImage from '../img/not_found.svg';

const EmptyComp: React.FC<{ message: string }> = ({ message }) => {
    return (
        <div style={{
            height: "300px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <img src={NotFoundImage} style={{
                height: "200px"
            }} className="img-responsive" alt="file upload image" />
           <p className="sub-modal-texts"><b>{message}</b></p>
        </div>
    )
}

export default EmptyComp