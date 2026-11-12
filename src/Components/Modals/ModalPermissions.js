import React, { useContext, useEffect, useRef } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import AdministraciónPaginasContext from "../../Context/AdministraciónPaginas/AdministraciónPaginasContext";
import ImportacionesContext from "../../Context/Importaciones/ImportacionesContext";

export default function ModalPermissions({ open, handleClose, id, pagina }) {
  const { AssignPermissions } = useContext(AdministraciónPaginasContext);
  const { importaciones, GetImportaciones } = useContext(ImportacionesContext);

  const {
    control,
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      excel_source_ids: [],
    },
  });

  const getImportacionesRef = useRef(GetImportaciones);

  useEffect(() => {
    getImportacionesRef.current = GetImportaciones;
  }, [GetImportaciones]);

  useEffect(() => {
    if (open) {
      getImportacionesRef.current();
    }
  }, [open, id]);

  useEffect(() => {
    if (!open) return;

    reset({
      excel_source_ids: (pagina?.excel_sources || []).map((excel) =>
        Number(excel.id),
      ),
    });
  }, [open, id, pagina, reset]);

  const fuentesAsignadas = pagina?.excel_sources || [];

  // Incluir las asociadas y las fuentes activas disponibles.
  const fuentesDisponibles = Array.from(
    new Map(
      [
        ...fuentesAsignadas,
        ...(importaciones || []).filter((excel) => Number(excel.estado) === 2),
      ].map((excel) => [Number(excel.id), { ...excel, id: Number(excel.id) }]),
    ).values(),
  );

  const onSubmit = async (data) => {
    const resultado = await AssignPermissions({
      id,
      excel_source_ids: data.excel_source_ids,
    });

    if (resultado === true) {
      handleClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : handleClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle>Configurar archivos de Excel</DialogTitle>

      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="off"
      >
        <DialogContent dividers>
          <Stack spacing={3}>
            <Box
              sx={{
                p: 2,
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "action.hover",
              }}
            >
              <Typography variant="overline" color="text.secondary">
                Tablero
              </Typography>

              <Typography variant="h6" fontWeight={600}>
                {pagina?.dashboard?.nombre || "Sin tablero"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, overflowWrap: "anywhere" }}
              >
                {pagina?.dashboard?.descripcion ||
                  "Sin descripción del tablero"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="overline" color="text.secondary">
                Página
              </Typography>

              <Typography variant="subtitle1" fontWeight={600}>
                {pagina?.nombre || "Sin nombre"}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, overflowWrap: "anywhere" }}
              >
                {pagina?.descripcion || "Sin descripción de la página"}
              </Typography>

              <Stack
                direction="row"
                spacing={1}
                sx={{ mt: 2 }}
                useFlexGap
                flexWrap="wrap"
              >
                <Chip
                  label={`Asociados actualmente: ${fuentesAsignadas.length}`}
                  color="primary"
                  variant="outlined"
                  size="small"
                />

                <Chip
                  label={`Orden: ${pagina?.orden ?? "Sin definir"}`}
                  variant="outlined"
                  size="small"
                />
              </Stack>
            </Box>

            <Box>
              <Typography fontWeight={600} sx={{ mb: 2 }}>
                Seleccionar fuentes Excel
              </Typography>

              <Controller
                name="excel_source_ids"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={Boolean(error)}
                    disabled={isSubmitting}
                  >
                    <InputLabel id="fuentes-excel-label" shrink>
                      Fuentes Excel
                    </InputLabel>

                    <Select
                      multiple
                      displayEmpty
                      id="fuentes-excel-select"
                      labelId="fuentes-excel-label"
                      label="Fuentes Excel"
                      name={field.name}
                      inputRef={field.ref}
                      value={field.value}
                      onBlur={field.onBlur}
                      onChange={(event) => {
                        const value = event.target.value;

                        const seleccionados =
                          typeof value === "string"
                            ? value.split(",").filter(Boolean)
                            : value;

                        field.onChange(seleccionados.map(Number));
                      }}
                      inputProps={{
                        "aria-describedby": "fuentes-excel-ayuda",
                      }}
                      renderValue={(seleccionados) => {
                        if (seleccionados.length === 0) {
                          return (
                            <Typography color="text.secondary">
                              Sin fuentes seleccionadas
                            </Typography>
                          );
                        }

                        return (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {seleccionados.map((sourceId) => {
                              const fuente = fuentesDisponibles.find(
                                (item) => item.id === sourceId,
                              );

                              return (
                                <Chip
                                  key={sourceId}
                                  label={fuente?.nombre || `Fuente ${sourceId}`}
                                  size="small"
                                  color="primary"
                                  variant="outlined"
                                  sx={{
                                    maxWidth: "100%",
                                    "& .MuiChip-label": {
                                      whiteSpace: "normal",
                                    },
                                    height: "auto",
                                    minHeight: 24,
                                  }}
                                />
                              );
                            })}
                          </Box>
                        );
                      }}
                      MenuProps={{
                        PaperProps: {
                          sx: { maxHeight: 350 },
                        },
                      }}
                    >
                      {fuentesDisponibles.length === 0 ? (
                        <MenuItem disabled>No hay fuentes disponibles</MenuItem>
                      ) : (
                        fuentesDisponibles.map((fuente) => (
                          <MenuItem
                            key={fuente.id}
                            value={fuente.id}
                            sx={{ whiteSpace: "normal" }}
                          >
                            <Checkbox
                              checked={field.value.includes(fuente.id)}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-hidden": true }}
                              sx={{ pointerEvents: "none" }}
                            />

                            <ListItemText
                              primary={fuente.nombre}
                              secondary={fuente.codigo}
                              sx={{ overflowWrap: "anywhere" }}
                            />
                          </MenuItem>
                        ))
                      )}
                    </Select>

                    <FormHelperText id="fuentes-excel-ayuda">
                      {error?.message ||
                        `${field.value.length} seleccionados. Marca o desmarca las fuentes y guarda los cambios.`}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Box>

            <Alert severity="info">
              Al guardar, esta página conservará únicamente las fuentes
              seleccionadas. Quitar una fuente no elimina sus datos ni su
              historial.
            </Alert>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} color="error" disabled={isSubmitting}>
            Cancelar
          </Button>

          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : "Guardar cambios"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
