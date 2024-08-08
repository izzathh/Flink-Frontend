import { LoadingButton } from "@mui/lab";
import {
  Box,
  Button,
  Checkbox,
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
  TextField,
  Typography,
  TextareaAutosize,
  InputLabel,
} from "@mui/material";
import { Stack } from "@mui/system";
import { ErrorMessage, useFormik } from "formik";
import React, { useRef, useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import axios from "axios";
import { useSnackbar } from "notistack";
import { editListedItemSchema } from "../../schema";
import { AddOutlined, EditOutlined } from "@mui/icons-material";

type EditListedItemDialogPropsType = {
  open: boolean;
  handleClose: () => void;
  categoryName: string;
  _id: string;
  serialNumber: number;
  itemSerialNumber: number,
  itemWrapperId: string;
  itemId: string;
  itemName: string;
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
  lastSerialNumber: number;
  lastItemSerialNumber: number;
  getListedItems: () => Promise<void>;
};

function EditListedItemDialog({
  open,
  handleClose,
  categoryName,
  _id,
  serialNumber,
  itemSerialNumber,
  itemWrapperId,
  itemId,
  itemName,
  isBrandOrQuality,
  itemPhoto,
  itemUnitCoefficient,
  buyingPrice,
  description,
  adminNote,
  price,
  unit,
  minimumQuantity,
  acceptDecimal,
  brandOrQualityName,
  lastSerialNumber,
  lastItemSerialNumber,
  getListedItems,
}: EditListedItemDialogPropsType) {
  const [imgSrc, setImgSrc] = useState(itemPhoto);
  const [file, setFile] = useState<File | null>(null);
  const inputFile = useRef<any | null>(null);
  const { baseUrl, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      categoryName: categoryName,
      serialNumber: serialNumber,
      itemSerialNumber: itemSerialNumber,
      itemName: itemName,
      itemPhoto: imgSrc,
      itemUnitCoefficient: itemUnitCoefficient,
      buyingPrice: buyingPrice,
      description: description,
      adminNote: adminNote,
      minimumQuantity: minimumQuantity,
      price: price,
      unit: unit,
      acceptDecimal: acceptDecimal || false,
      brandOrQualityName: brandOrQualityName || "",
    },
    enableReinitialize: true,
    validationSchema: editListedItemSchema,
    onSubmit: async (values) => {
      try {
        console.log('lastSerialNumber:', lastSerialNumber);

        if (values.serialNumber > lastSerialNumber) {
          return enqueueSnackbar(
            "You can't enter a serial number which is more than the last serial number",
            { variant: "error", autoHideDuration: 7000 }
          );
        }

        console.log('lastItemSerialNumber:', lastItemSerialNumber);

        if (values.itemSerialNumber > lastItemSerialNumber) {
          return enqueueSnackbar(
            "You can't enter a item serial number which is more than the last item serial number",
            { variant: "error", autoHideDuration: 7000 }
          );
        }


        let formData = new FormData();

        formData.append("categoryId", _id);
        formData.append("categoryName", values.categoryName);
        formData.append("serialNumber", JSON.stringify(values.serialNumber));
        formData.append("itemSerialNumber", JSON.stringify(values.itemSerialNumber));
        formData.append("itemWrapperId", itemWrapperId);
        formData.append("itemId", itemId);
        formData.append("itemName", values.itemName);
        formData.append("buyingPrice", JSON.stringify(values.buyingPrice));
        formData.append("description", JSON.stringify(values.description));
        formData.append("adminNote", JSON.stringify(values.adminNote));
        formData.append("price", JSON.stringify(values.price));
        formData.append("unit", values.unit);
        formData.append("acceptDecimal", JSON.stringify(values.acceptDecimal));
        formData.append("minimumQuantity", values.minimumQuantity);
        formData.append(
          "itemUnitCoefficient",
          JSON.stringify(values.itemUnitCoefficient)
        );
        formData.append("brandOrQualityName", values.brandOrQualityName);

        if (file) {
          formData.append("itemPhoto", file);
          const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
          await axios({
            method: "POST",
            url: `${baseUrl}/items/admin/edit-item-with-image`,
            data: formData,
            headers: {
              Authorization: `Bearer ${localStorage.getItem(`token_${loadUserTabIdentifier}`)}`,
            },
          });
        } else {
          const requestBody = {
            itemPhoto: values.itemPhoto,
            categoryId: _id,
            categoryName: values.categoryName,
            serialNumber: values.serialNumber,
            itemSerialNumber: values.itemSerialNumber,
            itemWrapperId: itemWrapperId,
            itemId: itemId,
            itemName: values.itemName,
            buyingPrice: values.buyingPrice,
            description: values.description,
            adminNote: values.adminNote,
            price: values.price,
            unit: values.unit,
            acceptDecimal: values.acceptDecimal || false,
            itemUnitCoefficient: values.itemUnitCoefficient,
            minimumQuantity: values.minimumQuantity,
            brandOrQualityName: values.brandOrQualityName,
          };
          await axios.post(
            `${baseUrl}/items/admin/edit-item`,
            requestBody,
            TokenConfig(tabIdentifier)
          );
        }

        enqueueSnackbar("Item edited successfully!", {
          variant: "success",
        });
        await getListedItems();
        formik.resetForm();
        handleClose();
      } catch (error: any) {
        console.error(error);
        enqueueSnackbar(error.response.data.message || "an error occurred", {
          variant: "error",
        });
      }
    },
  });

  const onButtonClick = () => {
    inputFile?.current?.click();
  };

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImgSrc(URL.createObjectURL(e.target.files[0]));
      setFile(e.target.files[0]);
    }
  };

  return (
    <Dialog open={open} fullWidth onClose={handleClose} scroll="body">
      <DialogTitle>Edit Item</DialogTitle>
      <DialogContent>
        <form
          onSubmit={formik.handleSubmit}
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginTop: "1rem",
          }}
        >
          <FormControl variant="standard">
            <TextField
              variant="outlined"
              id="categoryName"
              name="categoryName"
              label="category name"
              placeholder="enter category name"
              value={formik.values.categoryName}
              onChange={formik.handleChange}
              autoFocus
              error={
                formik.touched.categoryName &&
                Boolean(formik.errors.categoryName)
              }
              helperText={
                Boolean(formik.touched.categoryName) && (
                  <>{formik.errors.categoryName}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              variant="outlined"
              id="serialNumber"
              name="serialNumber"
              label="category serial number"
              type={"number"}
              placeholder="enter serial number"
              value={formik.values.serialNumber}
              onChange={formik.handleChange}
              autoFocus
              error={
                formik.touched.serialNumber &&
                Boolean(formik.errors.serialNumber)
              }
              helperText={
                Boolean(formik.touched.serialNumber) && (
                  <>{formik.errors.serialNumber}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              variant="outlined"
              id="itemSerialNumber"
              name="itemSerialNumber"
              label="item serial number"
              type={"number"}
              placeholder="enter item serial number"
              value={formik.values.itemSerialNumber}
              onChange={formik.handleChange}
              autoFocus
              error={
                formik.touched.itemSerialNumber &&
                Boolean(formik.errors.itemSerialNumber)
              }
              helperText={
                Boolean(formik.touched.itemSerialNumber) && (
                  <>{formik.errors.itemSerialNumber}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              variant="outlined"
              id="itemName"
              name="itemName"
              label="item name"
              placeholder="enter item name"
              value={formik.values.itemName}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.itemName && Boolean(formik.errors.itemName)}
              helperText={
                Boolean(formik.touched.itemName) && (
                  <>{formik.errors.itemName}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          {brandOrQualityName && brandOrQualityName?.length > 0 && (
            <FormControl variant="standard">
              <TextField
                variant="outlined"
                id="brandOrQualityName"
                name="brandOrQualityName"
                label="brand/quality name"
                placeholder="enter brand/quality name"
                value={formik.values.brandOrQualityName}
                onChange={formik.handleChange}
                autoFocus
                error={
                  formik.touched.brandOrQualityName &&
                  Boolean(formik.errors.brandOrQualityName)
                }
                helperText={
                  Boolean(formik.touched.brandOrQualityName) && (
                    <>{formik.errors.brandOrQualityName}</>
                  )
                }
                sx={{ mb: 3 }}
                size="medium"
              />
            </FormControl>
          )}

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

          {formik.values.description.length !== 0 && (
            <InputLabel htmlFor="description">Item Description *</InputLabel>
          )}
          <FormControl variant="standard">
            <TextareaAutosize
              minRows={5}
              maxRows={10}
              id="description"
              name="description"
              placeholder="enter item description *"
              required
              value={formik.values.description}
              onChange={formik.handleChange}
              autoFocus
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

          <FormControl variant="standard">
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
              autoFocus
              error={formik.touched.adminNote && Boolean(formik.errors.adminNote)}
              helperText={
                Boolean(formik.touched.adminNote) && <>{formik.errors.adminNote}</>
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              variant="outlined"
              id="buyingPrice"
              name="buyingPrice"
              label="Buying price"
              type={"number"}
              placeholder="enter buying price"
              value={formik.values.buyingPrice}
              onChange={formik.handleChange}
              autoFocus
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

          <FormControl variant="standard">
            <TextField
              variant="outlined"
              id="price"
              name="price"
              label="selling price"
              type={"number"}
              placeholder="enter selling price"
              value={formik.values.price}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={
                Boolean(formik.touched.price) && <>{formik.errors.price}</>
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard">
            <TextField
              variant="outlined"
              id="itemUnitCoefficient"
              name="itemUnitCoefficient"
              label="unit coeffiecient"
              placeholder="enter item unit coefficient"
              value={formik.values.itemUnitCoefficient}
              onChange={formik.handleChange}
              autoFocus
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

          <FormControl variant="standard">
            <TextField
              variant="outlined"
              id="unit"
              name="unit"
              label="unit"
              placeholder="enter unit"
              value={formik.values.unit}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.unit && Boolean(formik.errors.unit)}
              helperText={
                Boolean(formik.touched.unit) && <>{formik.errors.unit}</>
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

          <FormControl variant="standard">
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

          <DialogActions sx={{ width: "100%" }}>
            <Stack
              direction="row"
              justifyContent={"end"}
              spacing={8}
              width="100%"
            >
              <Button
                onClick={handleClose}
                variant="contained"
                color="secondary"
              >
                cancel
              </Button>
              <LoadingButton
                variant="contained"
                type="submit"
                loading={formik.isSubmitting}
              >
                update
              </LoadingButton>
            </Stack>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EditListedItemDialog;
