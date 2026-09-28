import React from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  LinearProgress,
  CircularProgress,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function LinearProgressWithLabel({ value }) {
  return (
    <Box sx={{ width: "100%" }}>
      <LinearProgress
        variant="determinate"
        value={value}
        aria-label="Progreso de carga"
        sx={{
          height: 10,
          borderRadius: 5,
          backgroundColor: "#2B2B2B",
          overflow: "hidden",
          "& .MuiLinearProgress-bar": {
            borderRadius: 5,
            background:
              value < 100
                ? "linear-gradient(90deg, #FFFFFF, #CFCFCF, #7A7A7A)"
                : "#FFFFFF",
            transition: "all .6s ease",
          },
        }}
      />

      <Typography
        variant="body2"
        sx={{
          mt: 1,
          fontWeight: 600,
          textAlign: "center",
          color: "#FFFFFF",
        }}
      >
        {Math.round(value)}%
      </Typography>
    </Box>
  );
}

LinearProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
};

export default function LoadingComponent({ loading }) {
  const [progress, setProgress] = React.useState(0);
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!loading) return;

    setProgress(0);
    setShowSuccess(false);

    const timer = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 6, 90));
    }, 250);

    return () => clearInterval(timer);
  }, [loading]);

  React.useEffect(() => {
    if (!loading) {
      setProgress(100);

      const successTimer = setTimeout(() => {
        setShowSuccess(true);
      }, 400);

      return () => clearTimeout(successTimer);
    }
  }, [loading]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #000000, #1A1A1A, #2E2E2E)",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          p: 4,
          width: 340,
          textAlign: "center",
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background: "rgba(25,25,25,.90)",
          border: "1px solid rgba(255,255,255,.08)",
          boxShadow: "0 15px 45px rgba(0,0,0,.6)",
        }}
      >
        {!showSuccess ? (
          <CircularProgress
            size={72}
            variant="determinate"
            value={progress}
            thickness={4}
            sx={{
              mb: 2,
              color: "#FFFFFF",
              filter: "drop-shadow(0 0 10px rgba(255,255,255,.25))",
              "& .MuiCircularProgress-circle": {
                strokeLinecap: "round",
              },
            }}
          />
        ) : (
          <CheckCircleIcon
            sx={{
              fontSize: 72,
              color: "#FFFFFF",
              mb: 2,
              animation: "pop .4s ease",
              "@keyframes pop": {
                "0%": {
                  transform: "scale(0.5)",
                  opacity: 0,
                },
                "100%": {
                  transform: "scale(1)",
                  opacity: 1,
                },
              },
            }}
          />
        )}

        <Typography
          variant="h6"
          sx={{
            mb: 2,
            fontWeight: 600,
            color: "#FFFFFF",
            letterSpacing: 0.5,
          }}
        >
          {showSuccess ? "¡Todo listo!" : "Cargando información..."}
        </Typography>

        <LinearProgressWithLabel value={progress} />
      </Paper>
    </Box>
  );
}
