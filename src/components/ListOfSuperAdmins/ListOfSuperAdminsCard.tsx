import { EditOutlined } from "@mui/icons-material";
import { Container, IconButton, Paper, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import EditSuperAdminDetails from "./EditSuperAdminDetails";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { useAppData } from "../../context/AppContext";

type ListOfAdminsCardType = {
  adminId: string;
  email: string;
  password: string;
  branchName: string;
  branchCode: string;
  isLast: boolean;
  getAdminsList: () => void;
};

function ListOfSuperAdminsCard({
  adminId,
  email,
  password,
  branchName,
  branchCode,
  isLast,
  getAdminsList,
}: ListOfAdminsCardType) {
  const [showEditAdminModal, setShowEditAdminModal] = useState(false);
  const { loginUser } = useAppData();

  const openBranchLink = async () => {
    try {
      await loginUser(email, password, true);
    } catch (error) {
      console.log('error:', error);
    }
    // window.open(`${window.location.origin}/login?email=${email}`, "_blank");
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
        </Stack>
        <Stack direction={"row"} alignItems={"center"}>
          <Typography variant="subtitle2" fontWeight={600} mr={1}>
            email:{" "}
          </Typography>
          <Typography variant="body1">{email}</Typography>
        </Stack>

        <Stack direction={"row"} alignItems={"center"} mt={2}>
          <Typography
            variant="subtitle2"
            component={"a"}
            fontWeight={600}
            mr={0.5}
            sx={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={openBranchLink}
          >
            check this branch
          </Typography>
          <OpenInNewIcon
            fontSize="small"
            sx={{ cursor: "pointer" }}
            onClick={openBranchLink}
          />
        </Stack>
      </Container>
      {showEditAdminModal && (
        <EditSuperAdminDetails
          open={showEditAdminModal}
          onClose={() => setShowEditAdminModal(false)}
          email={email}
          password={password}
          branchName={branchName}
          branchCode={branchCode}
          adminId={adminId}
          getAdminsList={getAdminsList}
        />
      )}
    </Paper>
  );
}

export default ListOfSuperAdminsCard;
