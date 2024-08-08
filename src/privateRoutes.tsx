import { Navigate, useLocation } from "react-router";
import { useAppData } from "./context/AppContext";

const checkAuthenticated = () => {
  const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
  const userAuthenticated = sessionStorage.getItem(`userAuthenticated_${loadUserTabIdentifier}`) ||
    localStorage.getItem(`userAuthenticated_${loadUserTabIdentifier}`);
  return Boolean(userAuthenticated);
};
export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { state } = useAppData();
  let location = useLocation();

  if (!checkAuthenticated() && !state.isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  return children;
};
