import React from 'react'
import ReactDOM from 'react-dom/client'
import "reset-css"
import "@/assets/styles/global.scss"
import {BrowserRouter} from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <React.Suspense fallback={<div>Loading...</div>}>

                    <App/>
            </React.Suspense>
        </BrowserRouter>
    </React.StrictMode>,
)
