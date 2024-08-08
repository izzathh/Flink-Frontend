import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { IOrderedItems } from "../../types/appTypes";
import { decimalCalculation } from "../../utils/decimalCalc";
// #
// Item category
// Item name
// Item brand/quality
// Price/unit
// Units ordered
// Total price
function OrderItemTable({
  items,
  currency,
}: {
  currency: string;
  items: IOrderedItems[];
}) {
  console.log('items:', items);

  return (
    <TableContainer component={Paper} variant="outlined">
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {/* <TableCell sx={{ fontWeight: 600 }}>Sr.no</TableCell> */}
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Item category
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Item name
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Brand/quality
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Price/unit
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Units ordered
            </TableCell>
            <TableCell align="left" sx={{ fontWeight: 600 }}>
              Price
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.itemId}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {item.categoryName}
              </TableCell>
              <TableCell align="left">{item.itemName}</TableCell>
              <TableCell align="left">{item.brandOrQualityName}</TableCell>
              <TableCell align="left">
                {currency}{item.price} /{" "}
                {item.itemUnitCoefficient === 1 ? "" : item.itemUnitCoefficient}{" "}
                {item.unit}
              </TableCell>
              <TableCell align="left">{item.quantity} {item.unit}</TableCell>
              <TableCell align="left">{currency}{decimalCalculation(item.totalPrice)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrderItemTable;
