import React from "react";

export default class GlobalErrorBoundaryComp extends React.Component {
    constructor(props: any) {
      super(props);
      this.state = { hasError: false, error: null, errorInfo: null };
    }
  
    static getDerivedStateFromError(error: any) {
      return { hasError: true };
    }
  
    componentDidCatch(error: any, errorInfo: any) {
      // this.setState({
      //   error,
      //   errorInfo
      // })
      console.log(error, errorInfo)
    }
  
    render() {
        // @ts-ignore
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
              <div className="row center">
                <h6>Something went wrong. We are very sorry for the inconvenience. </h6>
                {/* give them an ability to send the bug shit to the server */}
                <button
                  className="waves-effect waves-light materialize-red btn"
                >REPORT ISSUE</button>
              </div>
            )
        }
  
        return this.props.children; 
    }
}