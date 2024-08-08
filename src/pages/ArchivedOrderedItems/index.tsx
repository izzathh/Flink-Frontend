import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Button,
  CircularProgress,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import ArchivedOrdersTable from "../../components/ArchivedOrders/ArchivedOrdersTable";
import EmptyOrErrorState from "../../components/common/EmptyOrErrorState";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { TokenConfig, useAppData } from "../../context/AppContext";
import { IArchivedOrdersList } from "../../types/appTypes";

function ArchivedOrderedItems() {
  const [archivedOrders, setArchivedOrders] = useState<
    IArchivedOrdersList[] | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);
  const [goToPage, setGoToPage] = useState(1);
  const [searchString, setSearchString] = useState("");
  const [searchDateValue, setSearchDateValue] = useState("");
  const [downloadId, setDownloadId] = useState("");
  const [downloadFileName, setDownloadFileName] = useState("");
  const [downloadZipFileName, setDownloadZipFileName] = useState("");
  const [isDownloadPdfLoading, setIsDownloadPdfLoading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [isPdfGenerationInProgress, setIsPdfGenerationInProgress] =
    useState(false);
  const { baseUrl, state, tabIdentifier } = useAppData();
  const { enqueueSnackbar } = useSnackbar();

  const getArchivedOrders = useCallback(
    (offset: number, search: string) => {
      (async () => {
        try {
          setIsLoading(true);
          const { data } = await axios.get(
            `${baseUrl}/order/admin/get-archived-orders-dates?page=${offset}&limit=6&searchString=${search}`,
            TokenConfig(tabIdentifier)
          );
          setArchivedOrders(data.orders);
          setShowDownloadButton(data.showDownloadButton);
          setTotalPages(data.totalPages);

          setIsLoading(false);
          setIsError(false);
        } catch (error) {
          console.error(error);
          setIsLoading(false);
          setIsError(true);
        }
      })();
    },
    [baseUrl]
  );

  const handlePaginationChange = async (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    const newPage = value;
    await getArchivedOrders(newPage, searchString);
    setPage(newPage);
  };

  const goToSpecoficPage = async (pageNumber: number) => {
    await getArchivedOrders(pageNumber, searchString);
    setPage(pageNumber);
  };

  useEffect(() => {
    getArchivedOrders(1, searchString);
  }, [getArchivedOrders]);

  const downloadArchivedOrderedItemsHandler = async () => {
    try {
      setIsDownloadPdfLoading(true);
      const { data } = await axios.get(
        `${baseUrl}/generate-pdf/archived-ordered-items`,
        TokenConfig(tabIdentifier)
      );
      // setDownloadZipFileName(data.fileName);
      setDownloadLink(data.pdfLocation);
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
      setIsDownloadPdfLoading(false);
    } catch (error) {
      console.error(error);
      enqueueSnackbar("an error occurred while genrating pdf", {
        variant: "error",
      });
      setIsDownloadPdfLoading(false);
    }
  };

  const downloadIndividualArchivedOrdersHandler = async (
    date: string,
    date1: string
  ) => {
    try {
      setDownloadId(date);
      setIsPdfGenerationInProgress(true);

      const { data } = await axios.post(
        `${baseUrl}/generate-pdf/get-archived-ordered-items-by-date`,
        { archivedOrderDate: date, date1: date1 },
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
      setIsPdfGenerationInProgress(false);
      // window.open(data.pdfLocation, "__blank");
    } catch (error) {
      console.error(error);
      enqueueSnackbar("an error occurred while genrating pdf", {
        variant: "error",
      });
      setIsPdfGenerationInProgress(false);
    }
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (isError && !isLoading) {
    return (
      <EmptyOrErrorState text="Oops,an error occurred while fetching archived ordered items 😕" />
    );
  }

  if (archivedOrders && archivedOrders?.length === 0 && !isLoading) {
    return <EmptyOrErrorState text="Archived orders is empty 😕" />;
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
          Archived Ordered Items
        </Typography>
      </Stack>

      <Stack
        flexDirection={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        mb={4}
      >
        <Stack flexDirection={"row"}>
          <TextField
            id="searchString"
            variant="outlined"
            // label="Search"
            // placeholder="Search order by user's name, email or order number"
            type="date"
            name="searchString"
            value={searchDateValue}
            onChange={(e) => {
              console.log("e.target.value :>> ", e.target.value);
              const formatVal = e.target.value.split('-')
              setSearchDateValue(e.target.value)
              setSearchString(`${formatVal[2]}/${formatVal[1]}/${formatVal[0]}`);
            }}
          />
          <Button
            variant="contained"
            style={{ marginLeft: "2%" }}
            onClick={async () => {
              await getArchivedOrders(1, searchString);
              setPage(1);
            }}
          >
            Search
          </Button>
        </Stack>
        <Button
          variant="contained"
          startIcon={<FileDownloadIcon />}
          // disabled={!showDownloadButton || isDownloadPdfLoading}
          disabled={isDownloadPdfLoading}
          endIcon={isDownloadPdfLoading ? <CircularProgress size={16} /> : null}
          onClick={downloadArchivedOrderedItemsHandler}
        >
          Download all as ZIP
        </Button>
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
            href="#"
            onClick={() => {
              const url = downloadLink;
              const filename = downloadFileName;
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }}
          >
            {downloadFileName}
          </Typography>
          {downloadFileName === "" && (
            <Typography
              variant="caption"
              component={"a"}
              href={downloadLink}
              target="_blank"
              rel="noreferrer noopener"
            >
              {downloadZipFileName}
            </Typography>
          )}
        </Stack>
      )}

      <Stack
        // flexDirection={"row"}
        // justifyContent={"space-between"}
        flexWrap={"wrap"}
        flex={1}
        rowGap={4}
      >
        <ArchivedOrdersTable
          archivedOrdersPage={false}
          archivedOrders={archivedOrders || []}
          isPdfGenerationInProgress={isPdfGenerationInProgress}
          downloadIndividualArchivedOrdersHandler={
            downloadIndividualArchivedOrdersHandler
          }
          totalPages={totalPages}
          currentPage={page}
          goToPage={goToPage}
          setGoToPage={setGoToPage}
          getPageData={goToSpecoficPage}
          handlePaginationChange={handlePaginationChange}
          downloadId={downloadId}
        />
      </Stack>
    </Container>
  );
}

export default ArchivedOrderedItems;
