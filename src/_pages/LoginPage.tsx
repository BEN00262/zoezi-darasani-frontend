// @ts-ignore
import M from 'materialize-css';
import axios from "axios";
import { SyntheticEvent, useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../contexts/GlobalContext";

import OverlaySpinnerComp from "../components/overlay-spinner";

interface ILoginDetails {
    email: string
    password: string
    asTeacher: boolean
}

interface ILoginPage {
  handleFormSubmission: (e: SyntheticEvent) => void
  loginDetails: ILoginDetails
  handleInputValueChange: (e: any) => void
}

const LoginForm: React.FC<ILoginPage> = ({ handleFormSubmission,  loginDetails, handleInputValueChange}) => {
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
          <i className="material-icons">exit_to_app</i>
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
    const [errors, setErrors] = useState<string[] | null>();
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
                if (data && data.status) {
                    // logged in successfully
                    setAuthorizationToken(data.token);
                    return navigate("/dashboard", { replace: true })
                }

                throw new Error("Unreachable");
            })
            .finally(() => setIsLoading(false))
    }

    // login into the system and get all the details we want then use them to create other stuffs :)


    return (
      <main>
            <OverlaySpinnerComp
              isLoading={isLoading}
            />
           <div className="container">
        <div className="section">
    
          <div className="row">
    
            <div className="col s12 center">
              <h3><i className="mdi-content-send brown-text"></i></h3>
              <h5 className="sub-names">Sign In</h5>
            </div>
          </div>
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
              />
            </div>
            <div id="teacher">
              <LoginForm
                handleFormSubmission={handleFormSubmission}
                handleInputValueChange={handleInputValueChange}
                loginDetails={loginDetails}
              />
            </div>
          </div>

        </div>
      </div>
      </main>
    )
}