import {
  Button,
  CircularProgress,
  Container,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { addAdminsSchema, addAdminsCeoSchema } from "../../schema";
import axios from "axios";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import { Factory, Code } from "@mui/icons-material";
import { adminTypes, ceoAdminTypes } from "../../constants";

function AddAdmins() {
  const { baseUrl, state, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();

  const [togglePassword, setTogglePassword] = useState(false);
  const [adminTypesToShow, setAdminTypesToShow] = useState<
    { value: string; label: string }[]
  >([]);
  const [isCeo, setIsCeo] = useState(false)

  useEffect(() => {
    if (state?.user?.adminType === "ceo") {
      setAdminTypesToShow(ceoAdminTypes);
      setIsCeo(true)
    } else {
      setIsCeo(false)
      setAdminTypesToShow(adminTypes);
    }
  }, [state?.user?.adminType]);

  const togglePasswordHandler = () => {
    setTogglePassword(!togglePassword);
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      branchName: "",
      branchCode: "",
      password: "",
      adminType: "",
    },
    validationSchema: isCeo ? addAdminsCeoSchema : addAdminsSchema,
    onSubmit: async (values) => {
      try {
        await axios.post(
          `${baseUrl}/admin-actions/register-admin`,
          values,
          TokenConfig(tabIdentifier)
        );
        enqueueSnackbar("Admin created successfully!", {
          variant: "success",
        });
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
    <Container maxWidth="lg" sx={{ mt: 0.5 }}>
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
          Add Admins
        </Typography>
        <Stack alignItems={"center"} width="100%" mt={4}>
          <form
            onSubmit={formik.handleSubmit}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {isCeo && (
              <FormControl variant="standard" sx={{ width: "50%" }}>
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
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility">
                          <Factory fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            )}

            {isCeo && (
              <FormControl variant="standard" sx={{ width: "50%" }}>
                <TextField
                  variant="outlined"
                  id="branchCode"
                  name="branchCode"
                  label="branch code"
                  placeholder="enter branch code"
                  value={formik.values.branchCode}
                  onChange={formik.handleChange}
                  autoFocus
                  error={formik.touched.branchCode && Boolean(formik.errors.branchCode)}
                  helperText={
                    Boolean(formik.touched.branchCode) && <>{formik.errors.branchCode}</>
                  }
                  sx={{ mb: 3 }}
                  size="medium"
                  InputProps={{
                    inputProps: { maxLength: 70 },
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility">
                          <Code fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </FormControl>
            )}

            <FormControl variant="standard" sx={{ width: "50%" }}>
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
                InputProps={{
                  inputProps: { maxLength: 70 },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton aria-label="toggle password visibility">
                        <EmailIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl variant="standard" sx={{ width: "50%" }}>
              <TextField
                variant="outlined"
                id="password"
                name="password"
                label="password"
                type={togglePassword ? "text" : "password"}
                placeholder="enter password"
                value={formik.values.password}
                onChange={formik.handleChange}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={
                  Boolean(formik.touched.password) && (
                    <>{formik.errors.password}</>
                  )
                }
                sx={{ mb: 3 }}
                size="medium"
                InputProps={{
                  endAdornment: (
                    <InputAdornment
                      position="end"
                      onClick={togglePasswordHandler}
                    >
                      <IconButton aria-label="toggle password visibility">
                        {togglePassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            <FormControl variant="standard" sx={{ width: "50%" }}>
              <TextField
                variant="outlined"
                select
                id="adminType"
                name="adminType"
                label="select admin type"
                placeholder="select admin type"
                value={formik.values.adminType}
                onChange={formik.handleChange}
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
                {adminTypesToShow.map((type, index) => (
                  <MenuItem value={type.value} key={index}>
                    {type.label}
                  </MenuItem>
                ))}
              </TextField>
            </FormControl>
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
            >
              Generate
            </Button>
          </form>
        </Stack>
      </Stack>
    </Container>
  );
}

export default AddAdmins;
