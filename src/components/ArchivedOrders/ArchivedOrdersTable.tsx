import FileDownloadIcon from "@mui/icons-material/FileDownload";
import {
  Button,
  CircularProgress,
  Pagination,
  Paper,
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
import { IArchivedOrdersList } from "../../types/appTypes";
// import { format } from "path";
import { format } from "date-fns";
import moment from "moment-timezone";

function ArchivedOrdersTable({
  archivedOrdersPage,
  archivedOrders,
  downloadIndividualArchivedOrdersHandler,
  isPdfGenerationInProgress,
  totalPages,
  currentPage,
  goToPage,
  setGoToPage,
  getPageData,
  handlePaginationChange,
  downloadId,
}: {
  archivedOrders: IArchivedOrdersList[];
  downloadIndividualArchivedOrdersHandler: (
    date: string,
    date1: string
  ) => void;
  isPdfGenerationInProgress: boolean;
  archivedOrdersPage: boolean;
  totalPages: number;
  currentPage: number;
  goToPage: number;
  setGoToPage: any;
  getPageData: any;
  handlePaginationChange: any;
  downloadId: any;
}) {

  const loadUserTabIdentifier = localStorage.getItem("uniqueTabIdentifier") || "";

  const targetTimeZone = sessionStorage.getItem(`timezone`) ||
    localStorage.getItem(`timezone_${loadUserTabIdentifier}`);

  // const targetTimeZone = `${localStorage.getItem("timezone")}`;
  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" sx={{ fontWeight: 600 }}>
                Orders
              </TableCell>

              {/* <TableCell align="center" sx={{ fontWeight: 600 }}>
              Actions
            </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {archivedOrders.length > 0 &&
              archivedOrders.map((archivedOrder) => (
                // archivedOrder._id.archive==true?
                <TableRow
                  key={archivedOrder._id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                      {!archivedOrdersPage
                        ? `Ordered Items (${archivedOrder._id})`
                        : `user order (printing time: ${archivedOrder._id})`}
                      <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        // disabled={!showDownloadButton || isDownloadPdfLoading}
                        disabled={
                          isPdfGenerationInProgress &&
                          downloadId === archivedOrder._id
                        }
                        endIcon={
                          isPdfGenerationInProgress ? (
                            <CircularProgress size={16} />
                          ) : null
                        }
                        onClick={(e: any) => {
                          e.stopPropagation();
                          downloadIndividualArchivedOrdersHandler &&
                            downloadIndividualArchivedOrdersHandler(
                              archivedOrder._id,
                              `${new Date(archivedOrder._id)}`
                            );
                        }}
                      >
                        Download
                      </Button>
                    </Stack>
                  </TableCell>
                  {/* <TableCell component={"th"} scope="row">
                  <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    // disabled={!showDownloadButton || isDownloadPdfLoading}
                    disabled={isPdfGenerationInProgress}
                    endIcon={
                      isPdfGenerationInProgress ? (
                        <CircularProgress size={16} />
                      ) : null
                    }
                    onClick={(e: any) => {
                      e.stopPropagation();
                      downloadIndividualArchivedOrdersHandler &&
                        downloadIndividualArchivedOrdersHandler(
                          archivedOrder._id
                        );
                    }}
                  >
                    Download
                  </Button>
                </TableCell> */}

                  {/* <TableCell align="center">
                  <Button variant="outlined" startIcon={<FileDownload />}>
                    Download
                  </Button>
                </TableCell> */}
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack width={"100%"} my={8}>
        <Pagination
          className="justify-self-end"
          count={
            Math.ceil(totalPages / 6) === 0 ? 1 : Math.ceil(totalPages / 6)
          }
          page={currentPage}
          variant="outlined"
          color="primary"
          sx={{ display: "flex", justifyContent: "center" }}
          onChange={handlePaginationChange}
        />
        <Typography
          variant="caption"
          component={"h2"}
          alignSelf={"flex-start"}
          width={"50%"}
        >
          Go to page:{" "}
          <TextField
            id="pageNumber"
            variant="standard"
            size="small"
            hiddenLabel
            type="number"
            name="pageNumber"
            value={goToPage}
            InputProps={{
              inputProps: {
                min: 1,
                max:
                  Math.ceil(totalPages / 6) === 0
                    ? 1
                    : Math.ceil(totalPages / 6),
              },
            }}
            onChange={(e) => {
              setGoToPage(parseInt(e.target.value));
            }}
            style={{ width: "10%" }}
          />
          <Button
            variant="contained"
            style={{ marginLeft: "2%" }}
            onClick={async () => {
              getPageData(goToPage);
            }}
          >
            Go
          </Button>
        </Typography>
        <Typography variant="caption" component={"h2"} alignSelf={"flex-end"}>
          Showing page {currentPage} of{" "}
          {Math.ceil(totalPages / 6) === 0 ? 1 : Math.ceil(totalPages / 6)}{" "}
          pages
        </Typography>
      </Stack>
    </>
  );
}

export default ArchivedOrdersTable;
