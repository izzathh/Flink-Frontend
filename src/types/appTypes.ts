import * as Actions from "../constants";

export type SnackType = {
  isOpen: boolean;
  message: string;
};

export type AppState = {
  user: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  routes: Route[] | null;
};

type Route = {
  label: string;
  route: string;
};

export type LoginState = {
  message: string;
  token: string;
  admin: {
    email: string;
    _id: string;
    adminType: string;
    createdAdminId: string;
  };
  routes: Route[];
  tabIdentifier: string;
  commonData: {
    deliveryHours: {
      timeZone: string;
      timeZoneOffset: string;
      autoArchiveTime: {
        runCron: boolean
      }
    }
  };
  isCeo: string;
};

export type BrandItemType = {
  itemPhoto: string;
  itemUnitCoefficient: number;
  price: number;
  unit: string;
  _id: string;
};

export type ItemsType = {
  // _id: string;
  // itemCategory: string;
  // itemName: string;
  // isBrandOrQuality: boolean;
  // itemBrandOrQuality: BrandItemType[] | [];
  // itemPhoto: string;
  // price: number;
  // unit: string;
  // createdAt: Date;

  _id: string;
  itemCategory: {
    _id: string;
    categoryName: string;
    serialNumber: number;
    createdAt: Date;
  };
  itemName: string;
  isBrandOrQuality: boolean;
  itemBrandOrQuality: BrandItemType[] | [];
  createdAt: Date;
};

export type CategoryType = {
  _id: string;
  categoryName: string;
  serialNumber: number;
  items: ItemsType[];
};

export interface IItemBrandOrQuality {
  brandOrQualityName: string;
  itemPhoto: string;
  itemUnitCoefficient: number;
  price: number;
  unit: string;
}

export interface IItemsResponse {
  itemWrapperId: string;
  itemCategory: string;
  itemId: string;
  itemName: string;
  itemSerialNumber: number;
  lastItemSerialNumber: number;
  createdAt: Date;
  isBrandOrQuality: boolean;
  itemPhoto: string;
  itemUnitCoefficient: number;
  description: string;
  adminNote: string;
  buyingPrice: number;
  price: number;
  unit: string;
  minimumQuantity: string;
  acceptDecimal: boolean;
  brandOrQualityName?: string;
}

export interface ICategoryResponse {
  categoryName: string;
  _id: string;
  serialNumber: number;
  items: IItemsResponse[];
  currency: string;
}

export interface IEditItemProps {
  categoryName: string;
  _id: string;
  serialNumber: number;
  itemSerialNumber: number;
  lastItemSerialNumber: number;
  itemWrapperId: string;
  itemId: string;
  itemName: string;
  isBrandOrQuality: boolean;
  itemPhoto: string;
  itemUnitCoefficient: number;
  buyingPrice: number;
  description: string;
  adminNote: string;
  price: number;
  unit: string;
  minimumQuantity: string;
  acceptDecimal: boolean;
  brandOrQualityName?: string;
}

export interface IOrderedItems {
  brandOrQualityName?: string;
  categoryId: string;
  buyingPrice: string;
  currency: string;
  categoryName: string;
  createdAt: Date;
  isBrandOrQuality: boolean;
  itemId: string;
  itemName: string;
  itemPhoto: string;
  itemUnitCoefficient: number;
  itemWrapperId: string;
  minimumQuantity: string;
  price: number;
  quantity: number;
  totalPrice: number;
  unit: string;
}

export interface IOrderedUser {
  createdAt: Date;
  houseNumber: string;
  googleMapLocation: string;
  email: string;
  name: string;
  phoneNumber: string;
  streetAddress: string;
  userName: string;
  _id: string;
}

export interface IOrdersList {
  createdAt: Date;
  archivedAt: String;
  deliveryCharge: number;
  grandTotal: number;
  transactionId: string;
  orderNumber: 1;
  currency: string;
  user: IOrderedUser;
  archive: boolean;
  _id: string;
  items: IOrderedItems[];
}

export interface IArchivedOrdersList {
  _id: any;
  date: string;
  archive: boolean;
  // orderNumber: number;
  // createdAt: Date;
}
export interface IDeliveryHours {
  deliveryEndTime: Date;
  deliveryStartTime: Date;
  timeZone: string;
}

export interface ICommonFieldsResponse {
  commonFields: {
    createdAt: Date;
    currency: string;
    minOrderAmount: number;
    noticeText: string;
    updatedAt: Date;
    deliveryHours: IDeliveryHours;
    contactDetails: string;
    _id: string;
  };
  isDeliveryHours: boolean;
  startTime: string;
  endTime: string;
}

export type ActionsType =
  | { type: typeof Actions.LOGIN_USER; payload: LoginState }
  | { type: typeof Actions.LOAD_USER; payload: LoginState }
  | { type: typeof Actions.LOGOUT_USER; }
  | { type: typeof Actions.SHOW_LOADER; payload: boolean };
