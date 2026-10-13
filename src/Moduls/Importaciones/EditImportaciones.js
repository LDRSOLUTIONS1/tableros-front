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
import ImportacionesContext from "../../Context/Importaciones/ImportacionesContext";

export default function EditImportaciones({ open, handleClose, id }) {
  const { EditImportaciones } = useContext(ImportacionesContext);

  const [importacion, setImportacion] = useState(null);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      estado: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    MethodGet(`/importaciones/${id}`)
      .then((res) => {
        setImportacion(res.data);
      })
      .catch(console.log);
  }, [id]);

  useEffect(() => {
    if (importacion) {
      reset({
        codigo: importacion.codigo || "",
        nombre: importacion.nombre || "",
        descripcion: importacion.descripcion || "",
        estado: importacion.estado || "",
      });
    }
  }, [importacion, reset]);

  const onSubmit = (data) => {
    const payload = {
      ...data,
      id,
    };

    EditImportaciones(payload);
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
      <DialogTitle>Editar fuente de excel</DialogTitle>

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
              <TextField
                fullWidth
                label="Código"
                InputLabelProps={{ shrink: true }}
                {...register("codigo", {
                  maxLength: { value: 255, message: "Máximo 255 caracteres" },
                })}
                error={!!errors.codigo}
                helperText={errors.codigo?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre"
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
                label="Descripcion"
                InputLabelProps={{ shrink: true }}
                {...register("descripcion", {
                  maxLength: { value: 500, message: "Máximo 500 caracteres" },
                })}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
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
