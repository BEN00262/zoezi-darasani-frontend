// @ts-ignore
import M from 'materialize-css';
import axios from "axios";
import { SyntheticEvent, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { setAuthorizationToken, useGlobalZoeziDispatch } from "../contexts/GlobalContext";
import verifyToken from '../utils/verify';
import { useMutation } from 'react-query';

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
    const dispatch = useGlobalZoeziDispatch();
    const [loginDetails, setLoginDetails] = useState<ILoginDetails>({
        asTeacher: false, email: "", password: ""
    });
    const navigate = useNavigate();

    const loginMutation = useMutation(({ email, password }: { email: string, password: string }) => {
      const instance = M.Tabs.getInstance(document.getElementById("login_options_tab"));

      // check if a bunch of stuff are empty if not just send them
      return axios.post(instance.index === 1 ? "/api/teacher/login" : "/api/school/login", { email, password })
          .then(({ data }) => {
              if (data) {
                  if (data.status) { return data.token }
                  throw new Error(data.message);
              }

              throw new Error("Unexpected error!");
          })
    }, {
      onSuccess: (token, variables, context) => {
        setAuthorizationToken(token, dispatch);
        const {communicationId, isTeacher } = verifyToken(token); // this is redudant but who gives an f
        navigate(isTeacher ? `/teacher/${communicationId}`: "/shop", { replace: true })
      }
    })

    useEffect(() => {
      M.Tabs.init(document.querySelector(".tabs"), {});
    }, []);

    const handleInputValueChange = (e: any) => {
        setLoginDetails(old => ({
            ...old,
            [e.target.name]: e.target.value
        }))
    }

    const handleFormSubmission = (e: SyntheticEvent) => {
        e.preventDefault();
        
        loginMutation.mutate({ 
          email: loginDetails.email, 
          password: loginDetails.password 
        });
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
            loginMutation.isError ?
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
                        <p>{(loginMutation.error as Error).message}</p>
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
                isLoading={loginMutation.isLoading}
              />
            </div>
            <div id="teacher">
              <TeacherLoginForm
                handleFormSubmission={handleFormSubmission}
                handleInputValueChange={handleInputValueChange}
                loginDetails={loginDetails}
                isLoading={loginMutation.isLoading}
              />
            </div>
          </div>

        </div>
      </div>
      </main>
    )
}