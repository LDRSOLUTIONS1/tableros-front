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
import UsuariosContext from "../../Context/Usuarios/UsuariosContext";

export default function ModalAsignarTableros({ open, handleClose, id, roles, rows }) {
  const { EditUsuarios } = useContext(UsuariosContext);

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      external_rh_id: "",
      name: "",
      email: "",
      role_id: "",
      segment_id: "",
      estado: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    MethodGet(`/usuarios/${id}`)
      .then((res) => {
        setUserData(res.data);
      })
      .catch(console.log);
  }, [id]);

  useEffect(() => {
    if (userData) {
      reset({
        collaborator_number: userData.collaborator_number || "",
        name: userData.name || "",
        email: userData.email || "",
        role_id: userData.role_id || "",
        segment_id: userData.segment_id || "",
        estado: userData.estado || "",
      });
    }
  }, [userData, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      id,
    };

    try {
      setLoading(true);
      await EditUsuarios(payload);
      handleDialogClose();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    reset();
    setUserData(null);
    handleClose();
  };

  const estado = [
    { id: 1, nombre: "Inactivo" },
    { id: 2, nombre: "Activo" },
  ];

  const selectedRole = watch("role_id");
  return (
    <Dialog open={open} onClose={handleDialogClose} fullWidth maxWidth="sm">
      <DialogTitle>Editar usuario</DialogTitle>

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
                type="number"
                fullWidth
                label="Número de colaborador"
                InputLabelProps={{ shrink: true }}
                {...register("collaborator_number", {
                  required: "Este campo es obligatorio",
                  minLength: { value: 1, message: "Mínimo 1 carácter" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
                error={!!errors.collaborator_number}
                helperText={errors.collaborator_number?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Nombre del usuario"
                InputLabelProps={{ shrink: true }}
                {...register("name", {
                  required: "Este campo es obligatorio",
                  maxLength: {
                    value: 100,
                    message: "Máximo 100 caracteres",
                  },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                type="email"
                fullWidth
                label="Correo electrónico"
                InputLabelProps={{ shrink: true }}
                {...register("email", {
                  required: "Este campo es obligatorio",
                  minLength: { value: 1, message: "Mínimo 1 carácter" },
                  maxLength: { value: 100, message: "Máximo 100 caracteres" },
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid size={12}>
              <Controller
                name="role_id"
                control={control}
                rules={{ required: "Debes seleccionar un rol" }}
                render={({ field }) => (
                  <TextField
                    select
                    fullWidth
                    label="Selecciona un rol"
                    {...field}
                    error={!!errors.role_id}
                    helperText={errors.role_id?.message}
                  >
                    <MenuItem value="">
                      <em>-- Selecciona un rol --</em>
                    </MenuItem>
                    {roles.map((r) => (
                      <MenuItem key={r.id} value={r.id}>
                        {r.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
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
            disabled={loading}
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
            disabled={loading}
            sx={{
              backgroundColor: "#1565c0",
              color: "white",
              "&:hover": {
                backgroundColor: "#0d47a1",
              },
            }}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
