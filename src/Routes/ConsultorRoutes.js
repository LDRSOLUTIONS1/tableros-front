import React from "react";
import { Routes, Route } from "react-router-dom";

import Inicio from "../Moduls/Inicio/Inicio";
import Categorías from "../Moduls/Categorías/Categorías";
import Tableros from "../Moduls/Tableros/Tableros";
import AdministraciónPaginas from "../Moduls/AdministraciónPaginas/AdministraciónPaginas";
import Importaciones from "../Moduls/Importaciones/Importaciones";
import DetalleImportaciones from "../Moduls/Importaciones/DetalleImportaciones";

import NoResultados from "../Components/Layout/NoResultados";

const ConsultorRoutes = () => {
  return (
    <Routes>
      <Route path="/Inicio" element={<Inicio />} />
      <Route path="/Categorias" element={<Categorías />} />
      <Route path="/Tableros" element={<Tableros />} />
      <Route path="/AdministracionPaginas" element={<AdministraciónPaginas />}/>
      <Route path="/Importaciones" element={<Importaciones />} />
      <Route path="/Importaciones/:id" element={<DetalleImportaciones />} />

      <Route path="/no-resultados" element={<NoResultados />} />
      <Route path="*" element={<NoResultados />} />
    </Routes>
  );
};

export default ConsultorRoutes;
