import React from "react";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme.js"


export function Fail({fail}) {
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

                fail();
            }}
        >
            <div className="form-group">
            <label style={{color:"whitesmoke", fontStyle:'normal', fontFamily:'monospace'}}>Registration Failed. Enter Valid Trash Code Please</label>
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
            <Button variant="outlined" color="primary" type="submit" >Retry</Button>
            </ThemeProvider>
            </div>
        </form>
        </div>
  );
}
