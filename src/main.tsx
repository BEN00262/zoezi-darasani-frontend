import React from 'react'
import ReactDOM from 'react-dom'
import "./styles/style.css"
import LoaderPage from './_pages/loader'

const AppSuspense = React.lazy(() => import("./App"))

ReactDOM.render(
  <React.StrictMode>
    <React.Suspense fallback={<LoaderPage/>}>
      <AppSuspense/>
    </React.Suspense>
  </React.StrictMode>,
  document.getElementById('root')
)
