import React from "react";
import { Buffer } from "buffer";
import { useStore } from "effector-react";
import { utils } from "near-api-js";
import { AppBar, Toolbar, Typography, Button, Grid } from "@mui/material";
import {
  $account,
  $balance,
  $walletConnection,
  signInButtonClicked,
  signOutButtonClicked,
} from "./store";
import { formatNear } from './utils';

window.Buffer = window.Buffer || Buffer;

function App() {
  const walletConnection = useStore($walletConnection);
  const account = useStore($account);
  const balance = useStore($balance);

  return (
    <main>
      <AppBar position="static">
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <Typography variant="h6" component="h6">
                Spin Test Challenge
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="body1" component="p">
                Address: {account?.accountId}
              </Typography>
            </Grid>
            <Grid item>
              {balance && (
                <Typography variant="body1" component="p">
                  Balance: {formatNear(balance.available)}
                </Typography>
              )}
            </Grid>
          </Grid>
          {!walletConnection?.isSignedIn() ? (
            <Button color="inherit" onClick={() => signInButtonClicked()}>
              Sign In
            </Button>
          ) : (
            <Button color="inherit" onClick={() => signOutButtonClicked()}>
              Sign Out
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </main>
  );
}

export default App;
