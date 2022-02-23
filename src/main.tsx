import React from 'react'
import ReactDOM from 'react-dom'
import "./styles/style.css"
import LoaderPage from './_pages/loader'

const AppSuspense = React.lazy(() => import("./App"))
const MainComp = () => {
  return (
    <React.StrictMode>
    <React.Suspense fallback={<LoaderPage/>}>
      <AppSuspense/>
    </React.Suspense>
  </React.StrictMode>
  )
}

const rootElement = document.getElementById("root");
if (rootElement) {
  if (rootElement.hasChildNodes()) {
    ReactDOM.hydrate(<MainComp />, rootElement);
  } else {
    ReactDOM.render(<MainComp />, rootElement);
  } 
}

// ReactDOM.render(
//   <React.StrictMode>
//     <React.Suspense fallback={<LoaderPage/>}>
//       <AppSuspense/>
//     </React.Suspense>
//   </React.StrictMode>,
//   document.getElementById('root')
// )
