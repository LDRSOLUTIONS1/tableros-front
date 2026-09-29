import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useForm } from "react-hook-form";
import { Grid, MenuItem } from "@mui/material";
import { useContext } from "react";
import TablerosContext from "../../Context/Tableros/TablerosContext";

export default function AddTableros({ open, handleClose, categorias }) {
  const { CreateTableros } = useContext(TablerosContext);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = (data, e) => {
    CreateTableros(data);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Nuevo Tablero</DialogTitle>
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
                select
                fullWidth
                label="Selecciona una categoría"
                {...register("category_id", {
                  required: "Debes seleccionar una categoría",
                })}
                error={!!errors.category_id}
                helperText={errors.category_id?.message}
              >
                <MenuItem value="">
                  <em>-- Selecciona una Categoría --</em>
                </MenuItem>
                {categorias.map((categoria) => (
                  <MenuItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre del Tablero"
                {...register("nombre", {
                  required: "Este campo es obligatorio",
                  minLength: { value: 1, message: "Mínimo 1 carácter" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
                error={!!errors.nombre}
                helperText={errors.nombre?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Descripcion"
                {...register("descripcion", {
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
                error={!!errors.descripcion}
                helperText={errors.descripcion?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Url"
                {...register("url", {
                  required: "Este campo es obligatorio",
                  minLength: { value: 1, message: "Mínimo 1 carácter" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
                error={!!errors.url}
                helperText={errors.url?.message}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                label="Fuente"
                {...register("fuente", {
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
                error={!!errors.fuente}
                helperText={errors.fuente?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
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
            sx={{
              backgroundColor: "#1565c0",
              color: "white",
              "&:hover": { backgroundColor: "#0d47a1" },
            }}
          >
            Guardar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
