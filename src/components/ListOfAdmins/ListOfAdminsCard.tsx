import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { Container, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import { adminTypes } from "../../constants";
import EditAdminDetails from "./EditAdminDetails";
import { useConfirm } from "material-ui-confirm";
import axios from "axios";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { useSnackbar } from "notistack";

type ListOfAdminsCardType = {
  adminId: string;
  email: string;
  password: string;
  adminType: string;
  isLast: boolean;
  getAdminsList: () => void;
};

function ListOfAdminsCard({
  adminId,
  email,
  password,
  adminType,
  isLast,
  getAdminsList,
}: ListOfAdminsCardType) {
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const { baseUrl, tabIdentifier } = useAppData();

  const onDeleteButtonClickHandler = () => {
    confirm({
      title: "Delete Admin",
      description: `Are you sure you want to delete this admin?`,
      confirmationText: "Yes",
      cancellationText: "Cancel",
    })
      .then(async () => {
        try {
          await axios.delete(
            `${baseUrl}/admin-actions/${adminId}/delete-admin`,
            TokenConfig(tabIdentifier)
          );

          await getAdminsList();
          enqueueSnackbar("Admin deleted successfully!", {
            variant: "success",
          });
        } catch (error: any) {
          console.log(error);
          enqueueSnackbar(error.response.data.message || "an error occurred", {
            variant: "error",
          });
        }
      })
      .catch(() => { });
  };

  return (
    <Paper
      variant="outlined"
      square
      sx={{ width: "80%", borderBottom: isLast ? "" : 0 }}
    >
      <Container maxWidth="md" sx={{ py: 2, position: "relative" }}>
        <Stack
          direction={"row"}
          alignItems={"center"}
          sx={{ position: "absolute", top: 4, right: 2 }}
        >
          <IconButton onClick={() => setShowEditAdminModal(true)}>
            <EditOutlined />
          </IconButton>
          <IconButton onClick={onDeleteButtonClickHandler}>
            <DeleteOutline />
          </IconButton>
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography variant="subtitle2" fontWeight={600} mr={1}>
            email:{" "}
          </Typography>
          <Typography variant="body1">{email}</Typography>
        </Stack>

        <Stack direction={"row"} alignItems={"center"}>
          <Typography variant="subtitle2" fontWeight={600} mr={1}>
            admin type:{" "}
          </Typography>
          <Typography variant="body1">
            {adminTypes.find((type) => type.value === adminType)?.label}
          </Typography>
        </Stack>
      </Container>
      {showEditAdminModal && (
        <EditAdminDetails
          open={showEditAdminModal}
          onClose={() => setShowEditAdminModal(false)}
          email={email}
          password={password}
          adminId={adminId}
          adminType={adminType}
          getAdminsList={getAdminsList}
        />
      )}
    </Paper>
  );
}

export default ListOfAdminsCard;
