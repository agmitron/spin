import { AppBar, Toolbar, Grid, Typography, Button } from "@mui/material";
import { useStore } from "effector-react";
import {
  signInButtonClicked,
  signOutButtonClicked,
  $account,
  $balance,
  $walletConnection,
} from "../../store";
import { formatNear } from "../../utils";

const Header = () => {
  const walletConnection = useStore($walletConnection);
  const account = useStore($account);
  const balance = useStore($balance);

  const isSignedIn = walletConnection?.isSignedIn() ?? false;

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          alignContent="center"
        >
          <Grid item>
            <Typography variant="h6" component="h6">
              Spin Test Challenge
            </Typography>
          </Grid>
          {isSignedIn && account && balance && (
            <>
              <Grid item>
                <Typography variant="body1" component="p">
                  Address: {account.accountId}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1" component="p">
                  Balance: {formatNear(balance.available)}
                </Typography>
              </Grid>
            </>
          )}
          <Grid item>
            {!isSignedIn ? (
              <Button color="inherit" onClick={() => signInButtonClicked()}>
                Sign In
              </Button>
            ) : (
              <Button color="inherit" onClick={() => signOutButtonClicked()}>
                Sign Out
              </Button>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
