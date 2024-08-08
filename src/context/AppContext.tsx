import axios from "axios";
import { useSnackbar } from "notistack";
import { createContext, useCallback, useContext, useReducer, useState } from "react";
import { useNavigate } from "react-router";
import * as Actions from "../constants";
import { appReducer } from "../reducers/appReducer";
import { AppState } from "../types/appTypes";
import { useLocation } from "react-router-dom";

const { REACT_APP_BACKEND_URL } = process.env;
console.log("REACT_APP_BACKEND_URL-2 :>> ", REACT_APP_BACKEND_URL);

export const TokenConfig = (tabIdentifier: string) => {
  const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";

  const token = localStorage.getItem(`token_${loadUserTabIdentifier}`);
  const adminId = sessionStorage.getItem(`adminId`) ||
    localStorage.getItem(`adminId_${loadUserTabIdentifier}`);

  //Headers
  const config = {
    headers: {
      "Content-type": "application/json",
      Authorization: "",
      adminid: "",
    },
  };

  //If token add to headers
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  if (adminId && adminId.length > 0) {
    config.headers["adminid"] = adminId;
  }

  return config;
};

export const baseUrl = REACT_APP_BACKEND_URL || "";

export const initialState: AppState = {
  isAuthenticated: false,
  user: null,
  isLoading: false,
  routes: null,
};

export type ContextValuesType = {
  state: AppState;
  dispatch: React.Dispatch<any>;
  loginUser: (email: string, password: string, isCeo: boolean) => any;
  loadUser: () => any;
  baseUrl: string;
  tabIdentifier: string;
};

export const AppContext = createContext<ContextValuesType>({
  state: initialState,
  dispatch: () => null,
  loginUser: () => null,
  loadUser: () => null,
  baseUrl: "",
  tabIdentifier: "",
});

function AppContextProvider({ children }: any) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [tabIdentifier, setTabIdentifier] = useState("");
  const location = useLocation();

  const loginUser = async (email: string, password: string, isCeo: boolean) => {

    const generateUniqueTabIdentifier = () => {
      return Date.now().toString();
    };

    try {
      const { data } = await axios.post(
        `${REACT_APP_BACKEND_URL}/admin-actions/login`,
        {
          email,
          password,
          isCeo
        }
      );
      const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
      const newTabIdentifier = generateUniqueTabIdentifier();

      if (loadUserTabIdentifier !== "") {
        enqueueSnackbar("You are logged in!", { variant: "success" });
        if (isCeo) {
          const adminId =
            data.admin.adminType === "super" || data.admin.adminType === "ceo"
              ? data.admin._id
              : data.admin.createdAdminId;
          const newTab = window.open(`${window.location.origin}/?tab=${newTabIdentifier}?adminId=${adminId}?${isCeo}`);
          if (newTab) {
            newTab.focus();
          }
        } else {
          navigate("/", { replace: true });
        }
      } else {
        setTabIdentifier(newTabIdentifier);
        dispatch({ type: Actions.LOGIN_USER, payload: { ...data, tabIdentifier: newTabIdentifier } });
        enqueueSnackbar("You are logged in!", { variant: "success" });
        if (isCeo) {
          const adminId =
            data.admin.adminType === "super" || data.admin.adminType === "ceo"
              ? data.admin._id
              : data.admin.createdAdminId;
          const newTab = window.open(`${window.location.origin}/?tab=${newTabIdentifier}?adminId=${adminId}?${isCeo}`);
          if (newTab) {
            newTab.focus();
          }
        } else {
          navigate("/", { replace: true });
        }
      }
    } catch (error: any) {
      console.error({ error });
      enqueueSnackbar(error.response.data.message || "an error occurred", {
        variant: "error",
      });
    }
  };

  const loadUser = useCallback(async () => {
    try {
      let loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
      const searchParams = new URLSearchParams(location.search);
      const tabValue = searchParams.get("tab");
      const adminType = await localStorage.getItem(`adminType_${loadUserTabIdentifier}`);

      let adminId =
        adminType === "super" || adminType === "ceo"
          ? await localStorage.getItem(`adminId_${loadUserTabIdentifier}`)
          : await localStorage.getItem(`userId_${loadUserTabIdentifier}`);
      dispatch({ type: Actions.SHOW_LOADER, payload: true });
      let isCeo = '';
      if (tabValue !== null) {
        const adminIdValue = tabValue.split('=')[1].split('?')[0]
        const tabIdentifierValue = tabValue.split('?')[0]
        isCeo = tabValue.split('?')[2]
        loadUserTabIdentifier = tabIdentifierValue
        adminId = adminIdValue
      }

      const { data } = await axios.post(
        `${REACT_APP_BACKEND_URL}/admin-actions/init`,
        { id: sessionStorage.getItem(`adminId`) || adminId },
        TokenConfig(loadUserTabIdentifier)
      );
      dispatch({ type: Actions.LOAD_USER, payload: { ...data, tabIdentifier: loadUserTabIdentifier, isCeo: isCeo !== '' ? isCeo : '' } });
      dispatch({ type: Actions.SHOW_LOADER, payload: false });
    } catch (error: any) {
      console.error({ error });
      dispatch({ type: Actions.SHOW_LOADER, payload: false });
      if (error?.response?.status && error?.response?.status === 401) {
        navigate("/login", { replace: true });
        localStorage.removeItem("token");
        localStorage.removeItem("userAuthenticated");
        localStorage.removeItem("adminType");
      }
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        loginUser,
        loadUser,
        baseUrl: REACT_APP_BACKEND_URL || "",
        tabIdentifier,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export const useAppData = () => {
  return useContext(AppContext);
};

export default AppContextProvider;
