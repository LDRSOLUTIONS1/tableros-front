import React from "react";
import { Routes, Route } from "react-router-dom";

import NoResultados from "../Components/Layout/NoResultados";
import Inicio from "../Moduls/Inicio/Inicio";
import Categorías from "../Moduls/Categorías/Categorías";
import Tableros from "../Moduls/Tableros/Tableros";
import Administración from "../Moduls/Administración/Administración";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/Inicio" element={<Inicio />} />
      <Route path="/Categorías" element={<Categorías />} />
      <Route path="/Tableros" element={<Tableros />} />
      <Route path="/Administración" element={<Administración />} />

      <Route path="/no-resultados" element={<NoResultados />} />
      <Route path="*" element={<NoResultados />} />
    </Routes>
  );
};

export default AdminRoutes;
