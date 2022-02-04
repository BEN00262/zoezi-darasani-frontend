import { useEffect, useState } from "react"

export interface INetworkUploadComp {
    position: number
    selected: boolean
    setSelected: (index: number) => void
    src: string
    alt: string
    onFileSelectOrUpload: (file: File) => void
}

const getUrlExtension = (url: any) => {
    return url
      .split(/[#?]/)[0]
      .split(".")
      .pop()
      .trim();
  }

const fetchImage = async (imgUrl: string) => {
    var imgExt = getUrlExtension(imgUrl);

    const response = await fetch(imgUrl);
    const blob = await response.blob();

    return new File([blob], "profileImage." + imgExt, {
      type: blob.type,
    });
}

const NetworkUploadComp: React.FC<INetworkUploadComp> = ({ 
    position, selected, setSelected, src, alt, onFileSelectOrUpload 
}) => {
    useEffect(() => {
        if (selected) {
            fetchImage(src)
                .then(file => onFileSelectOrUpload(file))
        }
    }, [selected]);


    return (
        <div className="col s6 m3">
            <div className="z-depth-0 avatar-container" style={{
                border: `1px solid ${selected ? "teal" : "#d3d3d3"}`,
                height: "200px",
                marginTop: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                borderRadius: "5px"
            }} onClick={_ => setSelected(position)}>
                <div className="center-image" style={{
                    height: "100%",
                    padding: "10px"
                }}>
                    <img className="img-responsive"
                        style={{
                            objectFit: "contain",
                            height: "140px",
                            width: "100%"
                        }} 
                        src={src} alt={alt} />
                </div>
            </div>
        </div>
    )
}

export default NetworkUploadComp