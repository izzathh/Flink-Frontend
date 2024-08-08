import React, { useCallback, useEffect, useState } from "react";
import { TokenConfig, useAppData } from "../../context/AppContext";
import {
  ICategoryResponse,
  IEditItemProps,
  IItemsResponse,
} from "../../types/appTypes";
import axios from "axios";
import {
  AccordionDetails,
  AccordionSummary,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import ModeEditOutlineIcon from "@mui/icons-material/ModeEditOutline";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageViewDialog from "../../components/ListItem/ImageViewDialog";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import EditListedItemDialog from "../../components/ListItem/EditListedItemDialog";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";
import { string } from "yup";

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&:before": {
    display: "none",
  },
}));

function ListOfItemsCards() {
  const [items, setItems] = useState<ICategoryResponse[] | null>(null);
  const [currency, setCurrency] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [chosenItemPhoto, setChosenItemPhoto] = useState<string | null>(null);
  const [chosenItemDescription, setChosenItemDescription] = useState("");
  const [chosenItem, setChosenItem] = useState<IEditItemProps | null>(null);
  const [lastSerialNumber, setlastSerialNumber] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { baseUrl, tabIdentifier } = useAppData();
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();

  const getListedItems = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data,
      }: {
        data: {
          items: ICategoryResponse[];
          lastSerialNumber: number;
          currency: string;
        };
      } = await axios.get(
        `${baseUrl}/mappings/admin/listed-items`,
        TokenConfig(tabIdentifier)
      );
      console.log('data:', data);

      setItems(data.items);
      setlastSerialNumber(data.lastSerialNumber);
      console.log("last....", data.lastSerialNumber)
      setCurrency(data.currency);
      setLoading(false);
      setIsError(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setIsError(true);
    }
  }, [baseUrl]);

  useEffect(() => {
    getListedItems();
  }, [getListedItems]);
  const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";

  const createdAdminId = sessionStorage.getItem(`adminId`) ||
    localStorage.getItem(`adminId_${loadUserTabIdentifier}`);

  const deleteItemHandler = async (categoryId: string, itemId: string, itemWrapperId: string) => {
    confirm({
      title: "Delete item ?",
      description: "Are you sure you want to delete this item ?",
      confirmationText: "yes",
      cancellationText: "no",
    })
      .then(async () => {
        try {
          await axios.delete(
            `${baseUrl}/items/admin/${categoryId}/${itemId}/${itemWrapperId}/${createdAdminId}/delete-item`,
            TokenConfig(tabIdentifier)
          );
          await getListedItems();
          enqueueSnackbar("Item deletion successfull", { variant: "success" });
        } catch (error: any) {
          console.error(error);
          enqueueSnackbar(error.response.data.message || "an error occurred", {
            variant: "error",
          });
        }
      })
      .catch(() => { });
  };

  const editItemHandler = (
    outerItem: ICategoryResponse,
    item: IItemsResponse
  ) => {
    setOpenEditDialog(true);
    const dataToBeAdded = {
      categoryName: outerItem.categoryName,
      _id: outerItem._id,
      serialNumber: outerItem.serialNumber,
      itemSerialNumber: item.itemSerialNumber,
      lastItemSerialNumber: item.lastItemSerialNumber,
      itemWrapperId: item.itemWrapperId,
      itemId: item.itemId,
      itemName: item.itemName,
      isBrandOrQuality: item.isBrandOrQuality,
      itemPhoto: item.itemPhoto,
      itemUnitCoefficient: item.itemUnitCoefficient,
      buyingPrice: item.buyingPrice,
      description: item.description,
      adminNote: item.adminNote,
      price: item.price,
      unit: item.unit,
      minimumQuantity: item.minimumQuantity,
      acceptDecimal: item.acceptDecimal || false,
      brandOrQualityName: item.brandOrQualityName || "",
    };
    setChosenItem(dataToBeAdded);
  };

  if (loading) {
    return (
      <Stack alignItems={"center"} justifyContent={"center"} height={"60vh"}>
        <CircularProgress />
      </Stack>
    );
  }

  if (isError) {
    return (
      <>
        <Typography variant="h5" textAlign={"center"} mb={2}>
          List of Items
        </Typography>
        <EmptyOrErrorState text="An occurred while fetching items 😕" />
      </>
    );
  }
  let index = 0;
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
          List of Items
        </Typography>
      </Stack>
      {items?.map((individualItem) => {
        if (individualItem?.items && individualItem?.items?.length > 0) {
          index += 1;
        }
        return (
          <>
            {individualItem?.items && individualItem?.items?.length > 0 ? (
              <Accordion key={individualItem._id} elevation={0} square>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1a-content"
                  id="panel1a-header"
                >
                  <Grid container>
                    <Grid item xs={4}>
                      <Stack
                        direction={"row"}
                        alignItems="center"
                        sx={{
                          width: "100%",
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "text.secondary",
                          }}
                          variant="body1"
                        >
                          #
                        </Typography>
                        <Typography variant="body1" fontWeight={"bold"} ml={1}>
                          {/* {individualItem.serialNumber} */}
                          {index}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={8}>
                      <Stack
                        direction={"row"}
                        alignItems="center"
                        sx={{
                          width: "100%",
                          flexShrink: 0,
                        }}
                      >
                        <Typography
                          sx={{
                            color: "text.secondary",
                          }}
                          variant="body1"
                        >
                          Item Category:
                        </Typography>
                        <Typography variant="body1" fontWeight={"bold"} ml={1}>
                          {individualItem.categoryName}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                </AccordionSummary>

                <AccordionDetails>
                  <Grid
                    container
                    rowSpacing={3}
                    spacing={4}
                    sx={{ marginTop: 3, marginBottom: 3 }}
                    direction="row"
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    <Grid item xs={1}>
                      <Typography fontWeight={"bold"}>Item SN</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography fontWeight={"bold"}>Item Name</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography fontWeight={"bold"}>Item brand/quality</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography fontWeight={"bold"} textAlign={"center"}>
                        Item photo
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography fontWeight={"bold"}>buying price/unit</Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography fontWeight={"bold"}>selling price/unit</Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <Typography fontWeight={"bold"}>Actions</Typography>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    rowSpacing={3}
                    spacing={4}
                    direction="row"
                    alignItems="center"
                    justifyContent={"center"}
                  >
                    {individualItem.items.map((innerItem) => {
                      return (
                        <React.Fragment key={innerItem.itemId}>
                          <Grid item xs={1}>
                            <Typography sx={{ wordBreak: "break-all" }}>
                              {innerItem.itemSerialNumber}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography sx={{ wordBreak: "break-all" }}>
                              {innerItem.itemName}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography sx={{ wordBreak: "break-all" }}>
                              {innerItem.brandOrQualityName &&
                                innerItem.brandOrQualityName?.length > 0
                                ? innerItem.brandOrQualityName
                                : "-"}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Tooltip title="Click to see description" arrow>
                              <img
                                src={innerItem.itemPhoto || ""}
                                alt="item"
                                style={{
                                  width: "150px",
                                  height: "150px",
                                  objectFit: "contain",
                                  cursor: "pointer",
                                }}
                                onClick={() => {
                                  setOpen(true);
                                  setChosenItemPhoto(innerItem.itemPhoto);
                                  setChosenItemDescription(innerItem.description);
                                }}
                              />
                            </Tooltip>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography sx={{ wordBreak: "break-all" }}>
                              {currency} {innerItem.buyingPrice} /{" "}
                              {innerItem.itemUnitCoefficient > 1
                                ? innerItem.itemUnitCoefficient
                                : ""}{" "}
                              {innerItem.unit}
                            </Typography>
                          </Grid>
                          <Grid item xs={2} style={{
                            display: 'flex',
                            paddingLeft: '20px'
                          }}>
                            <Typography sx={{ wordBreak: "break-all" }}>
                              {currency} {innerItem.price} /{" "}
                              {innerItem.itemUnitCoefficient > 1
                                ? innerItem.itemUnitCoefficient
                                : ""}{" "}
                              {innerItem.unit}
                            </Typography>
                          </Grid>
                          <Grid item xs={1}
                            style={{
                              display: 'flex',
                              paddingLeft: '20px'
                            }}>
                            <IconButton
                              onClick={() => editItemHandler(individualItem, innerItem)}
                            >
                              <ModeEditOutlineIcon fontSize="medium" />
                            </IconButton>
                            <IconButton
                              onClick={() =>
                                deleteItemHandler(
                                  innerItem.itemCategory,
                                  innerItem.itemId,
                                  innerItem.itemWrapperId
                                )
                              }
                            >
                              <DeleteIcon fontSize="medium" />
                            </IconButton>
                          </Grid>
                        </React.Fragment>
                      );
                    })}
                  </Grid>
                  {/* </Box> */}
                </AccordionDetails>
              </Accordion>
            ) : null}
          </>
        );
      })}
      {open && (
        <ImageViewDialog
          open={open}
          handleClose={() => {
            setOpen(false);
            setChosenItemPhoto(null);
          }}
          imgSrc={chosenItemPhoto || ""}
          itemDescription={chosenItemDescription || ""}
        />
      )}
      {openEditDialog && chosenItem && (
        <EditListedItemDialog
          open={openEditDialog}
          handleClose={() => {
            setOpenEditDialog(false);
            setChosenItem(null);
          }}
          categoryName={chosenItem?.categoryName || ""}
          _id={chosenItem?._id || ""}
          serialNumber={chosenItem?.serialNumber || 1}
          itemSerialNumber={chosenItem?.itemSerialNumber || 1}
          itemWrapperId={chosenItem?.itemWrapperId || ""}
          itemId={chosenItem?.itemId || ""}
          itemName={chosenItem?.itemName || ""}
          isBrandOrQuality={chosenItem?.isBrandOrQuality || false}
          itemPhoto={chosenItem?.itemPhoto || ""}
          itemUnitCoefficient={chosenItem?.itemUnitCoefficient || 1}
          buyingPrice={chosenItem?.buyingPrice || 1}
          description={chosenItem?.description || ""}
          adminNote={chosenItem?.adminNote || ""}
          price={chosenItem?.price || 1}
          unit={chosenItem?.unit || ""}
          acceptDecimal={chosenItem?.acceptDecimal || false}
          brandOrQualityName={chosenItem?.brandOrQualityName || ""}
          lastSerialNumber={lastSerialNumber || 0}
          lastItemSerialNumber={chosenItem?.lastItemSerialNumber || 0}
          minimumQuantity={chosenItem?.minimumQuantity || ""}
          getListedItems={getListedItems}
        />
      )}
    </Container>
  );
}

export default ListOfItemsCards;
