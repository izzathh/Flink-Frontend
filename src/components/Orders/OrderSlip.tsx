import {
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
  TextField
} from "@mui/material";
import axios from "axios";
import { useConfirm } from "material-ui-confirm";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { TokenConfig, baseUrl, useAppData } from "../../context/AppContext";
import { IOrdersList } from "../../types/appTypes";
import FullScreenLoader from "../common/FullScreenLoader";
import OrderItemTable from "./OrderItemTable";
import { decimalCalculation } from "../../utils/decimalCalc";
function OrderSlip({
  order,
  getOrders,
  index,
  searchString,
}: {
  order: IOrdersList;
  getOrders: (offset: number, search: string) => void;
  index: number;
  searchString: string;
}) {
  const confirm = useConfirm();
  const { enqueueSnackbar } = useSnackbar();
  const { tabIdentifier } = useAppData();
  const [deleteOrderLoading, setDeleteOrderLoading] = useState(false);

  const onDeleteOrderClick = async () => {
    confirm({
      title: "Delete Order?",
      description: "Are you sure you want to delete this order?",
      confirmationText: "yes",
      cancellationText: "cancel",
      confirmationButtonProps: {
        disabled: deleteOrderLoading,
      },
    })
      .then(async () => {
        try {
          setDeleteOrderLoading(true);
          await axios.delete(
            `${baseUrl}/order/admin/${order._id}/delete-order`,
            TokenConfig(tabIdentifier)
          );
          await getOrders(1, searchString);
          setDeleteOrderLoading(false);
          enqueueSnackbar("order deleted successfully", { variant: "success" });
        } catch (error) {
          console.error(error);
          enqueueSnackbar("an error occurred", { variant: "error" });
          setDeleteOrderLoading(false);
        }
      })
      .catch(() => { });
  };

  if (deleteOrderLoading) {
    return <FullScreenLoader />;
  }
  console.log('order:', order.deliveryCharge);
  const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  const isValidUrl = urlRegex.test(order.user.googleMapLocation)

  return (
    <Card variant="outlined" sx={{ p: 2, borderRadius: 3 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {/* Order Number: {order.orderNumber} */}
          Order Number: {order.orderNumber}
        </Typography>
        <Typography variant="h5" component="div">
          {order.user.name}
        </Typography>
        <Typography color="text.secondary" mb={1} mt={1}>
          Email : {order.user.email}
        </Typography>
        <Stack flexDirection={"row"} alignItems={"center"} columnGap={1} mb={1}>
          <Typography color="text.secondary">Google map location:</Typography>
          {isValidUrl ? (
            <Typography
              variant="body2"
              component={"a"}
              href={order.user.googleMapLocation}
              target={"_blank"}
              rel="noreferrer noopener"
              color={"primary"}
            >
              click here
            </Typography>

          ) : (
            <Typography>
              {order.user.googleMapLocation}
            </Typography>
          )}
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} columnGap={1} mt={1}>
          <Typography color="text.secondary">House #: </Typography>
          <Typography variant="body2">{order.user.houseNumber}</Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} columnGap={1} mt={1}>
          <Typography color="text.secondary">Street #: </Typography>
          <Typography variant="body2">{order.user.streetAddress}</Typography>
        </Stack>

        <Stack flexDirection={"row"} alignItems={"center"} columnGap={1} mt={1}>
          <Typography color="text.secondary">Phone Number: </Typography>
          <Typography variant="body2">{order.user.phoneNumber}</Typography>
        </Stack>

        <Typography my={2} color="text.secondary">
          Items Ordered
        </Typography>
        <OrderItemTable items={order.items} currency={order.currency || ""} />
        <Typography textAlign={"right"} mt={2} fontWeight={"bold"}>
          Delivery Charge: {order.currency || ""}{decimalCalculation(order.deliveryCharge || 0.00)}
        </Typography>
        <Typography textAlign={"right"} mt={2} fontWeight={"bold"}>
          Net Total: {order.currency || ""}{decimalCalculation(order.grandTotal)}
        </Typography>
        <Typography textAlign={"right"} mt={2} fontWeight={"bold"}>
          Transaction ID: {order.transactionId || 'No transaction ID'}
        </Typography>
        {/* <div style={{ textAlign: 'right', marginTop: '25px' }}>
          <TextField
            variant="outlined"
            multiline
            label={'Transaction ID'}
            rows={1}
            InputProps={{
              readOnly: true,
              style: { overflowX: 'auto', whiteSpace: 'nowrap', padding: '10px' },
            }}
            value={order.transactionId || 'No transaction ID'}
          />
        </div> */}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          color="error"
          variant="outlined"
          onClick={onDeleteOrderClick}
          sx={{ ml: 1 }}
        >
          Delete Order
        </Button>
      </CardActions>
    </Card>
  );
}

export default OrderSlip;
