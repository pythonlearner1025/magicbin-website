import React from "react";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme.js"

export function Register({ register }) {
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
            register();
        }}
      >
        <div className="form-group">
          <label style={{color:"whitesmoke", fontStyle:'normal', fontFamily:'monospace'}}>If this is not your first registration, click below to increase your trash-lottery share </label>
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
          <Button variant="outlined" color="primary" type="submit" >Trash Me In</Button>
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
}
