import React, { useState } from "react";

function LogoutPage() {
  // clear session storage
  sessionStorage.clear();
  return (
    <div>
      <h1>Logged out successfully</h1>
    </div>
  );
}

export default LogoutPage;