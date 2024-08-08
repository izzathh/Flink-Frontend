import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { IOrdersList } from "../../types/appTypes";
import { decimalCalculation } from "../../utils/decimalCalc";

type Item = {
  itemId: string;
  categoryName: string;
  itemName: string;
  brandOrQualityName?: string;
  price: number;
  itemUnitCoefficient: number;
  currency: string;
  unit: string;
  quantity: number;
  totalPrice: number;
  buyingPrice: string;
};

function OrderedItemsTable({ orderedItems, currency }: { orderedItems: IOrdersList[], currency: string }) {
  const [consolidatedItems, setConsolidatedItems] = useState<Item[]>([]);

  useEffect(() => {
    // Function to consolidate items
    const consolidateItems = () => {
      const consolidatedItems: Item[] = [];

      orderedItems.forEach((orderedItem) => {
        orderedItem.items.forEach((item) => {
          const existingItem = consolidatedItems.find(
            (consolidatedItem) => consolidatedItem.itemName === item.itemName
          );
          if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.currency = existingItem.currency;
            existingItem.totalPrice += (item.quantity * Number(item.buyingPrice) / item.itemUnitCoefficient)
          } else {
            consolidatedItems.push({ ...item, currency: orderedItem.currency });
          }
        });
      });

      setConsolidatedItems(consolidatedItems);
    };

    consolidateItems();
  }, [orderedItems]);

  console.log('consolidatedItems:', consolidatedItems);

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
          {consolidatedItems.map((item) => (
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
                {item.currency || ""}{item.buyingPrice} /{" "}
                {item.itemUnitCoefficient === 1 ? "" : item.itemUnitCoefficient}{" "}
                {item.unit}
              </TableCell>
              <TableCell align="left">
                {item.quantity} {item.unit}
              </TableCell>
              <TableCell align="left">{item.currency || ""}{decimalCalculation(Number(item.buyingPrice) * item.quantity / item.itemUnitCoefficient)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrderedItemsTable;
