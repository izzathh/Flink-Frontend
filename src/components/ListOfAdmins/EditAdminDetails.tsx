import { LoadingButton } from "@mui/lab";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React from "react";
import { addAdminsSchema } from "../../schema";
import axios from "axios";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";
import { adminTypes } from "../../constants";

type EditAdminDetailsType = {
  open: boolean;
  onClose: () => void;
  email: string;
  password: string;
  adminType: string;
  adminId: string;
  getAdminsList: () => void;
  showPasswordBox?: boolean;
};

function EditAdminDetails({
  open,
  onClose,
  email,
  password,
  adminType,
  adminId,
  getAdminsList,
}: EditAdminDetailsType) {
  const { baseUrl, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      email: email || "",
      password: password || "",
      adminType: adminType || "",
    },
    validationSchema: addAdminsSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${baseUrl}/admin-actions/edit-admin-details`,
          { editAdminId: adminId, ...values },
          TokenConfig(tabIdentifier)
        );
        await getAdminsList();
        enqueueSnackbar("Admin details edited successfully!", {
          variant: "success",
        });
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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography>Edit Admin</Typography>
      </DialogTitle>

      <form
        onSubmit={formik.handleSubmit}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          marginTop: "1rem",
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
          <FormControl variant="standard" sx={{ width: "80%" }}>
            <TextField
              variant="outlined"
              id="email"
              name="email"
              label="email"
              placeholder="enter email"
              value={formik.values.email}
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

          <FormControl variant="standard" sx={{ width: "80%" }}>
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

          <FormControl variant="standard" sx={{ width: "80%" }}>
            <TextField
              variant="outlined"
              select
              id="adminType"
              name="adminType"
              label="select admin type"
              placeholder="select admin type"
              value={formik.values.adminType}
              onChange={formik.handleChange}
              autoFocus
              error={
                formik.touched.adminType && Boolean(formik.errors.adminType)
              }
              helperText={
                Boolean(formik.touched.adminType) && (
                  <>{formik.errors.adminType}</>
                )
              }
              sx={{ mb: 3 }}
              size="medium"
            >
              {adminTypes.map((type, index) => (
                <MenuItem value={type.value} key={index}>
                  {type.label}
                </MenuItem>
              ))}
            </TextField>
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
    </Dialog>
  );
}

export default EditAdminDetails;
