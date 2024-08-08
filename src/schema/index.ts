import * as Yup from "yup";

export const changePasswordSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .max(25, 'Password can contain upto 25 characters'),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords does not match')
    .required('Please re-enter your new password'),
});

export const addDeliveryChargeSchema = Yup.object().shape({
  deliveryCharge: Yup.number()
    .label("deliveryCharge")
    .required("please enter the delivery charge")
    .positive()
});

export const generateUserSchema = Yup.object().shape({
  email: Yup.string().label("email").required("please enter a valid email"),
  name: Yup.string().label("name").required("please enter the name"),
  password: Yup.string()
    .label("password")
    .max(25, 'Password can contain upto 25 characters')
    .required("please enter the password"),
  branchCode: Yup.string()
    .label("branchCode"),
  googleMapLocation: Yup.string()
    .label("googleMapLocation"),
  houseNumber: Yup.string().label("houseNumber"),
  streetAddress: Yup.string()
    .label("streetAddress")
    .required("please enter Street Address"),
  phoneNumber: Yup.string()
    .label("phoneNumber")
    .required("please enter Phone Number"),
  max_daily_order: Yup.string()
    .label("max_daily_order")
    .matches(/^(?!0+$)\d+$/, 'Only numbers, non decimal values and positive numbers are allowed')
});

export const resetPasswordSchema = Yup.object().shape({
  otp: Yup.string().label("otp").required("please enter a valid otp"),
  password: Yup.string()
    .label("password")
    .required("please enter a valid password")
    .max(25, 'Password can contain upto 25 characters'),
});

export const addAdminsCeoSchema = Yup.object().shape({
  email: Yup.string().label("email").required("please enter a valid email"),
  branchName: Yup.string().label("branchName").required("please enter a branch name"),
  branchCode: Yup.string()
    .label("branchCode")
    .required("please enter a branch code")
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]*$/, 'Branch code must contain alphabets & numbers'),
  password: Yup.string()
    .label("password")
    .max(25, 'Password can contain upto 25 characters')
    .required("please enter a valid password"),
  adminType: Yup.string()
    .label("adminType")
    .required("please choose a valid admin type"),
});

export const addAdminsSchema = Yup.object().shape({
  email: Yup.string().label("email").required("please enter a valid email"),
  password: Yup.string()
    .label("password")
    .max(25, 'Password can contain upto 25 characters')
    .required("please enter a valid password"),
  adminType: Yup.string()
    .label("adminType")
    .required("please choose a valid admin type"),
});

export const editAdminsSchema = Yup.object().shape({
  email: Yup.string().label("email").required("please enter a valid email"),
  adminType: Yup.string()
    .label("adminType")
    .required("please choose a valid admin type"),
});

export const editSuperAdminsSchema = Yup.object().shape({
  email: Yup.string().label("email").required("please enter a valid email"),
  branchName: Yup.string().label("branchName").required("please enter a branch name"),
  branchCode: Yup.string()
    .label("branchCode")
    .required("please enter a branch code")
    .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z0-9]*$/, 'Branch code must contain alphabets & numbers'),
  password: Yup.string()
    .label("password")
    .max(25, 'Password can contain upto 25 characters')
    .required("please enter a valid password"),
});

export const addCurrencySchema = Yup.object().shape({
  currency: Yup.string()
    .required("please enter a valid currency")
    .label("currency")
    .min(1)
    .max(3),
});

export const addAccountNumberSchema = Yup.object().shape({
  accountNumber: Yup.string()
    .label("account number")
    .transform((value, originalValue) => {
      return /^\s*$/.test(originalValue) ? undefined : value;
    })
    .nullable()
});

export const minimumOrderAmountSchema = Yup.object().shape({
  minimumOrderAmount: Yup.number()
    .label("minimumOrderAmount")
    .positive(),
});

export const addContactDetailsSchema = Yup.object().shape({
  contactText: Yup.string()
    .required("contact details cannot be empty")
    .label("contactText"),
  addressText: Yup.string()
    .required("address text cannot be empty")
    .label("addressText"),
  copyrightText: Yup.string()
    .required("copyright text cannot be empty")
    .label("copyrightText"),
});

export const addNoticeTextSchema = Yup.object().shape({
  noticeText: Yup.string()
    .required("notice text cannot be empty")
    .label("noticeText"),
});

// export const addDeliveryHoursSchema = Yup.object().shape({
//   deliveryStartTime: Yup.date().required(
//     "please enter a valid delivery start time"
//   ),
//   deliveryEndTime: Yup.date().required(
//     "please enter a valid delivery end time"
//   ),
// });

export const addItemSchema = Yup.object().shape({
  itemCategory: Yup.object()
    .shape({
      categoryName: Yup.string().required("please choose a category"),
      _id: Yup.string(),
    })
    .required("please choose a category name"),
  isBrandOrQuality: Yup.boolean()
    .required("please choose brand/quality radio boxes")
    .default(false),
  itemName: Yup.object()
    .shape({
      itemName: Yup.string().required("please choose an item"),
      itemWrapperId: Yup.string(),
    })
    .required("please choose an item"),
  buyingPrice: Yup.number()
    .default(1)
    .positive("buying price must be a positive number")
    .required("please enter a valid number"),
  itemPrice: Yup.number().default(1).positive("selling price must be a positive number"),
  itemUnit: Yup.string(),
  acceptDecimal: Yup.boolean(),
  itemUnitCoefficient: Yup.number().default(1).positive(),
  brandOrQuality: Yup.array().of(
    Yup.object().shape({
      brandOrQualityName: Yup.string().required(
        "please enter a vaild brand/quality name"
      ),
      price: Yup.number()
        .default(1)
        .positive()
        .required("please enter item price"),
      unit: Yup.string().required("please enter item unit"),
      unitCoefficient: Yup.number()
        .positive()
        .required("please enter a valid unit coefficient"),
    })
  ),
});

export const addNewCategorySchema = Yup.object().shape({
  categoryName: Yup.string().required("category name cannot be empty"),
});

export const addNewItemSchema = Yup.object().shape({
  itemName: Yup.string().required("item name cannot be empty"),
});

export const editListedItemSchema = Yup.object().shape({
  categoryName: Yup.string().required("category name cannot be empty"),
  serialNumber: Yup.number()
    .positive()
    .typeError("serial number should be a postive number")
    .required("serial number cannot be empty"),
  itemSerialNumber: Yup.number()
    .positive()
    .typeError("item serial number should be a postive number")
    .required("item serial number cannot be empty"),
  itemName: Yup.string().required("item name cannot be empty"),
  itemPhoto: Yup.string().required("please upload an item photo"),
  itemUnitCoefficient: Yup.number()
    .positive()
    .typeError("unit Coefficient should be a positive number")
    .required("please enter unit coefficient"),
  price: Yup.number()
    .positive()
    .typeError("price should be a postive number")
    .required("price cannot be empty"),
  unit: Yup.string().required("unit cannot be empty"),
  brandOrQualityName: Yup.string(),
});
