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
import React from "react";
import { editSuperAdminsSchema } from "../../schema";
import axios from "axios";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";

type EditAdminDetailsType = {
  open: boolean;
  onClose: () => void;
  email: string;
  password: string;
  branchName: string;
  branchCode: string;
  adminId: string;
  getAdminsList: () => void;
  showPasswordBox?: boolean;
};

function EditSuperAdminDetails({
  open,
  onClose,
  email,
  password,
  branchName,
  branchCode,
  adminId,
  getAdminsList,
}: EditAdminDetailsType) {
  const { baseUrl, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();

  const formik = useFormik({
    initialValues: {
      email: email || "",
      password: password || "",
      branchName: branchName || "",
      branchCode: branchCode || "",
    },
    validationSchema: editSuperAdminsSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${baseUrl}/admin-actions/edit-super-admin-details`,
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
              id="branchName"
              name="branchName"
              label="branch name"
              placeholder="enter branch name"
              value={formik.values.branchName}
              onChange={formik.handleChange}
              autoFocus
              error={formik.touched.branchName && Boolean(formik.errors.branchName)}
              helperText={
                Boolean(formik.touched.branchName) && <>{formik.errors.branchName}</>
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

          <FormControl variant="standard" sx={{ width: "80%" }}>
            <TextField
              variant="outlined"
              id="branchCode"
              name="branchCode"
              label="branch code"
              placeholder="enter branch code"
              value={formik.values.branchCode}
              onChange={formik.handleChange}
              autoFocus
              InputProps={{
                inputProps: { maxLength: 70 },
              }}
              error={formik.touched.branchCode && Boolean(formik.errors.branchCode)}
              helperText={
                Boolean(formik.touched.branchCode) && <>{formik.errors.branchCode}</>
              }
              sx={{ mb: 3 }}
              size="medium"
            />
          </FormControl>

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
              InputProps={{
                inputProps: { maxLength: 70 },
              }}
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

export default EditSuperAdminDetails;
