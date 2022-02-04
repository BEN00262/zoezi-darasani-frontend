import { useEffect, useState } from "react"
import NetworkUploadComp from "../single/NetworkUpload"
import PersonalUploadComp from "../single/PersonalUpload";
import { useMediaQuery } from 'react-responsive';
import { IConfiguration } from "../../pages/RegistrationPage";

const isInMobileApp = (document.getElementById("isInMobileApp")?.innerText || "").trim().toLowerCase() === "mobile";

export interface IProfileSelectorComp {
    passSelectedFileToParent: (file: File) => void
    configuration: IConfiguration
}

const ProfileSelectorComp: React.FC<IProfileSelectorComp> = ({ passSelectedFileToParent, configuration }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const isMobilePhone = useMediaQuery({ query: '(max-width: 760px)' });

    const [itemState, setItemState] = useState<boolean[]>([]);

    useEffect(() => {
        if (selectedFile) {
            passSelectedFileToParent(selectedFile);
        }
    }, [selectedFile]);

    const setIsSelected = (index: number) => {
        let copy = new Array(configuration.preloaded_avatars.length + 1).fill(false);
        copy[index] = true;
        setItemState(copy);
    }

    // create the modal here
    return (
        <div id="profile-modal" className="modal bottom-sheet">
            <div className="modal-content">
                <div style={{
                        position: "fixed",
                        top: "10px",
                        right: "10px"
                    }}>
                    <span><i className="modal-close small material-icons white-text">close</i></span>
                </div>
                <h5 className="sub-names">{ isInMobileApp ? "Select avatar" : "Select avatar or  upload profile picture"}</h5>

                <div className={`${isMobilePhone ? "" : "container"}`}>
                    <div className="row">
                        {
                            configuration.preloaded_avatars.map(({ src, alt }, index) => {
                                return <NetworkUploadComp 
                                    key={`network_upload_${index}`}
                                    position={index}
                                    alt={alt}
                                    selected={itemState[index]}
                                    setSelected={setIsSelected}
                                    src={src}
                                    onFileSelectOrUpload={setSelectedFile}
                                />
                            })
                        }


                        {/* load the profile uploader :) */}
                        {/* hide this feature till we are in the mobile app */}
                        {isInMobileApp ? null :
                            <PersonalUploadComp
                                src={configuration.default_avatar.src}
                                alt={configuration.default_avatar.alt}
                                position={configuration.preloaded_avatars.length} // get the length thats the last item (:))
                                onFileSelectOrUpload={setSelectedFile}
                                // get the last index of the selected item
                                selected={itemState[itemState.length - 1]}
                                setSelected={setIsSelected}
                            />
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfileSelectorComp