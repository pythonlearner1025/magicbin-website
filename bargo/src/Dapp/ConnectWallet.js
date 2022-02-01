import React from "react";
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "./theme.js"
import { NetworkErrorMessage } from "./NetworkErrorMessage";

export function ConnectWallet({ connectWallet, networkError, dismiss }) {
  return (
    <div className="container"
    style={{
      display: "flex",
          justifyContent: "center",
          alignItems: "center"
    }}
    >
      <div className="row justify-content-md-center">
        <div className="col-12 text-center">
          {/* Metamask network should be set to Localhost:8545. */}
          {networkError && (
            <NetworkErrorMessage 
              message={networkError} 
              dismiss={dismiss} 
            />
          )}
        </div>
        <div className="col-6 p-4 text-center">
          <p style={{color:"whitesmoke", fontStyle:'normal', fontFamily:'monospace'}}>Please connect to your wallet.</p>
          <ThemeProvider theme={theme}>
          <Button
            variant="outlined"
            onClick={connectWallet}
            color="primary"
          >
            Connect Wallet
          </Button>
          </ThemeProvider>
        </div>
      </div>
    </div>
  );
}
