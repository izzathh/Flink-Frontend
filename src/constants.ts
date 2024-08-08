export const LOGIN_USER = "LOGIN_USER";
export const LOGOUT_USER = "LOGOUT_USER";
export const LOAD_USER = "LOAD_USER";
export const SHOW_LOADER = "SHOW_LOADER";

export const routesMappingData = [
  {
    label: "Home",
    route: "/",
  },
  {
    label: "Add Admins",
    route: "/add-admins",
  },
  {
    label: "Generate Users",
    route: "/generate-users",
  },
  {
    label: "List of Users",
    route: "/list-of-users",
  },
  {
    label: "List an Item",
    route: "/list-item",
  },
  {
    label: "Listed Items",
    route: "/listed-items",
  },
  {
    label: "Today's orders",
    route: "/get-todays-orders",
  },
  {
    label: "Today's ordered items",
    route: "/todays-ordered-items",
  },
  {
    label: "Archived ordered items",
    route: "/archived-ordered-items",
  },
  {
    label: "Archived orders",
    route: "/archived-orders",
  },
  {
    label: "Add/modify currency",
    route: "/change-currency",
  },
  {
    label: "Payment account",
    route: "/change-payment-account",
  },
  {
    label: "Delivery charge",
    route: "/add-delivery-charge"
  },
  {
    label: "Time zone",
    route: "/time-zone",
  },
  {
    label: "Minimum order amount for free delivery",
    route: "/add-minimum-order-amount",
  },
  {
    label: "Add contact info",
    route: "/add-contact-info",
  },
  {
    label: "Add notice text",
    route: "/add-notice-text",
  },
  {
    label: "Add branch boundary",
    route: "/add-branch-boundary",
  }
];

export const adminTypes = [
  { value: "printing", label: "document printing admin" },
  { value: "sales", label: "sales admin" },
];

export const ceoAdminTypes = [{ value: "super", label: "super admin" }];
