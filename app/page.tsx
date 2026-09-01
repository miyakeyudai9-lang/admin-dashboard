"use client";

import Button from "@mui/material/Button";

export default function Home() {
  return (
    <main style={{ padding: 400, display: "grid", gap: 16 }}>
      <Button variant="contained" color="primary">
        MUI Test Button
      </Button>
      <Button variant="outlined" color="secondary">
        Secondary MUI Button
      </Button>
    </main>
  );
}
