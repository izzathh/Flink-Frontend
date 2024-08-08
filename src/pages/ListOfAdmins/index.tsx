import { Container, Stack, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TokenConfig, useAppData } from "../../context/AppContext";
import ListOfAdminsCard from "../../components/ListOfAdmins/ListOfAdminsCard";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";

type Admin = {
  email: string;
  password: string;
  _id: string;
  adminType: string;
  createdAdminId: string;
};

function ListOfAdmins() {
  const [admins, setAdmins] = useState<Admin[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { baseUrl, state, tabIdentifier } = useAppData();

  const getAdminsList = useCallback(async () => {
    setIsLoading(true);

    try {
      const { data } = await axios.get(
        `${baseUrl}/admin-actions/get-admins-list`,
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
    return (
      <>
        <Typography variant="h5" textAlign={"center"} mb={2}>
          List of Admins
        </Typography>
        <FullScreenLoader />
      </>
    );
  }

  if (isError) {
    return (
      <>
        <Typography variant="h5" textAlign={"center"} mb={2}>
          List of Admins
        </Typography>
        <EmptyOrErrorState text="an occurred while fetching admins list 😕" />
      </>
    );
  }

  if (admins?.length === 0 && !isLoading && !isError) {
    return (
      <>
        <Typography variant="h5" textAlign={"center"} mb={2}>
          List of Admins
        </Typography>
        <EmptyOrErrorState text="No admins found 😕 Go to Add Admins page to create an admin" />
      </>
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
          List of Admins
        </Typography>

        {admins?.map((admin, index) => (
          <ListOfAdminsCard
            key={admin._id}
            email={admin.email}
            password={admin.password}
            adminType={admin.adminType}
            adminId={admin._id}
            isLast={Boolean(admins.length === index + 1)}
            getAdminsList={getAdminsList}
          />
        ))}
      </Stack>
    </Container>
  );
}

export default ListOfAdmins;
