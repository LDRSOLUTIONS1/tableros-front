import React, { useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { createTheme } from "@mui/material/styles";
import LogoDinamico from "./LogoDinamico";
import { tienePermisoMenu } from "../../Utils/roles";
import DescriptionIcon from "@mui/icons-material/Description";
import GroupIcon from "@mui/icons-material/Group";
import SecurityIcon from "@mui/icons-material/Security";
import HistoryIcon from "@mui/icons-material/History";
import CategoryIcon from "@mui/icons-material/Category";
import TableRowsIcon from "@mui/icons-material/TableRows";

const theme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: { light: true, dark: true },
});

const MODULOS = [
  {
    id: 1,
    segment: "Inicio",
    title: "Inicio",
    icon: <DashboardIcon />,
  },
  {
    id: 5,
    segment: "Categorías",
    title: "Categorías",
    icon: <CategoryIcon />,
  },
  {
    id: 6,
    segment: "Tableros",
    title: "Tableros",
    icon: <TableRowsIcon />,
  },
  {
    id: 2,
    segment: "Usuarios",
    title: "Usuarios",
    icon: <GroupIcon />,
  },
  {
    id: 3,
    segment: "Roles",
    title: "Roles",
    icon: <SecurityIcon />,
  },
  {
    id: 4,
    segment: "Logs",
    title: "Logs",
    icon: <HistoryIcon />,
  },
];

const construirMenu = (role_id) => {
  return MODULOS.map((modulo) => {
    if (!tienePermisoMenu(role_id, modulo.id)) return null;
    if (!modulo.children) return modulo;

    const childrenFiltrados = modulo.children.filter((child) =>
      tienePermisoMenu(role_id, child.id),
    );

    if (childrenFiltrados.length === 0) return null;

    return {
      ...modulo,
      children: childrenFiltrados,
    };
  }).filter(Boolean);
};

export default function Header({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const router = useMemo(
    () => ({
      pathname: location.pathname,
      navigate: (path) => {
        if (path === "/manual-usuario") {
          window.open("/super-admin.pdf", "_blank", "noreferrer");
          return;
        }

        if (path === "/volver-intranet") {
          window.location.href =
            "https://ldrhsys.ldrhumanresources.com/Cliente/interfaces/Inicio.php";
          return;
        }

        navigate(path);
      },
    }),
    [location.pathname, navigate],
  );

  const role_id = Number(localStorage.getItem("role_id"));

  const menuItems = useMemo(() => {
    const baseMenu = construirMenu(role_id);

    return [
      ...baseMenu,
      { kind: "divider" },

      {
        segment: "volver-intranet",
        title: "Regresar a la intranet",
        icon: <KeyboardReturnIcon />,
      },
      {
        segment: "manual-usuario",
        title: "Manual de usuario",
        icon: <DescriptionIcon />,
      },
    ];
  }, [role_id]);

  return (
    <AppProvider
      navigation={menuItems}
      router={router}
      theme={theme}
      branding={{
        logo: <LogoDinamico />,
        title: "",
      }}
    >
      <DashboardLayout defaultSidebarCollapsed initialExpandedItems={[]}>
        {children}
      </DashboardLayout>
    </AppProvider>
  );
}
