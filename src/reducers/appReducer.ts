import * as Actions from "../constants";
import { ActionsType, AppState } from "../types/appTypes";

export const appReducer = (state: AppState, action: ActionsType): AppState => {

  switch (action.type) {
    case Actions.LOGIN_USER:
      const { payload } = action;
      const tabIdentifier = payload.tabIdentifier;
      // if (payload.isCeo && payload.admin.adminType === 'ceo') {
      //   sessionStorage.setItem(`token_${tabIdentifier}`, payload.token);
      //   sessionStorage.setItem("uniqueTabIdentifier", tabIdentifier);
      //   sessionStorage.setItem(`userAuthenticated_${tabIdentifier}`, JSON.parse("true"));
      //   sessionStorage.setItem(`adminType_${tabIdentifier}`, payload.admin.adminType);
      //   sessionStorage.setItem(`userId_${tabIdentifier}`, payload.admin._id);
      //   sessionStorage.setItem(`adminId_${tabIdentifier}`, payload.admin._id);
      // } else {
      localStorage.setItem(`token_${tabIdentifier}`, payload.token);
      localStorage.setItem("uniqueTabIdentifier", tabIdentifier);
      localStorage.setItem(`userAuthenticated_${tabIdentifier}`, JSON.parse("true"));
      localStorage.setItem(`adminType_${tabIdentifier}`, payload.admin.adminType);
      localStorage.setItem(`userId_${tabIdentifier}`, payload.admin._id);
      action.payload.admin.adminType !== "ceo"
        && action.payload.admin.adminType !== "sales"
        && action.payload.admin.adminType !== "printing"
        ? localStorage.setItem(`timezone_${tabIdentifier}`, payload.commonData.deliveryHours.timeZone)
        : localStorage.setItem(`timezone_${tabIdentifier}`, "");
      localStorage.setItem(
        `adminId_${tabIdentifier}`,
        action.payload.admin.adminType === "super" ||
          action.payload.admin.adminType === "ceo"
          ? action.payload.admin._id
          : action.payload.admin.createdAdminId
      );
      // }

      return {
        ...state,
        isAuthenticated: true,
        user: payload.admin,
        routes: payload.routes,
      };
    case Actions.LOAD_USER:
      const loadUserTabIdentifier = sessionStorage.getItem("uniqueTabIdentifier") || "";
      if (action.payload.isCeo !== '') {
        sessionStorage.setItem(`userAuthenticated`, JSON.parse("true"));
        sessionStorage.setItem(`adminType`, action.payload.admin.adminType);
        sessionStorage.setItem(`userId`, action.payload.admin._id);
        sessionStorage.setItem(`adminId`, action.payload.admin._id);
        sessionStorage.setItem(`timezone`, action.payload.commonData.deliveryHours.timeZone);
      } else {
        localStorage.setItem(`userAuthenticated_${loadUserTabIdentifier}`, JSON.parse("true"));
        localStorage.setItem(`adminType_${loadUserTabIdentifier}`, action.payload.admin.adminType);
        localStorage.setItem(`userId_${loadUserTabIdentifier}`, action.payload.admin._id);
        action.payload.admin.adminType !== "ceo"
          && action.payload.admin.adminType !== "sales"
          && action.payload.admin.adminType !== "printing"
          ? localStorage.setItem(`timezone_${loadUserTabIdentifier}`, action.payload.commonData.deliveryHours.timeZone)
          : localStorage.setItem(`timezone_${loadUserTabIdentifier}`, "");
        localStorage.setItem(
          `adminId_${loadUserTabIdentifier}`,
          action.payload.admin.adminType === "super" ||
            action.payload.admin.adminType === "ceo"
            ? action.payload.admin._id
            : action.payload.admin.createdAdminId
        );
      }
      return {
        ...state,
        user: action.payload.admin,
        isAuthenticated: true,
        routes: action.payload.routes,
      };

    case Actions.LOGOUT_USER:
      const logoutUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
      const checkEmptyStorage = localStorage.getItem("userAuthenticated_") || "";
      if (
        sessionStorage.getItem(`userAuthenticated`) &&
        localStorage.getItem(`adminType_${logoutUserTabIdentifier}`) === 'ceo'
      ) {
        sessionStorage.removeItem(`userAuthenticated`);
        sessionStorage.removeItem(`adminType`);
        sessionStorage.removeItem(`adminId`);
        sessionStorage.removeItem(`userId`);
        sessionStorage.removeItem(`timezone`);
      } else {
        // const logoutUserTabIdentifier = sessionStorage.getItem("uniqueTabIdentifier") || "";
        // sessionStorage.removeItem(`token_${logoutUserTabIdentifier}`);
        // sessionStorage.removeItem(`userAuthenticated_${logoutUserTabIdentifier}`);
        // sessionStorage.removeItem(`adminType_${logoutUserTabIdentifier}`);
        // sessionStorage.removeItem(`adminId_${logoutUserTabIdentifier}`);
        // sessionStorage.removeItem(`userId_${logoutUserTabIdentifier}`);
        // sessionStorage.removeItem("uniqueTabIdentifier");
        if (checkEmptyStorage !== "") {
          localStorage.removeItem(`token_`);
          localStorage.removeItem(`userAuthenticated_`);
          localStorage.removeItem(`adminType_`);
          localStorage.removeItem(`adminId_`);
          localStorage.removeItem(`userId_`);
          localStorage.removeItem(`timezone_`);
        }
        localStorage.removeItem(`token_${logoutUserTabIdentifier}`);
        localStorage.removeItem(`userAuthenticated_${logoutUserTabIdentifier}`);
        localStorage.removeItem(`adminType_${logoutUserTabIdentifier}`);
        localStorage.removeItem(`adminId_${logoutUserTabIdentifier}`);
        localStorage.removeItem(`userId_${logoutUserTabIdentifier}`);
        localStorage.removeItem(`timezone_${logoutUserTabIdentifier}`);
        localStorage.removeItem("uniqueTabIdentifier");
      }
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        routes: null,
      };
    case Actions.SHOW_LOADER:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};
