import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import React from "react";
import Form from "./Form";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const isNonMobileScreen = useMediaQuery("(min-width:1000px)");
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        textALign="center"
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="primary"
          textAlign="center"
          onClick={() => navigate("/home")}
        >
          Global Book
        </Typography>
      </Box>
      <Box 
        width={isNonMobileScreen ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{mb:"1.5rem"}}>Welcome to Global Book, the world book for free</Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
