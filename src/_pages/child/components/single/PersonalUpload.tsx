import { useEffect, useState } from "react";
import { useMediaQuery } from 'react-responsive';

export interface IPersonalUploadComp {
    position: number
    src: string
    alt: string
    setSelected: (index: number) => void
    selected: boolean
    onFileSelectOrUpload: (file: File) => void
}


const PersonalUploadComp: React.FC<IPersonalUploadComp> = ({ 
    position, selected, src, alt, setSelected, onFileSelectOrUpload 
}) => {
    const isMobilePhone = useMediaQuery({ query: '(max-width: 760px)' });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    useEffect(() => {
        if (selected && selectedFile) {
            onFileSelectOrUpload(selectedFile);
        }
    }, [selectedFile, selected]);

    return (
        <div className="col s6 m3">
            <div className="z-depth-0 avatar-container" style={{
               border: `1px solid ${selected ? "teal" : "#d3d3d3"}`,
                height: "200px",
                marginTop: "10px",
                marginBottom: "10px",
                borderRadius: "5px"
            }} onClick={_ => setSelected(position)}>
                <div className="center-image" style={{
                    height: "100%",
                    padding: "10px"
                }}>
                     <img
                        className="img-responsive"
                        style={{
                            objectFit: "contain",
                            height: "140px",
                            width: "100%",
                        }}
                        src={selectedFile ? window.URL.createObjectURL(selectedFile): src} 
                        alt={alt} 
                    />
                </div>
                <div className="center" style={{
                    marginTop: "-110px"
                }}>
                    <label htmlFor="personal_image_upload" style={{
                        cursor: "pointer",
                        border: "2px solid #26a69a",
                        backgroundColor: "#26a69a",
                        paddingTop: "5px",
                        paddingBottom: "5px",
                        paddingLeft: isMobilePhone ? "2px" : "20px",
                        paddingRight: isMobilePhone ? "2px" : "20px",
                        borderRadius: "20px",
                    }}>
                        <span className="white-text"><b>Upload Picture</b></span>
                    </label>
                    <input id="personal_image_upload" style={{ display: "none" }} type="file" accept="image/*" onChange={e => {
                        setSelectedFile(e.target.files ? e.target.files[0] : null);
                        setSelected(position);
                    }} />
                </div>
            </div>
        </div>
    )
}

export default PersonalUploadComp