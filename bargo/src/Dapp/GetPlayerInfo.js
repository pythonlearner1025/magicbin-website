import React from "react";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme.js"
import TextField from '@mui/material/TextField';

export function GetPlayerInfo({ getPlayerInfo }) {
  return (
    <div 
    style={{
      display: "flex",
          justifyContent: "center",
          alignItems: "center"
    }}>
      <h4>Get Player Info</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const userHash = formData.get("userHash");
          const userName = formData.get("userName")

          if (userHash && userName) {
            getPlayerInfo(userHash, userName);
            }
        }}
      >
        <div className="form-group">
          <label style={{color:"whitesmoke", fontStyle:'normal', fontFamily:'monospace'}}>Trash-Club Code:</label>
          <input className="form-control" type="text" name="userHash" required />
        </div>
        <div>
          <br>
          </br>
        </div>
        <div className="form-group">
          <label style={{color:"whitesmoke", fontStyle:'normal', fontFamily:'monospace'}}>Unique Username:</label>
          <input className="form-control" type="text" name="userName" required />
        </div>
        <div>
          <br>
          </br>
        </div>
        <div className="form-group">
          <ThemeProvider theme={theme}>
          <Button variant="outlined" color="primary" type="submit" >Submit Code</Button>
          </ThemeProvider>
        </div>
      </form>
    </div>
  );
}
