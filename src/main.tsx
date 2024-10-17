import React from 'react'
import ReactDOM from 'react-dom/client'
import "reset-css"
import "@/assets/styles/global.scss"
import {BrowserRouter} from 'react-router-dom'
import App from './App'
import {DevSupport} from "@react-buddy/ide-toolbox";
import {ComponentPreviews, useInitial} from "@/dev";

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <BrowserRouter>
            <React.Suspense fallback={<div>Loading...</div>}>
                <DevSupport ComponentPreviews={ComponentPreviews}
                            useInitialHook={useInitial}
                >
                    <App/>
                </DevSupport>
            </React.Suspense>
        </BrowserRouter>
    </React.StrictMode>,
)
