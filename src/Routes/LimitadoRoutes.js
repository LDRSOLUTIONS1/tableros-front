import React from "react";
import { Routes, Route } from "react-router-dom";

import Inicio from "../Moduls/Inicio/Inicio";
import Tableros from "../Moduls/Tableros/Tableros";

import NoResultados from "../Components/Layout/NoResultados";

const LimitadoRoutes = () => {
  return (
    <Routes>
      <Route path="/Inicio" element={<Inicio />} />
      <Route path="/Tableros" element={<Tableros />} />

      <Route path="/no-resultados" element={<NoResultados />} />
      <Route path="*" element={<NoResultados />} />
    </Routes>
  );
};

export default LimitadoRoutes;
