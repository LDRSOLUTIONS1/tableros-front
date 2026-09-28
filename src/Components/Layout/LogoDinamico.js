import React from "react";
import { useColorScheme } from "@mui/material/styles";
import LogoBlanco from "./Img/logoblanco.png";
import LogoNegro from "./Img/logonegro.png";

const LogoDinamico = () => {
  const { mode } = useColorScheme();
  const logoActual = mode === "dark" ? LogoBlanco : LogoNegro;

  return <img src={logoActual} alt="Logo" style={{ height: 40 }} />;
};

export default LogoDinamico;