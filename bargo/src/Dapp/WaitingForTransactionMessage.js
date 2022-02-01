import React from "react";

export function WaitingForTransactionMessage({ txHash }) {
  return (
    <div className="alert alert-info" role="alert" style={{color:"whitesmoke", fontStyle:'normal', fontFamily:'monospace'}}>
      Waiting for transaction <strong>{txHash}</strong> to be mined
    </div>
  );
}
