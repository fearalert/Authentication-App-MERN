import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const Auth = () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [IsLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  return IsLoggedIn ? <Outlet /> : <Navigate to="/" />
}

export default Auth