import * as React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Chip,
  Box,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { useEffect, useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import UsuariosContext from "../../Context/Usuarios/UsuariosContext";
import TablerosContext from "../../Context/Tableros/TablerosContext";

export default function ModalAsignarTableros({ open, handleClose, id, rows }) {
  const { GetUsuariosLimited } = useContext(UsuariosContext);
  const { tableros, GetTablerosName, DashboardAssign } =
    useContext(TablerosContext);

  const [loading, setLoading] = useState(false);

  const { control, register, handleSubmit, reset } = useForm({
    defaultValues: {
      collaborator_number: "",
      name: "",
      dashboard_ids: [],
    },
  });

  useEffect(() => {
    if (!id) return;

    const usuario = rows?.find((item) => Number(item.id) === Number(id));

    if (!usuario) return;

    reset({
      collaborator_number: usuario.collaborator_number ?? "",
      name: usuario.name ?? "",
      dashboard_ids: (usuario.dashboards ?? []).map((dashboard) =>
        Number(dashboard.id),
      ),
    });
  }, [id, rows, reset]);

  useEffect(() => {
    if (open) GetTablerosName();
  }, [open]);

  const onSubmit = async (data) => {
    setLoading(true);
    const ok = await DashboardAssign({
      user_id: id,
      dashboard_ids: data.dashboard_ids.map(Number),
    });
    setLoading(false);

    if (ok) {
      GetUsuariosLimited();
      handleDialogClose();
    }
  };

  const handleDialogClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>Asignar tableros</DialogTitle>

      <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Número de colaborador"
                slotProps={{ inputLabel: { shrink: true } }}
                {...register("collaborator_number")}
                disabled
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre completo"
                slotProps={{ inputLabel: { shrink: true } }}
                {...register("name")}
                disabled
              />
            </Grid>

            <Grid size={12}>
              <FormControl fullWidth>
                <InputLabel id="tableros-label">Tableros</InputLabel>
                <Controller
                  name="dashboard_ids"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="tableros-label"
                      multiple
                      input={<OutlinedInput label="Tableros" />}
                      value={field.value || []}
                      renderValue={(selected) => (
                        <Box
                          sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}
                        >
                          {selected.map((value) => {
                            const tablero = tableros?.find(
                              (item) => Number(item.id) === Number(value),
                            );
                            return (
                              <Chip
                                key={value}
                                label={tablero?.nombre ?? `Tablero ${value}`}
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {tableros?.map((tablero) => (
                        <MenuItem key={tablero.id} value={Number(tablero.id)}>
                          <Checkbox
                            checked={(field.value || []).includes(
                              Number(tablero.id),
                            )}
                          />
                          <ListItemText primary={tablero.nombre} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleDialogClose}
            disabled={loading}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": { backgroundColor: "darkred" },
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            sx={{
              backgroundColor: "#1565c0",
              color: "white",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            {loading ? "Guardando..." : "Guardar asignaciones"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
