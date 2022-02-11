// @ts-ignore
import M from 'materialize-css';
import axios from "axios";
import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";
import verifyToken from '../utils/verify';

interface ILoginDetails {
    email: string
    password: string
    asTeacher: boolean
}

interface ILoginPage {
  handleFormSubmission: (e: SyntheticEvent) => void
  loginDetails: ILoginDetails
  handleInputValueChange: (e: any) => void
  isLoading: boolean
}

const LoginForm: React.FC<ILoginPage> = ({ 
  handleFormSubmission,  loginDetails, 
  handleInputValueChange, isLoading 
}) => {
  return (
    <div className="col s12 m6 push-m3">
      <form className="contactustext" onSubmit={handleFormSubmission} method="POST">
        <div className="row">
          <div className="input-field col s12">
            <input id="email" required value={loginDetails.email} type="email" onChange={handleInputValueChange}  className="validate contactustext" name="email"/>
            <label htmlFor="email">Email</label>
          </div>

          <div className="input-field col s12">
            <input id="password" required value={loginDetails.password} type="password" onChange={handleInputValueChange} name="password" className="validate"/>
            <label htmlFor="password">Password</label>
          </div>
        </div>
        <button className="waves-effect waves-light btn sub-names materialize-red" style={{width:"100%"}} type="submit">
          {
            isLoading ? "login..." : <i className="material-icons">exit_to_app</i>
          }
        </button>
      </form>
    </div>
  )
}

const TeacherLoginForm: React.FC<ILoginPage> = ({ 
  handleFormSubmission,  loginDetails, 
  handleInputValueChange, isLoading 
}) => {
  return (
    <div className="col s12 m6 push-m3">
      <form className="contactustext" onSubmit={handleFormSubmission} method="POST">
        <div className="row">
          <div className="input-field col s12">
            <input id="teacher_email" required value={loginDetails.email} type="email" onChange={handleInputValueChange}  className="validate contactustext" name="email"/>
            <label htmlFor="teacher_email">Email</label>
          </div>

          <div className="input-field col s12">
            <input id="teacher_password" required value={loginDetails.password} type="password" onChange={handleInputValueChange} name="password" className="validate"/>
            <label htmlFor="teacher_password">Password</label>
          </div>
        </div>
        <button className="waves-effect waves-light btn sub-names materialize-red" style={{width:"100%"}} type="submit">
          {
            isLoading ? "login..." : <i className="material-icons">exit_to_app</i>
          }
        </button>
      </form>
    </div>
  )
}

export default function LoginPage() {
    const {
        // @ts-ignore
        setAuthorizationToken
    } = useContext(GlobalContext);
    const [loginDetails, setLoginDetails] = useState<ILoginDetails>({
        asTeacher: false, email: "", password: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<string>();
    const navigate = useNavigate();

    useEffect(() => {
      M.Tabs.init(document.querySelector(".tabs"), {

      });
    }, []);

    const handleInputValueChange = (e: any) => {
        setLoginDetails(old => ({
            ...old,
            [e.target.name]: e.target.value
        }))
    }

    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();

        const { email, password } = loginDetails;
        setIsLoading(true);

        let instance = M.Tabs.getInstance(document.getElementById("login_options_tab"));

        // check if a bunch of stuff are empty if not just send them
        axios.post(instance.index === 1 ? "/api/teacher/login" : "/api/school/login", { email, password })
            .then(({ data }) => {
                // we set the data here 
                if (data) {

                    if (data.status) {
                      // logged in successfully
                      setAuthorizationToken(data.token);

                      const {communicationId, isTeacher } = verifyToken(data.token); // this is redudant but who gives an f
                      return navigate(isTeacher ? `/teacher/${communicationId}`: "/shop", { replace: true })
                    }

                    setErrors(data.message);
                    return;
                }

                throw new Error("Unreachable");
            })
            .finally(() => setIsLoading(false))
    }

    // login into the system and get all the details we want then use them to create other stuffs :)


    return (
      <main>
           <div className="container">
        <div className="section">
    
          <div className="row">
    
            <div className="col s12 center">
              <h3><i className="mdi-content-send brown-text"></i></h3>
              <h5 className="sub-names">Sign In</h5>
            </div>
          </div>
          {
            errors ?
            <div className="row">
                <div className="col s12 m6 push-m3">
                    <div className="sub-modal-texts" style={{
                        borderLeft: "2px solid red",
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        borderRadius: "3px",
                        lineHeight: "4em",
                        backgroundColor: "rgba(255,0,0, 0.1)",
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                    }}>
                        <i className="material-icons left">error_outline</i>
                        <p>{errors}</p>
                    </div>
                </div>
            </div>
            : null
          }
          <div className="row">
            <div className="col s12 m6 push-m3">
              <ul className="tabs tabs-fixed-width" id="login_options_tab">
                <li className="tab col s3"><a className="active" href="#school">School Admin</a></li>
                <li className="tab col s3"><a href="#teacher">Teacher</a></li>
              </ul>
            </div>
          </div>

          <div className="row">
            <div id="school">
              <LoginForm
                handleFormSubmission={handleFormSubmission}
                handleInputValueChange={handleInputValueChange}
                loginDetails={loginDetails}
                isLoading={isLoading}
              />
            </div>
            <div id="teacher">
              <TeacherLoginForm
                handleFormSubmission={handleFormSubmission}
                handleInputValueChange={handleInputValueChange}
                loginDetails={loginDetails}
                isLoading={isLoading}
              />
            </div>
          </div>

        </div>
      </div>
      </main>
    )
}