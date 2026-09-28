import React from "react";
import AppRouter from "./Routes/AppRouter";
import AuthState from "./Context/Auth/AuthState";
import RolesState from "./Context/Roles/RolesState";
import UsuariosState from "./Context/Usuarios/UsuariosState";
import LogsState from "./Context/Logs/LogsState";

const AdminApp = () => {
  return (
    <AuthState>
      <RolesState>
        <UsuariosState>
          <LogsState>
            <AppRouter />
          </LogsState>
        </UsuariosState>
      </RolesState>
    </AuthState>
  );
};

export default AdminApp;
