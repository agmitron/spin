import {
  TableContainer,
  Paper,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Table,
} from "@mui/material";
import { IOrder } from '../../types';
import { formatNearExponential } from "../../utils";

interface Props {
  orders: IOrder[]
}

const OrdersTable: React.FC<Props> = ({ orders }) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>
              <b>Price</b>
            </TableCell>
            <TableCell>
              <b>Quantity</b>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map(({ price, quantity }, index) => {
            return (
              <TableRow key={index}>
                <TableCell color="green">
                  {formatNearExponential(price)}
                </TableCell>
                <TableCell color="green">
                  {formatNearExponential(quantity)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
