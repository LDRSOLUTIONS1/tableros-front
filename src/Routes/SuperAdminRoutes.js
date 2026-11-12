import React from "react";
import { Routes, Route } from "react-router-dom";

import Inicio from "../Moduls/Inicio/Inicio";
import Categorías from "../Moduls/Categorías/Categorías";
import Tableros from "../Moduls/Tableros/Tableros";
import AdministraciónPaginas from "../Moduls/AdministraciónPaginas/AdministraciónPaginas";
import Importaciones from "../Moduls/Importaciones/Importaciones";
import DetalleImportaciones from "../Moduls/Importaciones/DetalleImportaciones";
import Administración from "../Moduls/Administración/Administración";

import Usuarios from "../Moduls/Usuarios/Usuarios";
import Roles from "../Moduls/Roles/Roles";
import Logs from "../Moduls/Logs/Logs";

import NoResultados from "../Components/Layout/NoResultados";

const SuperAdminRoutes = () => {
  return (
    <Routes>
      <Route path="/Inicio" element={<Inicio />} />
      <Route path="/Categorias" element={<Categorías />} />
      <Route path="/Tableros" element={<Tableros />} />
      <Route path="/AdministracionPaginas"element={<AdministraciónPaginas />}/>
      <Route path="/Importaciones" element={<Importaciones />} />
      <Route path="/Importaciones/:id" element={<DetalleImportaciones />} />
      <Route path="/Administracion" element={<Administración />} />

      <Route path="/Usuarios" element={<Usuarios />} />
      <Route path="/Roles" element={<Roles />} />
      <Route path="/Logs" element={<Logs />} />

      <Route path="/no-resultados" element={<NoResultados />} />
      <Route path="*" element={<NoResultados />} />
    </Routes>
  );
};

export default SuperAdminRoutes;
