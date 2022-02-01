import React from "react";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme.js"

export function Transfer({ transfer }) {
  return (
    <div
    style={{
      display: "flex",
          justifyContent: "center",
          alignItems: "center"
    }}>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
            transfer();
        }}
      >
        <div className="form-group">
          <label style={{color:"whitesmoke", fontStyle:'normal', fontFamily:'monospace'}}>Smart Contract Address: 0x5FbDB2315678afecb367f032d93F642f64180aa3</label>
        </div>
        <div style={{
          height:"15px"
        }}></div>
        <div className="form-group" style={{
         display: "flex",
         justifyContent: "center",
         alignItems: "center" 
        }}>
          <ThemeProvider theme={theme}>
          <Button variant="outlined" color="primary" type="submit" >Buy Ticket</Button>
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
}
