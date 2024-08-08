import {
  Add,
  AddOutlined,
  CloseOutlined,
  EditOutlined,
} from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Button,
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
  TextareaAutosize,
  Checkbox
} from "@mui/material";
import { FieldArray, FormikProps, FormikProvider, getIn } from "formik";
import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import {
  BrandOrQualityProps,
  InitialValues,
  ItemProps,
  filter,
} from "../../pages/ListAnItem";
import { LoadingButton } from "@mui/lab";
import { useConfirm } from "material-ui-confirm";

function BrandOrQuality({
  formik,
  items,
  setItems,
  newItemFormik,
}: {
  formik: FormikProps<InitialValues>;
  items: ItemProps[];
  setItems: Dispatch<SetStateAction<any>>;
  newItemFormik: FormikProps<{ itemName: string }>;
}) {
  const [open, toggleOpen] = useState(false);
  const selectedIndexRef = useRef<any>([]);
  const confirm = useConfirm();
  const inputFile = useRef<any | null>(null);

  const handleClose = () => {
    console.log('toggleOpen');
    toggleOpen(false);
    newItemFormik.setFieldValue("itemName", "");
  };

  const onButtonClick = (e: any, index: any) => {
    // setSelectedIndex(index);
    selectedIndexRef.current = [...selectedIndexRef.current, index];
    inputFile?.current?.click();
  };

  const onSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    eachbrandOrQuality: BrandOrQualityProps,
    index: number
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      formik.setFieldValue(
        `brandOrQuality.${selectedIndexRef.current[0]}.itemPhoto`,
        e.target.files[0]
      );
      formik.setFieldValue(
        `brandOrQuality.${selectedIndexRef.current[0]}.photoPreview`,
        URL.createObjectURL(e?.target?.files![0])
      );
      selectedIndexRef.current = [];
      // e.stopPropagation();
      // e.preventDefault();
    } else {
      selectedIndexRef.current = [];
    }
  };


  return (
    <Stack width={"100%"}>
      <FormikProvider value={formik}>
        <Stack
          direction={"column"}
          alignItems="center"
          sx={{ width: "100%" }}
          mb={4}
        >
          <FormControl required variant="standard" sx={{ width: "50%" }}>
            <Autocomplete
              value={formik.values.itemName.itemName}
              onChange={(event, newValue) => {
                if (typeof newValue === "string") {
                  // timeout to avoid instant validation of the dialog's form.
                  setTimeout(() => {
                    toggleOpen(true);
                    formik.setFieldValue(`itemName`, newValue);
                    newItemFormik.setFieldValue("itemName", newValue);
                  });
                } else if (newValue && newValue.inputValue) {
                  toggleOpen(true);

                  formik.setFieldValue(`itemName`, newValue.inputValue);
                  newItemFormik.setFieldValue("itemName", newValue?.inputValue);
                } else {
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
        </Stack>

        <Stack
          direction={"column"}
          alignItems="center"
          sx={{ width: "100%" }}
          mb={4}
        >
          <FormControl required variant="standard" sx={{ width: "50%", mb: 1 }}>
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
                        price: 1,
                        unit: "",
                        description: "",
                        adminNote: "",
                        minimumQuantity: "",
                        acceptDecimal: false,
                        unitCoefficient: 1,
                        itemPhoto: null,
                        photoPreview: "",
                        index: 1,
                      },
                      {
                        price: 1,
                        unit: "",
                        description: "",
                        adminNote: "",
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
        </Stack>

        <FieldArray
          name="brandOrQuality"
          render={(arrayHelpers) => (
            <Stack direction={"column"} mt={5} width="100%" alignItems="center">
              {formik.values.brandOrQuality.length > 0 ? (
                <Stack direction={"column"} width={"100%"}>
                  {formik.values.brandOrQuality?.map(
                    (eachbrandOrQuality, index) => {
                      const itemBrandOrQualityName = `brandOrQuality[${index}].brandOrQualityName`;
                      const touchedItemBrandOrQualityName = getIn(
                        formik.touched,
                        itemBrandOrQualityName
                      );
                      const errorItemBrandOrQualityName = getIn(
                        formik.errors,
                        itemBrandOrQualityName
                      );

                      const itemBuyingPrice = `brandOrQuality[${index}].buyingPrice`;
                      const touchedItemBuyingPrice = getIn(
                        formik.touched,
                        itemBuyingPrice
                      );
                      const errorItemBuyingPrice = getIn(
                        formik.errors,
                        itemBuyingPrice
                      );

                      const itemDescription = `brandOrQuality[${index}].description`;
                      const touchedItemDescription = getIn(
                        formik.touched,
                        itemDescription
                      );
                      const errorItemDescription = getIn(
                        formik.errors,
                        itemDescription
                      );

                      const itemMinimumQuantity = `brandOrQuality[${index}].minimumQuantity`;
                      const touchedItemMinimumQuantity = getIn(
                        formik.touched,
                        itemMinimumQuantity
                      );
                      const errorItemMinimumQuantity = getIn(
                        formik.errors,
                        itemMinimumQuantity
                      );

                      const itemAdminNote = `brandOrQuality[${index}].`;
                      const touchedItemAdminNote = getIn(
                        formik.touched,
                        itemAdminNote
                      );
                      const errorItemAdminNote = getIn(
                        formik.errors,
                        itemAdminNote
                      );

                      const itemPrice = `brandOrQuality[${index}].price`;
                      const touchedItemPrice = getIn(formik.touched, itemPrice);
                      const errorItemPrice = getIn(formik.errors, itemPrice);

                      const itemUnit = `brandOrQuality[${index}].unit`;
                      const touchedItemUnit = getIn(formik.touched, itemUnit);
                      const errorItemUnit = getIn(formik.errors, itemUnit);

                      const itemUnitCoefficient = `brandOrQuality[${index}].unitCoefficient`;
                      const touchedItemUnitCoefficient = getIn(
                        formik.touched,
                        itemUnitCoefficient
                      );
                      const errorItemUnitCoefficient = getIn(
                        formik.errors,
                        itemUnitCoefficient
                      );

                      return (
                        <Stack
                          direction={"column"}
                          key={`${index}`}
                          spacing={0}
                          alignItems="center"
                          sx={{ width: "100%" }}
                        >
                          {index > 1 && (
                            <Stack
                              width={"100%"}
                              alignItems="center"
                              // mt={5}
                              mb={3}
                            >
                              <Button
                                variant="outlined"
                                color="error"
                                sx={{ textAlign: "center" }}
                                onClick={async () => {
                                  return new Promise((resolve, reject) => {
                                    confirm({
                                      title: "Remove brand/quality?",
                                      description: "Are you sure you want to remove this Brand/quality?",
                                      confirmationText: "yes",
                                      cancellationText: "no",
                                    })
                                      .then(() => {
                                        arrayHelpers.remove(index);
                                      })
                                      .catch(() => {
                                      });
                                  });
                                }}
                                startIcon={<CloseOutlined />}
                              >
                                remove brand/quality
                              </Button>
                            </Stack>
                          )}

                          <Typography mb={4}>
                            Brand/quality {index + 1}
                          </Typography>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <TextField
                              variant="outlined"
                              label="brand/quality name"
                              name={`brandOrQuality.${index}.brandOrQualityName`}
                              required
                              placeholder="enter brand/quality name"
                              value={eachbrandOrQuality.brandOrQualityName}
                              onChange={formik.handleChange}
                              error={
                                Boolean(touchedItemBrandOrQualityName) &&
                                Boolean(errorItemBrandOrQualityName)
                              }
                              helperText={
                                Boolean(touchedItemBrandOrQualityName) && (
                                  <>{errorItemBrandOrQualityName}</>
                                )
                              }
                              sx={{ mb: 3 }}
                              size="medium"
                            />
                          </FormControl>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <TextareaAutosize
                              minRows={5}
                              maxRows={10}
                              placeholder="enter item description *"
                              id={`brandOrQuality.${index}.description`}
                              required
                              name={`brandOrQuality.${index}.description`}
                              value={eachbrandOrQuality.description}
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
                            {touchedItemDescription && Boolean(errorItemDescription) && (
                              <TextField
                                error
                                helperText={Boolean(touchedItemDescription) && (
                                  <>{errorItemDescription}</>
                                )}
                                variant="standard"
                                sx={{ fontSize: "12px" }}
                              />
                            )}
                          </FormControl>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <TextField
                              variant="outlined"
                              label="admin note"
                              InputProps={{
                                inputProps: { maxLength: 21 },
                              }}
                              placeholder="enter admin note"
                              value={eachbrandOrQuality.adminNote}
                              onChange={formik.handleChange(
                                `brandOrQuality.${index}.adminNote`
                              )}
                              error={touchedItemAdminNote && Boolean(errorItemAdminNote)}
                              helperText={
                                Boolean(touchedItemAdminNote) && <>{errorItemAdminNote}</>
                              }
                              sx={{ mb: 3 }}
                              size="medium"
                            />
                          </FormControl>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <TextField
                              variant="outlined"
                              label="buying price"
                              id={`brandOrQuality.${index}.buyingPrice`}
                              name={`brandOrQuality.${index}.buyingPrice`}
                              type={"number"}
                              placeholder="enter item buying"
                              required
                              value={eachbrandOrQuality.buyingPrice}
                              onChange={formik.handleChange}
                              error={
                                Boolean(touchedItemBuyingPrice) &&
                                Boolean(errorItemBuyingPrice)
                              }
                              helperText={
                                Boolean(touchedItemBuyingPrice) && (
                                  <>{errorItemBuyingPrice}</>
                                )
                              }
                              sx={{ mb: 3 }}
                              size="medium"
                            />
                          </FormControl>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <TextField
                              variant="outlined"
                              label="selling price"
                              name={`brandOrQuality.${index}.price`}
                              type={"number"}
                              placeholder="enter selling price/unit"
                              required
                              value={eachbrandOrQuality.price}
                              onChange={formik.handleChange}
                              error={
                                Boolean(touchedItemPrice) &&
                                Boolean(errorItemPrice)
                              }
                              helperText={
                                Boolean(touchedItemPrice) && (
                                  <>{errorItemPrice}</>
                                )
                              }
                              sx={{ mb: 3 }}
                              size="medium"
                            />
                          </FormControl>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <TextField
                              variant="outlined"
                              label="item unit coefficient"
                              name={`brandOrQuality.${index}.unitCoefficient`}
                              type={"number"}
                              placeholder="enter item unit coefficient"
                              required
                              value={eachbrandOrQuality.unitCoefficient}
                              onChange={formik.handleChange(
                                `brandOrQuality.${index}.unitCoefficient`
                              )}
                              error={
                                Boolean(touchedItemUnitCoefficient) &&
                                Boolean(errorItemUnitCoefficient)
                              }
                              helperText={
                                Boolean(touchedItemUnitCoefficient) && (
                                  <>{errorItemUnitCoefficient}</>
                                )
                              }
                              sx={{ mb: 3 }}
                              size="medium"
                            />
                          </FormControl>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <TextField
                              variant="outlined"
                              label="minimum quantity"
                              name={`brandOrQuality.${index}.minimumQuantity`}
                              type={"number"}
                              placeholder="enter minimum quantity"
                              required
                              value={eachbrandOrQuality.minimumQuantity}
                              onChange={formik.handleChange(
                                `brandOrQuality.${index}.minimumQuantity`
                              )}
                              error={
                                Boolean(touchedItemMinimumQuantity) &&
                                Boolean(errorItemMinimumQuantity)
                              }
                              helperText={
                                Boolean(touchedItemMinimumQuantity) && (
                                  <>{errorItemMinimumQuantity}</>
                                )
                              }
                              sx={{ mb: 3 }}
                              size="medium"
                            />
                          </FormControl>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <TextField
                              variant="outlined"
                              label="unit"
                              placeholder="enter unit"
                              required
                              value={eachbrandOrQuality.unit}
                              onChange={formik.handleChange(
                                `brandOrQuality.${index}.unit`
                              )}
                              error={touchedItemUnit && Boolean(errorItemUnit)}
                              helperText={
                                Boolean(touchedItemUnit) && <>{errorItemUnit}</>
                              }
                              sx={{ mb: 3 }}
                              size="medium"
                            />
                          </FormControl>

                          <FormControl variant="standard" sx={{ width: "50%" }}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={eachbrandOrQuality.acceptDecimal}
                                  onChange={() =>
                                    formik.setFieldValue(
                                      `brandOrQuality.${index}.acceptDecimal`,
                                      !eachbrandOrQuality.acceptDecimal
                                    )
                                  }
                                  name={`brandOrQuality.${index}.acceptDecimal`}
                                  id={`acceptDecimal-${index}`}
                                />
                              }
                              label="Accept Decimal"
                            />
                          </FormControl>

                          <FormControl
                            variant="standard"
                            required
                            sx={{ width: "50%", mb: 6 }}
                          >
                            <FormLabel id="upload-image">
                              Upload Item Image
                            </FormLabel>
                            <Stack sx={{ position: "relative", mt: 2 }}>
                              {eachbrandOrQuality.photoPreview.length > 0 ? (
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
                                      src={eachbrandOrQuality.photoPreview}
                                      alt="item"
                                      style={{
                                        width: "100%",
                                        height: 350,
                                        objectFit: "contain",
                                      }}
                                    />

                                    <IconButton
                                      onClick={async (e) => {
                                        await onButtonClick(e, index);
                                        // selectedIndexRef.current = [];
                                      }}
                                      size="large"
                                      sx={{
                                        borderRadius: "100%",
                                        position: "absolute",
                                        right: 8,
                                        backgroundColor: "rgba(0,0,0,0.1)",
                                      }}
                                    >
                                      <EditOutlined fontSize="small" />
                                    </IconButton>
                                    <input
                                      type="file"
                                      id="file"
                                      style={{ display: "none" }}
                                      name={`brandOrQuality.${index}.itemPhoto`}
                                      ref={inputFile}
                                      accept="image/gif,image/jpeg,image/jpg,image/png"
                                      multiple={false}
                                      data-original-title="upload photos"
                                      onChange={(e) => {
                                        onSelectFile(
                                          e,
                                          eachbrandOrQuality,
                                          eachbrandOrQuality?.index!
                                        );
                                      }}
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
                                    onClick={async (e) => {
                                      await onButtonClick(e, index);
                                    }}
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
                                      name={`brandOrQuality.${index}.itemPhoto`}
                                      ref={inputFile}
                                      accept="image/gif,image/jpeg,image/jpg,image/png"
                                      multiple={false}
                                      data-original-title="upload photos"
                                      onBlur={() =>
                                        (selectedIndexRef.current = [])
                                      }
                                      onChange={async (e) => {
                                        await onSelectFile(
                                          e,
                                          eachbrandOrQuality,
                                          eachbrandOrQuality?.index!
                                        );
                                      }}
                                    />
                                  </Stack>
                                </Box>
                              )}
                            </Stack>
                          </FormControl>

                          <FormControl
                            variant="standard"
                            sx={{ width: "50%", mb: 4 }}
                          >
                          </FormControl>
                        </Stack>
                      );
                    }
                  )}
                  <Stack width={"100%"} alignItems="center" mt={5} mb={10}>
                    <Button
                      variant="outlined"
                      sx={{ textAlign: "center" }}
                      onClick={() =>
                        arrayHelpers.push({
                          price: 0,
                          unit: "",
                          unitCoefficient: 0,
                          itemPhoto: null,
                          photoPreview: "",
                          index: formik.values.brandOrQuality.length,
                        })
                      }
                      startIcon={<Add />}
                    >
                      add brand/quality
                    </Button>
                  </Stack>
                </Stack>
              ) : (
                <Stack width={"100%"} alignItems="center" mt={5} mb={10}>
                  <Button
                    variant="outlined"
                    sx={{ textAlign: "center" }}
                    onClick={() =>
                      arrayHelpers.push({
                        price: 0,
                        unit: "",
                        unitCoefficient: 0,
                        itemPhoto: null,
                        photoPreview: "",
                        index: formik.values.brandOrQuality.length,
                      })
                    }
                    startIcon={<Add />}
                  >
                    add brand/quality
                  </Button>
                </Stack>
              )}
            </Stack>
          )}
        />
      </FormikProvider>

      <Dialog open={open} onClose={handleClose} fullWidth>
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
            <Button onClick={handleClose}>Cancel</Button>
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
  );
}

export default BrandOrQuality;
