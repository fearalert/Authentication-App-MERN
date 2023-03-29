import ForgotPassword from "./Components/ForgotPassword/ForgotPassword"
import Home from "./Components/Home/Home"
import Login from "./Components/Login/Login"
import Signup from "./Components/Signup/Signup"

import {BrowserRouter as Router, Routes, Route} from "react-router-dom"


const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}/>
          <Route path="/home" element={<Home />}/>
          <Route path="/signup" element={<Signup />}/>
          <Route path="/forgot-password" element={<ForgotPassword />}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App