import { useRoutes } from "react-router-dom"
import routers from "./router/routerPage"
import {Provider} from 'react-redux'
import store from "./store"
function App() {
  const outlet = useRoutes(routers)
  return (
    <Provider store={store}>
   <div>
      {outlet}
   </div>
     </Provider>
    
  )
}

export default App
