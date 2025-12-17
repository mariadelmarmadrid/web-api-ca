import React from "react";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

const Header = ({ title }) => {
  return (
    <Paper
      component="div"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 1,
        mb: 2,
        px: 2,
        py: 1.25,
        borderRadius: 2,
        boxShadow: "none",
        borderBottom: "1px solid rgba(0,0,0,0.08)",
        background: "transparent",
      }}
    >

      <Typography variant="h4" component="h1" sx={{ fontWeight: 800 }}>
        {title}
      </Typography>

    </Paper>

  );
};

export default Header;
