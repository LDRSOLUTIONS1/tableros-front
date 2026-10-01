import React from "react";
import { Routes, Route } from "react-router-dom";

import NoResultados from "../Components/Layout/NoResultados";
import Inicio from "../Moduls/Inicio/Inicio";
import Categorías from "../Moduls/Categorías/Categorías";
import Usuarios from "../Moduls/Usuarios/Usuarios";
import Roles from "../Moduls/Roles/Roles";
import Tableros from "../Moduls/Tableros/Tableros";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/Inicio" element={<Inicio />} />
      <Route path="/Categorías" element={<Categorías />} />
      <Route path="/Tableros" element={<Tableros />} />
      <Route path="/Usuarios" element={<Usuarios />} />
      <Route path="/Roles" element={<Roles />} />

      <Route path="/no-resultados" element={<NoResultados />} />
      <Route path="*" element={<NoResultados />} />
    </Routes>
  );
};

export default AdminRoutes;
