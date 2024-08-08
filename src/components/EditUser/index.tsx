import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { generateUserSchema } from "../../schema";
import { useSnackbar } from "notistack";
import { User } from "../../pages/ListOfUsers";
import React, { useState, useEffect } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import axios from "axios";

type EditUserProps = {
  row: User | null;
  open: boolean;
  onClose: () => void;
  handleSaveRowEdits: (value: User, valueId: string) => void;
  valueId: string;
};

function EditUser({
  row,
  open,
  onClose,
  handleSaveRowEdits,
  valueId,
}: EditUserProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const { baseUrl, tabIdentifier } = useAppData();
  const [isError, setIsError] = useState(false);
  const [commonFieldsCurrency, setCommonFieldsCurrency] = useState<
    string | null
  >(null);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${baseUrl}/common-fields/admin/get-common-fields`,
          TokenConfig(tabIdentifier)
        );
        // await axios.get(
        //   `${baseUrl}/cron`,
        //   TokenConfig()
        // );
        setCommonFieldsCurrency(data?.commonFields?.currency || "");
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    })();
  }, [baseUrl]);

  const formik = useFormik({
    initialValues: {
      email: row?.email || "",
      name: row?.name || "",
      password: row?.password || "",
      branchCode: row?.branchCode || "",
      googleMapLocation: row?.googleMapLocation || "",
      houseNumber: row?.houseNumber || "",
      streetAddress: row?.streetAddress || "",
      phoneNumber: row?.phoneNumber || "",
      max_daily_order: row?.max_daily_order || "",
    },
    validationSchema: generateUserSchema,
    onSubmit: async (values) => {
      try {
        await handleSaveRowEdits(values, valueId);
        onClose();
        formik.resetForm();
      } catch (error: any) {
        console.log(error);
        enqueueSnackbar(error.response.data.message || "an error occurred", {
          variant: "error",
        });
      }
    },
  });

  const maxDailyOrderHeader = `max daily order amount (${commonFieldsCurrency})`

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography>Edit User</Typography>
      </DialogTitle>
      {/* <Stack direction={"column"} alignItems={"center"} width="100%"> */}
      <form
        onSubmit={formik.handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <DialogContent
          dividers
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            minWidth: "100%",
          }}
        >
          <FormControl variant="standard" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              id="email"
              name="email"
              label="email"
              placeholder="enter email"
              value={formik.values.email}
              InputProps={{
                inputProps: { maxLength: 70 }
              }}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={
                Boolean(formik.touched.email) && <>{formik.errors.email}</>
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              id="name"
              name="name"
              label="name"
              placeholder="enter name"
              value={formik.values.name}
              InputProps={{
                inputProps: { maxLength: 70 }
              }}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={
                Boolean(formik.touched.name) && <>{formik.errors.name}</>
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              id="password"
              name="password"
              label="password"
              type={"password"}
              placeholder="enter password"
              value={formik.values.password}
              onChange={formik.handleChange}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                Boolean(formik.touched.password) && (
                  <>{formik.errors.password}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              id="branchCode"
              name="branchCode"
              label="branch code"
              placeholder="enter branch code"
              value={formik.values.branchCode}
              InputProps={{
                readOnly: true,
                inputProps: { maxLength: 70 }
              }}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.branchCode && Boolean(formik.errors.branchCode)}
              helperText={
                Boolean(formik.touched.branchCode) && <>{formik.errors.branchCode}</>
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              id="googleMapLocation"
              name="googleMapLocation"
              label="Google map location (optional)"
              placeholder="enter google map location (optional)"
              value={formik.values.googleMapLocation}
              InputProps={{
                inputProps: { maxLength: 140 }
              }}
              onChange={formik.handleChange}
              error={
                formik.touched.googleMapLocation &&
                Boolean(formik.errors.googleMapLocation)
              }
              helperText={
                Boolean(formik.touched.googleMapLocation) && (
                  <>{formik.errors.googleMapLocation}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              id="houseNumber"
              name="houseNumber"
              label="House number/identifier (optional)"
              placeholder="house number/identifier (optional)"
              value={formik.values.houseNumber}
              InputProps={{
                inputProps: { maxLength: 140 }
              }}
              onChange={formik.handleChange}
              error={formik.touched.houseNumber && Boolean(formik.errors.houseNumber)}
              helperText={
                Boolean(formik.touched.houseNumber) && <>{formik.errors.houseNumber}</>
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              id="streetAddress"
              name="streetAddress"
              label="street address"
              placeholder="enter street address"
              value={formik.values.streetAddress}
              InputProps={{
                inputProps: { maxLength: 140 }
              }}
              onChange={formik.handleChange}
              error={
                formik.touched.streetAddress &&
                Boolean(formik.errors.streetAddress)
              }
              helperText={
                Boolean(formik.touched.streetAddress) && (
                  <>{formik.errors.streetAddress}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "100%" }}>
            <TextField
              variant="outlined"
              id="phoneNumber"
              name="phoneNumber"
              label="phone number"
              placeholder="enter phone number"
              value={formik.values.phoneNumber}
              InputProps={{
                inputProps: {
                  minLength: 4,
                  maxLength: 13
                }
              }}
              onChange={formik.handleChange}
              error={
                formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)
              }
              helperText={
                Boolean(formik.touched.phoneNumber) && (
                  <>{formik.errors.phoneNumber}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl
            variant="standard"
            sx={{ width: { xs: "100%", md: "50%" } }}
          >
            <TextField
              variant="outlined"
              id="max_daily_order"
              name="max_daily_order"
              label={maxDailyOrderHeader}
              placeholder="enter max daily order amount"
              value={formik.values.max_daily_order}
              InputProps={{
                inputProps: { maxLength: 11 }
              }}
              onChange={formik.handleChange}
              error={
                formik.touched.max_daily_order &&
                Boolean(formik.errors.max_daily_order)
              }
              helperText={
                Boolean(formik.touched.max_daily_order) && (
                  <>{formik.errors.max_daily_order}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ width: "100%" }}>
          <Stack
            direction="row"
            justifyContent={"end"}
            spacing={8}
            width="100%"
          >
            <Button onClick={onClose} variant="contained" color="secondary">
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
      {/* </Stack> */}
    </Dialog>
  );
}

export default EditUser;
