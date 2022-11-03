import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import {
  $markets,
  $orderBook,
  $selectedMarket,
  $walletConnection,
  getMarketsFx,
  marketSelected,
} from "../../store";
import { useStore } from "effector-react";
import { filterChanged, Filter, $filter } from "../../store/ui";
import { stringifyMarket } from "../../utils";
import OrdersTable from "../OrdersTable";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const boxStyles = {
  margin: "30px auto",
  display: "flex",
  flexDirection: "column",
  rowGap: "20px",
};

const Dashboard = () => {
  const areMarketsLoading = useStore(getMarketsFx.pending);
  const walletConnection = useStore($walletConnection);
  const markets = useStore($markets);
  const selectedMarket = useStore($selectedMarket);
  const orderBook = useStore($orderBook);
  const filter = useStore($filter);

  const isSignedIn = walletConnection?.isSignedIn() ?? false;

  if (!isSignedIn) {
    return (
      <Box sx={{ ...boxStyles, textAlign: "center" }}>
        <Typography variant="h3">
          Authenticate with your NEAR wallet.
        </Typography>
      </Box>
    );
  }

  if (areMarketsLoading) {
    return (
      <Box sx={boxStyles}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ ...boxStyles, maxWidth: "min-content" }}>
      <Typography variant="h3">
        {areMarketsLoading ? "Loading..." : "Markets"}
      </Typography>
      <FormControl fullWidth>
        <InputLabel id="markets">Markets</InputLabel>
        <Select
          label="Market"
          labelId="markets"
          value={selectedMarket ? selectedMarket.id : ""}
          onChange={({ target: { value: marketId } }) =>
            marketSelected(+marketId)
          }
        >
          {markets.map((market) => (
            <MenuItem key={market.id} value={market.id}>
              {stringifyMarket(market)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={filter}
          onChange={(_, value) => filterChanged(value)}
          aria-label="basic tabs example"
        >
          <Tab label="Ask" {...a11yProps(0)} />
          <Tab label="Bid" {...a11yProps(1)} />
        </Tabs>
      </Box>
      {filter === Filter.Ask && <OrdersTable orders={orderBook.ask_orders} />}
      {filter === Filter.Bid && <OrdersTable orders={orderBook.bid_orders} />}
    </Box>
  );
};

export default Dashboard;
