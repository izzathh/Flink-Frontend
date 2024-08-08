import React, { useCallback, useEffect, useState } from "react";
import { IArchivedOrdersList, IOrdersList } from "../../types/appTypes";
import { TokenConfig, useAppData } from "../../context/AppContext";
import axios from "axios";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import OrderedItemsTable from "../../components/Orders/OrderedItemsTable";
import { useSnackbar } from "notistack";
import { decimalCalculation } from "../../utils/decimalCalc";
import { useConfirm } from "material-ui-confirm";

import visibleTodayOrder from "../TodaysOrders/index";
import ArchivedOrdersTable from "../../components/ArchivedOrders/ArchivedOrdersTable";

function OrderedItems() {
  const [orderedItems, setOrderedItems] = useState<IOrdersList[] | null>(null);
  const [todayOrderedItems, setTodayOrderedItems] = useState<
    IOrdersList[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isDownloadPdfLoading, setIsDownloadPdfLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const { baseUrl, state, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();
  const [visibleCall, setVisibleCall] = useState(false);
  const [isPdfGenerationInProgress, setIsPdfGenerationInProgress] =
    useState(false);
  const [downloadId, setDownloadId] = useState("");
  const [currency, setCurrency] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [amPm, setAmPm] = useState("AM");
  const [autoarchive, setAutoarchive] = useState(false);
  const confirm = useConfirm();
  const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";
  const targetAdminType = sessionStorage.getItem(`adminType`) ||
    localStorage.getItem(`adminType_${loadUserTabIdentifier}`);

  const getOrderedItems = useCallback(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${baseUrl}/order/admin/get-ordered-items?adminType=${targetAdminType}`,
          TokenConfig(tabIdentifier)
        );
        // await axios.get(
        //   `${baseUrl}/cron`,
        //   TokenConfig(tabIdentifier)
        // );
        setOrderedItems(data.items);
        setHours(data.autoArchiveTime.hours);
        setMinutes(data.autoArchiveTime.minutes);
        setAmPm(data.autoArchiveTime.amPm);
        setShowDownloadButton(data.showDownloadButton);
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    })();
  }, [baseUrl, visibleCall]);

  useEffect(() => {
    getOrderedItems();
  }, [getOrderedItems]);

  const getTodayOrderedItems = useCallback(() => {
    (async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${baseUrl}/order/admin/get-today-ordered-items?adminType=${targetAdminType}`,
          TokenConfig(tabIdentifier)
        );
        setCurrency(data.currency)
        setTodayOrderedItems(data.items);
        setShowDownloadButton(data.showDownloadButton);
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
        setIsError(true);
      }
    })();
  }, [baseUrl, visibleCall]);

  useEffect(() => {
    getTodayOrderedItems();
  }, [getTodayOrderedItems]);

  const downloadIndividualTodaysOrdersHandler = async (_id: string, orderDate: string) => {
    try {
      setDownloadId(_id);
      setIsPdfGenerationInProgress(true);
      const { data } = await axios.post(
        `${baseUrl}/generate-pdf/get-todays-items-print-admin`,
        { _id: _id, archivedOrderDate: orderDate },
        TokenConfig(tabIdentifier)
      );

      console.log('pdfLocation:', data.pdfLocation.data);

      const uint8Array = new Uint8Array(data.pdfLocation.data);

      const blob = new Blob([uint8Array], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      setDownloadLink(url);

      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // setDownloadLink(data.pdfLocation);
      // window.open(data.pdfLocation, "_blank");

      setIsPdfGenerationInProgress(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("an error occurred while genrating pdf", {
        variant: "error",
      });
      setIsPdfGenerationInProgress(false);
    }
  };

  const visibleTodayOrder = async () => {
    try {
      if (orderedItems != null) {
        const today = new Date();
        const startOfToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          0,
          0,
          0,
          0
        );
        const endOfToday = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          23,
          59,
          59,
          999
        );

        const ans = await axios.post(
          `${baseUrl}/order/admin/edit-orders-list`,
          {
            autoArcive: false,
            filter: {
              user: `${orderedItems[0]?.user}`,
              createdAt: {
                $gte: startOfToday.toISOString(),
                $lte: endOfToday.toISOString(),
              },
            },
            update: {
              archive: true,
            },
          },
          TokenConfig(tabIdentifier)
        );
        setVisibleCall(true);
      }
    } catch (error) {
      console.log("visibleTodayOrder error>>", error);
    }
  };

  const downloadOrderedItemsHandler = async () => {
    try {
      setIsDownloadPdfLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/generate-pdf/ordered-items`,
        TokenConfig(tabIdentifier)
      );

      const uint8Array = new Uint8Array(data.pdfLocation.data);

      const blob = new Blob([uint8Array], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      setDownloadLink(url);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = data.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // setDownloadFileName(data.fileName);
      // window.open(url, '_blank');      
      // setDownloadLink(data.pdfLocation);
      // window.open(data.pdfLocation, "_blank");
      setIsDownloadPdfLoading(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("an error occurred while genrating pdf", {
        variant: "error",
      });
      setIsDownloadPdfLoading(false);
    }
  };

  // const autoArchiveTimeSave = async () => {
  //   try {
  //     setAutoarchive(false);
  //     const data = await axios.post(
  //       `${baseUrl}/common-fields/admin/auto-archive-time`,
  //       {
  //         hours,
  //         minutes,
  //         amPm,
  //       },
  //       TokenConfig(tabIdentifier)
  //     );
  //     await axios.post(
  //       `${baseUrl}/cron`,
  //       TokenConfig(tabIdentifier)
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError && !isLoading) {
    return (
      <EmptyOrErrorState text="Oops,an error occurred while fetching today's ordered items 😕" />
    );
  }

  if (
    orderedItems &&
    orderedItems?.length === 0 &&
    !isLoading &&
    todayOrderedItems?.length === 0
  ) {
    return (
      <EmptyOrErrorState text="Unfortunately, No ordered items today 😕" />
    );
  }

  if (state && state?.user?.adminType === "printing") {
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
            Today's Ordered Items
          </Typography>
        </Stack>
        <Stack
          flexDirection={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          my={8}
        >
          <Button
            variant="contained"
            startIcon={<FileDownloadIcon />}
            onClick={downloadOrderedItemsHandler}
            disabled={!showDownloadButton || isDownloadPdfLoading}
            endIcon={
              isDownloadPdfLoading ? <CircularProgress size={16} /> : null
            }
          >
            Download all as ZIP
          </Button>
        </Stack>
        <Stack
          // flexDirection={"row"}
          // justifyContent={"space-between"}
          flexWrap={"wrap"}
          flex={1}
          rowGap={4}
        >
          {
            <>
              <TableContainer component={Paper} variant="outlined">
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left" sx={{ fontWeight: 600 }}>
                        Orders
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {todayOrderedItems != null &&
                      todayOrderedItems?.length > 0 &&
                      todayOrderedItems.map((todaysOrder) => (
                        // archivedOrder._id.archive==true?
                        <TableRow
                          key={todaysOrder._id}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            component="th"
                            scope="row"
                            sx={{ fontWeight: "bold" }}
                          >
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              justifyContent={"space-between"}
                            >
                              User Orders
                              {/* User Orders ({format(utcToZonedTime(new Date(archivedOrder._id).setHours(23, 59, 59, 999), targetTimeZone), 'dd-MM-yyyy hh:mm:ss-a')}) */}
                              <Button
                                variant="contained"
                                startIcon={<FileDownloadIcon />}
                                // disabled={!showDownloadButton || isDownloadPdfLoading}
                                disabled={
                                  isPdfGenerationInProgress &&
                                  downloadId === todaysOrder._id
                                }
                                endIcon={
                                  isPdfGenerationInProgress ? (
                                    <CircularProgress size={16} />
                                  ) : null
                                }
                                onClick={(e: any) => {
                                  e.stopPropagation();
                                  downloadIndividualTodaysOrdersHandler &&
                                    downloadIndividualTodaysOrdersHandler(
                                      // `${utcToZonedTime(new Date(archivedOrder._id).setHours(23, 59, 59, 999), targetTimeZone)}`,
                                      `${todaysOrder._id}`,
                                      `${todaysOrder.archivedAt}`
                                    );
                                }}
                              >
                                Download
                              </Button>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </>
          }
        </Stack>
      </Container>
    );
  }

  const flatOrderedItems = orderedItems?.map((orderedItem) =>
    orderedItem.items.map((item) => Number(item.buyingPrice) * item.quantity / item.itemUnitCoefficient)
  );

  const grandTotal = flatOrderedItems
    ?.flat()
    .reduce((acc, prev) => acc + prev, 0);

  const finalGrandTotal = grandTotal ? decimalCalculation(grandTotal) : ""

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
          Today's Ordered Items
        </Typography>
      </Stack>

      {downloadLink && !isDownloadPdfLoading && state && state?.user?.adminType === "super" && (
        <Stack
          flexDirection={"row"}
          justifyContent={"flex-end"}
          alignItems={"center"}
          mb={4}
        >
          <Typography
            variant="caption"
            component={"a"}
            href={downloadLink || ""}
            target="_blank"
            rel="noreferrer noopener"
          >
            {downloadLink}
          </Typography>
        </Stack>
      )}

      <Stack
        // flexDirection={"row"}
        // justifyContent={"space-between"}
        flexWrap={"wrap"}
        flex={1}
        rowGap={4}
      >
        {orderedItems && orderedItems.length > 0 && (
          <OrderedItemsTable currency={currency} orderedItems={orderedItems} />
        )}
      </Stack>

      <Typography textAlign={"right"} mt={2} fontWeight={"bold"}>
        Grand Total: {orderedItems && orderedItems[0]?.currency || ""}{finalGrandTotal}
      </Typography>
    </Container>
  );
}

export default OrderedItems;
