import { Chip } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";

const estadoConfig = {
  1: { label: "Inactivo", color: "error" },
  2: { label: "Activo", color: "success" },
};


export const EstadoChip = ({ estado }) => {
  const config = estadoConfig[estado] || {
    label: "Desconocido",
    color: "default",
  };

  return (
    <Chip
      label={config.label}
      color={config.color}
      size="small"
      icon={estado === 2 ? <CheckCircleIcon /> : <CancelIcon />}
      variant="outlined"
    />
  );
};
