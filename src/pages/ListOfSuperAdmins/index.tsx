import React, { useCallback, useEffect, useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import axios from "axios";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";
import { Container, Stack, Typography } from "@mui/material";
import ListOfSuperAdminsCard from "../../components/ListOfSuperAdmins/ListOfSuperAdminsCard";

type Admin = {
  email: string;
  password: string;
  branchName: string;
  branchCode: string;
  _id: string;
  adminType: string;
  createdAdminId: string;
};

function ListOfSuperAdmins() {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { baseUrl, tabIdentifier } = useAppData();

  const getAdminsList = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `${baseUrl}/admin-actions/get-super-admins`,
        TokenConfig(tabIdentifier)
      );

      setAdmins(data.admins);
      setIsLoading(false);
      setIsError(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setIsError(true);
    }
  }, [baseUrl]);

  useEffect(() => {
    getAdminsList();
  }, [getAdminsList]);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError) {
    return (
      <EmptyOrErrorState text="an occurred while fetching admins list 😕" />
    );
  }

  return (
    <Container sx={{ mt: 0.5 }}>
      <Stack
        alignItems={"center"}
        justifyContent="center"
        flexDirection={"column"}
        sx={{
          padding: "1rem",
          width: "100%",
          maxWidth: "100%",
        }}
      >
        <Typography variant="h5" textAlign={"center"} mb={2}>
          List of Super Admins
        </Typography>

        {admins?.map((admin, index) => (
          <ListOfSuperAdminsCard
            key={admin._id}
            email={admin.email}
            password={admin.password}
            branchName={admin.branchName}
            branchCode={admin.branchCode}
            adminId={admin._id}
            isLast={Boolean(admins.length === index + 1)}
            getAdminsList={getAdminsList}
          />
        ))}
      </Stack>
    </Container>
  );
}

export default ListOfSuperAdmins;
