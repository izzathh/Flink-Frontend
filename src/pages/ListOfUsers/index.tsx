import {
  Box,
  Container,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import MaterialReactTable, {
  MRT_Cell,
  MRT_ColumnDef,
  MRT_Row,
  MaterialReactTableProps,
} from "material-react-table";
import { useSnackbar } from "notistack";
import { useConfirm } from "material-ui-confirm";
import { Delete, Edit } from "@mui/icons-material";
import { format } from "date-fns";
import EditUser from "../../components/EditUser";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";
import moment from "moment-timezone";

export type User = {
  email: string;
  name: string;
  password: string;
  branchCode: string;
  googleMapLocation: string;
  houseNumber: string;
  streetAddress: string;
  phoneNumber: string;
  max_daily_order: string;
  createdAt?: Date;
  updatedAt?: Date;
  _id?: string;
};

const validateRequired = (value: string) => !!value.length;

function ListOfUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [reloadPage, setReloadPage] = useState(0);
  const [isError, setIsError] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [chosenRowValues, setChosenRowValues] = useState<User | null>(null);
  const { baseUrl, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();
  const confirm = useConfirm();
  const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
  const targetTimeZone = sessionStorage.getItem(`timezone`) ||
    localStorage.getItem(`timezone_${loadUserTabIdentifier}`);
  // const targetTimeZone = `${localStorage.getItem("timezone")}`;

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${baseUrl}/admin/list-users`,
          TokenConfig(tabIdentifier)
        );
        setUsers(data.users);
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    })();
  }, [baseUrl, reloadPage]);

  const handleSaveRowEdits: MaterialReactTableProps<User>["onEditingRowSave"] =
    async ({ row, values }: any) => {
      console.log("row in 74", row);

      //   if (!Object.keys(validationErrors).length) {
      users[row.index] = values;
      console.log("users in edit", users);

      //send/receive api updates here, then refetch or update local table data for re-render
      // try {
      //   const { data } = await axios.post(`${baseUrl}/admin/edit-user`, {});
      // } catch (error) {
      //   console.error(error);
      //   enqueueSnackbar("ann error occurred", { variant: "error" });
      // }
      setUsers([...users]);
      // exitEditingMode(); //required to exit editing mode and close modal
      //   }
    };

  const saveEditRow = async (value: User, valueId: string) => {
    const updatedUsers = users.map((user) => {
      if (user._id === valueId) {
        return {
          ...user,
          email: value.email,
          name: value.name,
          password: value.password,
          branchCode: value.branchCode,
          houseNumber: value.houseNumber,
          streetAddress: value.streetAddress,
          phoneNumber: value.phoneNumber,
          googleMapLocation: value.googleMapLocation,
          max_daily_order: value.max_daily_order,
        };
      }
      return user;
    });

    const foundUser = updatedUsers.find((user) => user._id === valueId);
    try {
      const { data } = await axios.post(
        `${baseUrl}/admin/edit-user`,
        {
          userId: foundUser?._id,
          name: foundUser?.name,
          email: foundUser?.email,
          password: foundUser?.password,
          branchCode: foundUser?.branchCode,
          googleMapLocation: foundUser?.googleMapLocation,
          houseNumber: foundUser?.houseNumber,
          streetAddress: foundUser?.streetAddress,
          phoneNumber: foundUser?.phoneNumber,
          max_daily_order: foundUser?.max_daily_order,
        },


        TokenConfig(tabIdentifier)
      );
      setReloadPage(1)
      setReloadPage(2)
      enqueueSnackbar("User edited successfully!", { variant: "success" });
      setUsers(updatedUsers);
    } catch (error: any) {
      console.log(error);
      enqueueSnackbar(error.response.data.message || "an error occurred", {
        variant: "error",
      });
    }
  };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row: any) => {
      confirm({
        title: "Delete user",
        description: `Are you sure you want to delete ${row.name} ?`,
        confirmationText: "Yes",
        cancellationText: "Cancel",
      })
        .then(async () => {
          try {
            await axios.delete(
              `${baseUrl}/admin/${row._id}/delete-user`,
              TokenConfig(tabIdentifier)
            );
            enqueueSnackbar("User deleted successfully!", { variant: "success" });
            const indexToDelete = users.findIndex(user => user.email === row.email);
            if (indexToDelete !== -1) {
              users.splice(indexToDelete, 1);
            }
            setUsers([...users]);
          } catch (error: any) {
            console.log(error);
            enqueueSnackbar(
              error.response.data.message || "an error occurred",
              {
                variant: "error",
              }
            );
          }
        })
        .catch(() => { });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [users, baseUrl]
  );

  const getCommonEditTextFieldProps = useCallback(
    (
      cell: MRT_Cell<User>
    ): MRT_ColumnDef<User>["muiTableBodyCellEditTextFieldProps"] => {
      return {
        error: !!validationErrors[cell.id],
        helperText: validationErrors[cell.id],
        onBlur: (event) => {
          const isValid = validateRequired(event.target.value);
          if (!isValid) {
            //set validation error for cell if invalid
            setValidationErrors({
              ...validationErrors,
              [cell.id]: `${cell.column.columnDef.header} is required`,
            });
          } else {
            //remove validation error for cell if valid
            delete validationErrors[cell.id];
            setValidationErrors({
              ...validationErrors,
            });
          }
        },
      };
    },
    [validationErrors]
  );

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "_id",
        header: "unique id",
        size: 0,
        enableHiding: true,
      },
      {
        accessorKey: "email",
        header: "email",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "name",
        header: "name",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "password",
        header: "password",
        size: 140,
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),

        Cell: ({ cell }: any) => {
          return (
            <input
              type="password"
              value={cell.getValue()}
              style={{ border: 0, backgroundColor: "transparent" }}
              disabled
            />
          );
        },
      },
      {
        accessorKey: "branchCode",
        header: "branch code",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "googleMapLocation",
        header: "google map location",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "houseNumber",
        header: "house no/identifier",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
        enableHiding: true,
      },
      {
        accessorKey: "streetAddress",
        header: "street address",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "phoneNumber",
        header: "phone number",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "max_daily_order",
        header: "",
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
      {
        accessorKey: "createdAt",
        header: "created date",
        Cell: ({ cell }: any) => {
          const originalDateInTargetTimeZone = moment(
            new Date(cell.getValue())
          ).tz(`${targetTimeZone}`);
          const convertedDate = format(
            new Date(
              originalDateInTargetTimeZone.format("YYYY-MM-DD HH:mm:ss")
            ),
            "PPpp"
          );
          return <p>{convertedDate}</p>;
        },
        muiTableBodyCellEditTextFieldProps: ({ cell }) => ({
          ...getCommonEditTextFieldProps(cell),
        }),
      },
    ],
    [getCommonEditTextFieldProps]
  );

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${baseUrl}/common-fields/admin/get-common-fields`,
          TokenConfig(tabIdentifier)
        );
        const getColumn = columns.find((max) => max.accessorKey === "max_daily_order")
        if (getColumn) {
          getColumn.header = `max daily order(${data?.commonFields?.currency || ""})` ?? "max daily order()";
        }
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    })();
  }, [baseUrl, reloadPage]);


  // useEffect(() => {
  //   const getColumn = columns.find((max) => max.accessorKey === "max_daily_order")
  //   console.log('columns:', getColumn);
  //   console.log('commonFieldsCurrency:', commonFieldsCurrency);
  //   if (getColumn) {
  //     getColumn.header = `max daily order(${commonFieldsCurrency})` ?? "max daily order()";
  //   }
  // }, [commonFieldsCurrency])

  if (isLoading) {
    return <FullScreenLoader />;
  }
  if (isError) {
    return <EmptyOrErrorState text="An error occured 😕" />;
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
          List of users
        </Typography>
        <Stack width="100%" maxWidth={"100%"} mt={4}>
          <MaterialReactTable
            displayColumnDefOptions={{
              "mrt-row-actions": {
                muiTableHeadCellProps: {
                  align: "center",
                },
                size: 120,
              },
            }}
            columns={columns}
            data={users}
            editingMode="modal" //default
            enableColumnOrdering
            enableEditing
            onEditingRowSave={handleSaveRowEdits}
            onEditingRowCancel={handleCancelRowEdits}
            muiTableBodyCellEditTextFieldProps={({
              cell,
              column,
              row,
              table,
            }) => {
              if (column.id === "password") {
                return { type: "password" };
              }
              return { type: "text" };
            }}
            renderRowActions={({ row, table }) => (
              <Box sx={{ display: "flex", gap: "1rem" }}>
                <Tooltip arrow placement="left" title="Edit">
                  {/* <IconButton onClick={() => table.setEditingRow(row)}> */}
                  <IconButton
                    onClick={() => {
                      setOpenEditDialog(true);
                      setChosenRowValues(row._valuesCache);
                    }}
                  >
                    <Edit />
                  </IconButton>
                </Tooltip>
                <Tooltip arrow placement="right" title="Delete">
                  <IconButton
                    color="error"
                    onClick={() => {
                      handleDeleteRow(row.original);
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Tooltip>
              </Box>
            )}
            positionActionsColumn="last"
          />
          {openEditDialog && (
            <EditUser
              row={chosenRowValues || null}
              open={openEditDialog}
              onClose={() => {
                setOpenEditDialog(false);
                setChosenRowValues(null);
              }}
              handleSaveRowEdits={saveEditRow}
              valueId={chosenRowValues?._id || ""}
            />
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export default ListOfUsers;
