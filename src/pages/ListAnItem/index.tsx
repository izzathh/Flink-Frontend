import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
  TextareaAutosize,
} from "@mui/material";
import { ErrorMessage, FormikProps, useFormik } from "formik";
import {
  addItemSchema,
  addNewCategorySchema,
  addNewItemSchema,
} from "../../schema";
import axios from "axios";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";
import { useEffect, useRef, useState } from "react";
import { AddOutlined, EditOutlined } from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import BrandOrQuality from "../../components/ListItem/BrandOrQuality";
import { mediaUploadHandler } from "../../utils/mediaUpload";

type CategoryProps = {
  categoryName: string;
  _id?: string;
  inputValue?: string;
};

export type BrandOrQualityProps = {
  brandOrQualityName: string;
  buyingPrice: number;
  description: string;
  adminNote: string;
  price: number;
  unitCoefficient: number;
  unit: string;
  minimumQuantity: number;
  acceptDecimal: boolean;
  itemPhoto: File | null;
  photoPreview: string;
  index?: number;
};

export type ItemProps = {
  itemName: string;
  inputValue?: string;
  itemWrapperId?: string;
};

export interface InitialValues {
  itemCategory: { categoryName: string; _id: string };
  isBrandOrQuality: boolean;
  itemName: { itemWrapperId: string; itemName: string };
  description: string;
  adminNote: string;
  buyingPrice: number;
  itemPrice: number;
  itemUnit: string;
  acceptDecimal: boolean;
  minimumQuantity: string;
  itemUnitCoefficient: number;
  brandOrQuality: BrandOrQualityProps[] | [];
}

export const filter = createFilterOptions<any>();

