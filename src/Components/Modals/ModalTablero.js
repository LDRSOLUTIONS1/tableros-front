import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Stack,
  useTheme,
  TableContainer,
  Paper,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ModalTablero = ({ open, handleClose, tablero }) => {
  const theme = useTheme();

  if (!tablero) return null;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xl"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          py: 2,
        }}
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={700}>
            {tablero.category.nombre + " - " + tablero.nombre}
          </Typography>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <iframe
            title={tablero.nombre}
            src={tablero.url}
            width="100%"
            height="800"
            style={{ border: 0 }}
            allowFullScreen
          />
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ModalTablero;
