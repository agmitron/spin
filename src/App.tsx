import React from "react";
import { Buffer } from "buffer";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Dashboard from "./components/Dashboard";

window.Buffer = window.Buffer || Buffer;

function App() {
  return (
    <Box>
      <Header />
      <Dashboard />
    </Box>
  );
}

export default App;