function ListAnItem() {
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl, tabIdentifier } = useAppData();
  const [categories, setCategories] = useState<CategoryProps[]>([]);
  const [items, setItems] = useState<ItemProps[]>([]);
  const [open, toggleOpen] = useState(false);
  const [imgSrc, setImgSrc] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const inputFile = useRef<any | null>(null);
  const [newItemDialogOpen, toggleNewItemDialogOpen] = useState(false);
  const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
  const adminId = sessionStorage.getItem(`adminId`) ||
    localStorage.getItem(`adminId_${loadUserTabIdentifier}`);

  const formik = useFormik({
    initialValues: {
      itemCategory: { categoryName: "", _id: "" },
      isBrandOrQuality: false,
      itemName: { itemWrapperId: "", itemName: "" },
      description: "",
      buyingPrice: 1,
      itemPrice: 1,
      itemUnit: "",
      adminNote: "",
      minimumQuantity: "",
      acceptDecimal: false,
      itemUnitCoefficient: 1,
      brandOrQuality: [],
    },
    enableReinitialize: true,
    validationSchema: addItemSchema,
    onSubmit: async (values) => {
      try {
        if (values.isBrandOrQuality === false && !file) {
          return enqueueSnackbar("please upload an image for the item", {
            variant: "error",
          });
        }

        if (values.isBrandOrQuality === false && values.itemUnit === "") {
          return enqueueSnackbar("please enter a valid unit", {
            variant: "error",
          });
        }

        if (values.isBrandOrQuality && values.brandOrQuality.length < 2) {
          return enqueueSnackbar("please add atleast 2 brand/quality items", {
            variant: "error",
          });
        }

        if (
          values.isBrandOrQuality &&
          values.brandOrQuality.find((item: any) => item.itemPhoto === null)
        ) {
          return enqueueSnackbar(
            "please add the images for the brand/quality items",
            {
              variant: "error",
            }
          );
        }

        let formData = new FormData();
        if (file && values.isBrandOrQuality === false) {
          formData.append("itemPhoto", file);
          formData.append("itemCategory", values.itemCategory._id);
          formData.append("itemWrapperId", values.itemName.itemWrapperId);
          formData.append("itemName", values.itemName.itemName);
          formData.append(
            "isBrandOrQuality",
            JSON.stringify(values.isBrandOrQuality)
          );
          formData.append("itemBrandOrQuality", JSON.stringify({}));
          formData.append("description", JSON.stringify(values.description));
          formData.append("adminNote", JSON.stringify(values.adminNote));
          formData.append("buyingPrice", JSON.stringify(values.buyingPrice));
          formData.append("price", JSON.stringify(values.itemPrice));
          formData.append("unit", values.itemUnit);
          formData.append(
            "acceptDecimal",
            JSON.stringify(values.acceptDecimal)
          );
          formData.append(
            "itemUnitCoefficient",
            JSON.stringify(values.itemUnitCoefficient)
          );
          formData.append("minimumQuantity", values.minimumQuantity);
        } else {
          formData.append("itemWrapperId", values.itemName.itemWrapperId);
          formData.append("itemName", values.itemName.itemName);
          formData.append("itemCategory", values.itemCategory._id);
          formData.append(
            "isBrandOrQuality",
            JSON.stringify(values.isBrandOrQuality)
          );
          formData.append("minimumQuantity", values.minimumQuantity);
          for (const file of values.brandOrQuality) {
            formData.append("itemPhoto", (file as any).itemPhoto);
          }
          formData.append(
            "itemBrandOrQuality",
            JSON.stringify(values.brandOrQuality)
          );
        }

        if (values.isBrandOrQuality && values.brandOrQuality.length >= 2) {

          await axios({
            method: "POST",
            url: `${baseUrl}/items/admin/add-multiple-items`,
            data: formData,

            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem(`token_${loadUserTabIdentifier}`)}`,
              adminid: adminId || "",
            },
          });
        } else {
          console.log('formData:', formData);

          await axios({
            method: "POST",
            url: `${baseUrl}/items/admin/add-new-item`,
            data: formData,
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${localStorage.getItem(`token_${loadUserTabIdentifier}`)}`,
              adminid: adminId || "",
            }
          });
        }

        enqueueSnackbar("Item added successfully!", {
          variant: "success",
        });
        // formik.resetForm();
      } catch (error: any) {
        console.log(error);
        enqueueSnackbar(error.response.data.message || "an error occurred", {
          variant: "error",
        });
      }
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          `${baseUrl}/mappings/admin/categories`,
          TokenConfig(tabIdentifier)
        );
        setCategories(data.categories);
      } catch (error) {
        console.error(error);
      }
    })();
  }, [baseUrl]);

  useEffect(() => {
    (async () => {
      if (formik.values.itemCategory._id) {
        try {
          const { data } = await axios.get(
            `${baseUrl}/mappings/admin/items/${formik.values.itemCategory._id}`,
            TokenConfig(tabIdentifier)
          );
          setItems(data.items);
        } catch (error) {
          console.error(error);
        }
      }
    })();
  }, [baseUrl, formik.values.itemCategory._id]);

  const newCategoryFormik = useFormik({
    initialValues: {
      categoryName: "",
    },
    validationSchema: addNewCategorySchema,
    onSubmit: async (values) => {
      try {
        const { data } = await axios.post(
          `${baseUrl}/category/admin/add-new-category`,
          values,
          TokenConfig(tabIdentifier)
        );
        enqueueSnackbar("category added successfully!", {
          variant: "success",
        });

        formik.setFieldValue("itemCategory", {
          categoryName: data.category.categoryName,
          _id: data.category._id,
        });
        setCategories((prevCategories) => [
          ...prevCategories,
          { categoryName: data.category.categoryName, _id: data.category._id },
        ]);
        handleClose();
        newCategoryFormik.resetForm();
      } catch (error: any) {
        console.log(error);
        enqueueSnackbar(error.response.data.message || "an error occurred", {
          variant: "error",
        });
      }
    },
  });

  const newItemFormik = useFormik({
    initialValues: {
      itemName: "",
    },
    validationSchema: addNewItemSchema,
    onSubmit: async (values) => {
      console.log('into onsubmit');
      try {
        if (!formik.values.itemCategory._id) {
          enqueueSnackbar("please choose a category", { variant: "error" });
        }
        const { data } = await axios.post(
          `${baseUrl}/itemWrapper/admin/add-new-item-wrapper`,
          {
            itemName: values.itemName,
            categoryId: formik.values.itemCategory._id,
          },
          TokenConfig(tabIdentifier)
        );

        formik.setFieldValue("itemName", {
          itemName: values.itemName,
          itemWrapperId: data.itemWrapper._id,
        });
        setItems((prevItems: any) => [
          ...prevItems,
          { itemName: values.itemName, itemWrapperId: data.itemWrapper._id },
        ]);

        enqueueSnackbar("item added successfully!", {
          variant: "success",
        });

        handleNewItemDialogClose();
        newItemFormik.resetForm();
      } catch (error: any) {
        console.log(error);
        enqueueSnackbar(error.response.data.message || "an error occurred", {
          variant: "error",
        });
      }
    },
  });

  const handleNewItemDialogClose = () => {
    console.log('toggleNewItemDialogOpen');
    toggleNewItemDialogOpen(false);
    newItemFormik.setFieldValue("itemName", "");
  };

  const handleClose = () => {
    toggleOpen(false);
  };

  const onButtonClick = () => {
    inputFile?.current?.click();
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  };

  const formToRender = () => {
    if (!formik.values.isBrandOrQuality) {
      return (
        <>
          {/* For adding item name if the brand/quality is false */}
          <FormControl variant="standard" sx={{ width: "50%" }}>
            <Autocomplete
              value={formik.values.itemName.itemName}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  console.log('string');

                  // timeout to avoid instant validation of the dialog's form.
                  setTimeout(() => {
                    toggleNewItemDialogOpen(true);
                    formik.setFieldValue(`itemName`, newValue);
                    newItemFormik.setFieldValue("itemName", newValue);
                  });
                } else if (newValue && newValue.inputValue) {
                  console.log('new value');
                  toggleNewItemDialogOpen(true);

                  formik.setFieldValue(`itemName`, newValue.inputValue);
                  newItemFormik.setFieldValue("itemName", newValue?.inputValue);
                } else {
                  console.log('else');
                  formik.setFieldValue(`itemName`, {
                    itemName: newValue?.itemName || "",
                    itemWrapperId: newValue?.itemWrapperId || "",
                  });
                  newItemFormik.setFieldValue(
                    "itemName",
                    newValue?.itemName || ""
                  );
                }
              }}
              filterOptions={(options, params) => {
                const filtered = filter(options, params);

                if (params.inputValue !== "") {
                  filtered.push({
                    inputValue: params.inputValue,
                    itemName: `Add "${params.inputValue}"`,
                  });
                }

                return filtered;
              }}
              id="free-solo-dialog-demo"
              options={items}
              getOptionLabel={(option) => {
                // e.g value selected with enter, right from the input
                if (typeof option === "string") {
                  return option;
                }
                if (option.inputValue) {
                  return option.inputValue || "";
                }
                return option.itemName || "";
              }}
              selectOnFocus
              clearOnBlur={true}
              blurOnSelect={true}
              handleHomeEndKeys
              renderOption={(props, option) => (
                <li {...props}>{option.itemName}</li>
              )}
              sx={{ mb: 3 }}
              freeSolo
              renderInput={(params) => (
                <TextField
                  {...params}
                  required
                  label="choose an item"
                  error={
                    Boolean(formik.touched.itemName?.itemName) &&
                    Boolean(formik.errors.itemName?.itemName)
                  }
                  helperText={
                    Boolean(formik.touched.itemName?.itemName) && (
                      <>{formik.errors.itemName?.itemName}</>
                    )
                  }
                />
              )}
            />
          </FormControl>

          <FormControl required variant="standard" sx={{ width: "50%", mb: 3 }}>
            <FormLabel id="demo-radio-buttons-group-label">
              Has brand/quality ?
            </FormLabel>

            <RadioGroup
              aria-labelledby="demo-radio-buttons-group-label"
              defaultValue={false}
              name="isBrandOrQuality"
              value={formik.values.isBrandOrQuality}
              onChange={(e) => {
                formik.setFieldValue(
                  "isBrandOrQuality",
                  JSON.parse(e.target.value)
                );
                if (JSON.parse(e.target.value) === true) {
                  formik.setFieldValue(
                    "brandOrQuality",
                    (formik.values.brandOrQuality as any).concat(
                      {
                        brandOrQualityName: "",
                        buyingPrice: 1,
                        description: "",
                        adminNote: "",
                        price: 1,
                        unit: "",
                        minimumQuantity: "",
                        acceptDecimal: false,
                        unitCoefficient: 1,
                        itemPhoto: null,
                        photoPreview: "",
                        index: 1,
                      },
                      {
                        brandOrQualityName: "",
                        buyingPrice: 1,
                        description: "",
                        adminNote: "",
                        price: 1,
                        unit: "",
                        minimumQuantity: "",
                        acceptDecimal: false,
                        unitCoefficient: 1,
                        itemPhoto: null,
                        photoPreview: "",
                        index: 2,
                      }
                    )
                  );
                } else {
                  formik.setFieldValue("brandOrQuality", []);
                }
              }}
            >
              <FormControlLabel value={true} control={<Radio />} label="yes" />
              <FormControlLabel value={false} control={<Radio />} label="no" />
            </RadioGroup>
          </FormControl>

          <FormControl required variant="standard" sx={{ width: "50%", mb: 6 }}>
            <FormLabel id="upload-image">Upload Item Image</FormLabel>
            <Stack sx={{ position: "relative", mt: 2 }}>
              {imgSrc ? (
                <>
                  <Box
                    sx={{
                      position: "relative",
                      border: "0.5px solid rgba(0,0,0,0.25)",
                      py: 1,
                      px: 1,
                    }}
                  >
                    <img
                      src={imgSrc}
                      alt="item"
                      style={{
                        width: "100%",
                        height: 350,
                        objectFit: "contain",
                      }}
                    />

                    <IconButton
                      onClick={onButtonClick}
                      size="large"
                      sx={{
                        borderRadius: "100%",
                        position: "absolute",
                        right: 8,
                        backgroundColor: "rgba(255,255,255,0.8)",
                      }}
                    >
                      <EditOutlined fontSize="small" />
                    </IconButton>
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      name="image"
                      ref={inputFile}
                      accept="image/gif,image/jpeg,image/jpg,image/png"
                      multiple={false}
                      data-original-title="upload photos"
                      onChange={onSelectFile}
                    />
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    mt: 0,
                  }}
                >
                  <Stack
                    alignItems={"center"}
                    justifyContent="center"
                    sx={{
                      backgroundColor: "rgba(0,0,0,0.25)",
                      height: 350,
                      cursor: "pointer",
                    }}
                    onClick={onButtonClick}
                    onError={(e) => <ErrorMessage name="itemPhoto" />}
                  >
                    <IconButton
                      size="large"
                      sx={{
                        borderRadius: "100%",
                      }}
                    >
                      <AddOutlined fontSize="medium" />
                    </IconButton>
                    <Typography
                      variant="body2"
                      sx={{ wordBreak: "break-word" }}
                    >
                      upload
                    </Typography>
                    <input
                      type="file"
                      id="file"
                      style={{ display: "none" }}
                      name="image"
                      ref={inputFile}
                      accept="image/gif,image/jpeg,image/jpg,image/png"
                      multiple={false}
                      data-original-title="upload photos"
                      onChange={onSelectFile}
                    />
                  </Stack>
                </Box>
              )}
            </Stack>
          </FormControl>

          <FormControl variant="standard" sx={{ width: "50%" }}>
            <TextareaAutosize
              minRows={5}
              maxRows={10}
              placeholder="enter item description *"
              id="description"
              required
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              style={{
                width: "100%",
                resize: "none",
                padding: "8px",
                fontSize: "14px",
                marginBottom: "20px",
                borderRadius: "4px"
              }}
            />
            {formik.touched.description && Boolean(formik.errors.description) && (
              <TextField
                error
                helperText={formik.errors.description}
                variant="standard"
                sx={{ fontSize: "12px" }}
              />
            )}
          </FormControl>

          <FormControl variant="standard" sx={{ width: "50%" }}>
            <TextField
              variant="outlined"
              id="adminNote"
              name="adminNote"
              label="admin note"
              placeholder="enter admin note"
              InputProps={{
                inputProps: { maxLength: 21 },
              }}
              value={formik.values.adminNote}
              onChange={formik.handleChange}
              error={formik.touched.adminNote && Boolean(formik.errors.adminNote)}
              helperText={
                Boolean(formik.touched.adminNote) && (
                  <>{formik.errors.adminNote}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "50%" }}>
            <TextField
              variant="outlined"
              id="buyingPrice"
              required
              name="buyingPrice"
              label="buying price"
              type={"number"}
              placeholder="enter item buying price"
              value={formik.values.buyingPrice}
              onChange={formik.handleChange}
              error={
                formik.touched.buyingPrice && Boolean(formik.errors.buyingPrice)
              }
              helperText={
                Boolean(formik.touched.buyingPrice) && (
                  <>{formik.errors.buyingPrice}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "50%" }}>
            <TextField
              variant="outlined"
              id="itemPrice"
              required
              name="itemPrice"
              label="selling price"
              type={"number"}
              placeholder="enter selling price/unit"
              value={formik.values.itemPrice}
              onChange={formik.handleChange}
              error={
                formik.touched.itemPrice && Boolean(formik.errors.itemPrice)
              }
              helperText={
                Boolean(formik.touched.itemPrice) && (
                  <>{formik.errors.itemPrice}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "50%" }}>
            <TextField
              variant="outlined"
              id="itemUnitCoefficient"
              name="itemUnitCoefficient"
              label="item unit coefficient"
              type={"number"}
              required
              placeholder="enter item unit coefficient"
              value={formik.values.itemUnitCoefficient}
              onChange={formik.handleChange}
              error={
                formik.touched.itemUnitCoefficient &&
                Boolean(formik.errors.itemUnitCoefficient)
              }
              helperText={
                Boolean(formik.touched.itemUnitCoefficient) && (
                  <>{formik.errors.itemUnitCoefficient}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "50%" }}>
            <TextField
              variant="outlined"
              id="minimumQuantity"
              name="minimumQuantity"
              label="minimum quantity"
              type={"number"}
              required
              placeholder="enter minimum quantity"
              value={formik.values.minimumQuantity}
              onChange={formik.handleChange}
              error={
                formik.touched.minimumQuantity &&
                Boolean(formik.errors.minimumQuantity)
              }
              helperText={
                Boolean(formik.touched.minimumQuantity) && (
                  <>{formik.errors.minimumQuantity}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "50%" }}>
            <TextField
              variant="outlined"
              id="itemUnit"
              name="itemUnit"
              label="unit"
              required
              placeholder="enter unit"
              value={formik.values.itemUnit}
              onChange={formik.handleChange}
              error={formik.touched.itemUnit && Boolean(formik.errors.itemUnit)}
              helperText={
                Boolean(formik.touched.itemUnit) && (
                  <>{formik.errors.itemUnit}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "50%" }}>
            {/* <Checkbox
              id="itemUnit"
              name="itemUnit"
              label="Accept Decimal"
              required
              placeholder="enter unit"
              value={formik.values.itemUnit}
              onChange={formik.handleChange}
              error={formik.touched.itemUnit && Boolean(formik.errors.itemUnit)}
              helperText={
                Boolean(formik.touched.itemUnit) && (
                  <>{formik.errors.itemUnit}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            /> */}
            <FormControlLabel
              control={
                <Checkbox
                  checked={formik.values.acceptDecimal}
                  onChange={(_, checked) =>
                    formik.setFieldValue("acceptDecimal", checked)
                  }
                  name="acceptDecimal"
                  id="acceptDecimal"
                />
              }
              label="Accept Decimal"
            />
          </FormControl>
        </>
      );
    }

    if (formik.values.isBrandOrQuality) {
      return (
        <BrandOrQuality
          formik={formik as FormikProps<InitialValues>}
          items={items}
          setItems={setItems}
          newItemFormik={newItemFormik as FormikProps<{ itemName: string }>}
        />
      );
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ mt: 0.5, mb: formik.values.isBrandOrQuality ? 8 : 0 }}
    >
      <Stack
        alignItems={"center"}
        justifyContent="center"
        flexDirection={"column"}
        sx={{
          padding: "1rem",
          width: "100%",
        }}
      >
        <Typography variant="h6" textAlign={"center"} mb={2}>
          List an Item
        </Typography>
        <Stack alignItems={"center"} width="100%" mt={4}>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
            encType="multipart/form-data"
          >
            {/* For Choosing categoryName */}
            <FormControl variant="standard" sx={{ width: "50%" }}>
              <Autocomplete
                value={formik.values.itemCategory.categoryName}
                onChange={(event, newValue) => {
                  if (typeof newValue === "string") {
                    // timeout to avoid instant validation of the dialog's form.
                    setTimeout(() => {
                      toggleOpen(true);
                      newCategoryFormik.setFieldValue("categoryName", newValue);
                    });
                  } else if (newValue && newValue.inputValue) {
                    toggleOpen(true);

                    newCategoryFormik.setFieldValue(
                      "categoryName",
                      newValue.inputValue || ""
                    );
                  } else {
                    formik.setFieldValue("itemCategory", {
                      categoryName: newValue?.categoryName || "",
                      _id: newValue?._id || "",
                    });
                  }
                }}
                filterOptions={(options, params) => {
                  const filtered = filter(options, params);

                  if (params.inputValue !== "") {
                    filtered.push({
                      inputValue: params.inputValue,
                      categoryName: `Add "${params.inputValue}"`,
                    });
                  }

                  return filtered;
                }}
                id="free-solo-dialog-demo"
                options={categories}
                getOptionLabel={(option) => {
                  // e.g value selected with enter, right from the input
                  if (typeof option === "string") {
                    return option;
                  }
                  if (option.inputValue) {
                    return option.inputValue || "";
                  }
                  return option.categoryName || "";
                }}
                clearOnBlur
                handleHomeEndKeys
                renderOption={(props, option) => (
                  <li {...props}>{option.categoryName}</li>
                )}
                sx={{ mb: 3 }}
                freeSolo
                renderInput={(params) => (
                  <TextField
                    {...params}
                    required
                    label="choose a category"
                    error={
                      formik.touched.itemCategory?.categoryName &&
                      Boolean(formik.errors.itemCategory?.categoryName)
                    }
                    helperText={
                      Boolean(formik.touched.itemCategory?.categoryName) && (
                        <>{formik.errors.itemCategory?.categoryName}</>
                      )
                    }
                  />
                )}
              />
            </FormControl>

            {formToRender()}

            {formik.values.isBrandOrQuality ? (
              <Box
                sx={{
                  position: "fixed",
                  bottom: 0,
                  width: "100%",
                  py: 0,
                  backgroundColor: "#fff",
                  display: "flex",
                  justifyContent: "center",
                  boxShadow: "0 0 8px rgba(0,0,0,0.25)",
                  zIndex: 5,
                  borderRadius: "10px",
                }}
              >
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formik.isSubmitting}
                  startIcon={
                    formik.isSubmitting ? (
                      <CircularProgress
                        sx={{
                          color: "#fff",
                        }}
                        size={20}
                      />
                    ) : null
                  }
                  sx={{ mt: 4, mb: 4, fontWeight: 600 }}
                >
                  List item
                </Button>
              </Box>
            ) : (
              <Button
                variant="contained"
                type="submit"
                disabled={formik.isSubmitting}
                startIcon={
                  formik.isSubmitting ? (
                    <CircularProgress
                      sx={{
                        color: "#fff",
                      }}
                      size={20}
                    />
                  ) : null
                }
                sx={{ mt: 4, mb: 4 }}
              >
                List item
              </Button>
            )}
          </form>

          {/* Dialog for adding new category */}
          <Dialog open={open} onClose={handleClose} fullWidth>
            <form onSubmit={newCategoryFormik.handleSubmit}>
              <DialogTitle>Add a new category</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  fullWidth
                  id="categoryName"
                  value={newCategoryFormik.values.categoryName}
                  onChange={newCategoryFormik.handleChange}
                  label="category name"
                  type="text"
                  variant="outlined"
                  error={
                    newCategoryFormik.touched.categoryName &&
                    Boolean(newCategoryFormik.errors.categoryName)
                  }
                  helperText={
                    Boolean(newCategoryFormik.touched.categoryName) && (
                      <>{newCategoryFormik.errors.categoryName}</>
                    )
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <LoadingButton
                  type="submit"
                  loading={newCategoryFormik.isSubmitting}
                >
                  Add category
                </LoadingButton>
              </DialogActions>
            </form>
          </Dialog>

          {/* Dialog for adding new item */}
          <Dialog
            open={newItemDialogOpen}
            onClose={handleNewItemDialogClose}
            fullWidth
          >
            <form onSubmit={newItemFormik.handleSubmit}>
              <DialogTitle>Add a new item</DialogTitle>
              <DialogContent>
                <TextField
                  autoFocus
                  margin="dense"
                  fullWidth
                  id="itemName"
                  value={newItemFormik.values.itemName}
                  onChange={newItemFormik.handleChange}
                  label="item name"
                  type="text"
                  variant="outlined"
                  error={
                    newItemFormik.touched.itemName &&
                    Boolean(newItemFormik.errors.itemName)
                  }
                  helperText={
                    Boolean(newItemFormik.touched.itemName) && (
                      <>{newItemFormik.errors.itemName}</>
                    )
                  }
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleNewItemDialogClose}>Cancel</Button>
                <LoadingButton
                  type="submit"
                  loading={newItemFormik.isSubmitting}
                >
                  Add item
                </LoadingButton>
              </DialogActions>
            </form>
          </Dialog>
        </Stack>
      </Stack>
    </Container>
  );
}

export default ListAnItem;
