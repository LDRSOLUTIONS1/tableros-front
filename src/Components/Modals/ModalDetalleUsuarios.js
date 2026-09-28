import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Stack,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Tabs,
  Tab,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { dateFormatter } from "../../Utils/dateFormatter";
import { EstadoChip } from "../../Utils/EstadoChip";

const ModalDetalleUsuarios = ({ open, handleClose, usuario }) => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  if (!usuario) return null;

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

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
            Detalle del usuario
          </Typography>

          <IconButton onClick={handleClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: { xs: 1, sm: 3 },
        }}
      >
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{
            minHeight: 48,
            "& .MuiTab-root": {
              minHeight: 48,
              textTransform: "none",
              fontWeight: 600,
            },
          }}
        >
          <Tab label="Información" />
        </Tabs>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 2,
            boxShadow: "none",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Table>
            <TableBody>
              {[
                { label: "Id", value: usuario.id },
                {
                  label: "Número de colaborador",
                  value: usuario.collaborator_number,
                },
                { label: "Nombre", value: usuario.name },
                { label: "Correo", value: usuario.email },
                { label: "Rol", value: usuario.role?.name ?? "N/A" },
                { label: "Manager", value: usuario.manager?.name ?? "N/A" },
                { label: "Segmento", value: usuario.segment?.name ?? "N/A" },
                {
                  label: "Creado en",
                  value: dateFormatter(usuario.created_at),
                },
                {
                  label: "Estatus",
                  value: <EstadoChip estado={usuario.estado} />,
                },
              ].map((row, index) => (
                <TableRow
                  key={index}
                  sx={{
                    "&:nth-of-type(odd)": {
                      backgroundColor: theme.palette.action.hover,
                    },
                  }}
                >
                  <TableCell
                    sx={{
                      fontWeight: 600,
                      width: "35%",
                      borderRight: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {row.label}
                  </TableCell>

                  <TableCell
                    sx={{
                      fontWeight: 500,
                    }}
                  >
                    {row.value || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDetalleUsuarios;
