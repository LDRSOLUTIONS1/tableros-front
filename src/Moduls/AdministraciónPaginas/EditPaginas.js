import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Grid, MenuItem } from "@mui/material";
import MethodGet from "../../Config/Service";
import AdministraciónPaginasContext from "../../Context/AdministraciónPaginas/AdministraciónPaginasContext";

export default function EditPaginas({ open, handleClose, id, tableros }) {
  const { EditPaginas } = useContext(AdministraciónPaginasContext);

  const [pagina, setPagina] = useState(null);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      power_bi_dashboard_id: "",
      nombre: "",
      descripcion: "",
      orden: "",
      estado: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    MethodGet(`/paginas/${id}`)
      .then((res) => {
        setPagina(res.data);
      })
      .catch(console.log);
  }, [id]);

  useEffect(() => {
    if (pagina) {
      reset({
        power_bi_dashboard_id: pagina.power_bi_dashboard_id || "",
        nombre: pagina.nombre || "",
        descripcion: pagina.descripcion || "",
        orden: pagina.orden || "",
        estado: pagina.estado || "",
      });
    }
  }, [pagina, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      id,
    };

    EditPaginas(payload);
    handleClose();
  };

  const handleDialogClose = () => {
    reset();
    handleClose();
  };

  const estado = [
    { id: 1, nombre: "Inactivo" },
    { id: 2, nombre: "Activo" },
  ];

  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar Página</DialogTitle>

      <form
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter") {
            e.preventDefault();
          }
        }}
      >
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={12}>
              <Controller
                name="power_bi_dashboard_id"
                control={control}
                rules={{
                  required: "Este campo es obligatorio",
                }}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Selecciona un tablero"
                    {...field}
                    error={!!errors.power_bi_dashboard_id}
                    helperText={errors.power_bi_dashboard_id?.message}
                  >
                    <MenuItem value="">
                      <em>-- Seleccionar una opción --</em>
                    </MenuItem>

                    {tableros.map((tablero) => (
                      <MenuItem key={tablero.id} value={tablero.id}>
                        {tablero.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre de la página"
                InputLabelProps={{ shrink: true }}
                {...register("nombre", {
                  required: "Este campo es obligatorio",
                  minLength: { value: 1, message: "Mínimo 1 carácter" },
                  maxLength: { value: 255, message: "Máximo 255 caracteres" },
                })}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Descripción"
                InputLabelProps={{ shrink: true }}
                {...register("descripcion", {
                  maxLength: { value: 250, message: "Máximo 250 caracteres" },
                })}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                type="number"
                fullWidth
                label="Orden"
                InputLabelProps={{ shrink: true }}
                {...register("orden", {
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
                error={!!errors.orden}
                helperText={errors.orden?.message}
              />
            </Grid>
            <Grid size={12}>
              <Controller
                name="estado"
                control={control}
                rules={{
                  required: "Este campo es obligatorio",
                }}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Estatus"
                    {...field}
                    error={!!errors.estado}
                    helperText={errors.estado?.message}
                  >
                    <MenuItem value="">
                      <em>-- Seleccionar una opción --</em>
                    </MenuItem>

                    {estado.map((item) => (
                      <MenuItem key={item.id} value={item.id}>
                        {item.nombre}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleDialogClose}
            sx={{
              backgroundColor: "red",
              color: "white",
              "&:hover": {
                backgroundColor: "darkred",
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            type="submit"
            sx={{
              backgroundColor: "#1565c0",
              color: "white",
              "&:hover": {
                backgroundColor: "#0d47a1",
              },
            }}
          >
            Actualizar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
