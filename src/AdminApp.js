import React from "react";
import AppRouter from "./Routes/AppRouter";
import AuthState from "./Context/Auth/AuthState";
import RolesState from "./Context/Roles/RolesState";
import UsuariosState from "./Context/Usuarios/UsuariosState";
import LogsState from "./Context/Logs/LogsState";
import CategoríasState from "./Context/Categorías/CategoríasState";
import TablerosState from "./Context/Tableros/TablerosState";

const AdminApp = () => {
  return (
    <AuthState>
      <RolesState>
        <UsuariosState>
          <LogsState>
            <CategoríasState>
              <TablerosState>
                <AppRouter />
              </TablerosState>
            </CategoríasState>
          </LogsState>
        </UsuariosState>
      </RolesState>
    </AuthState>
  );
};

export default AdminApp;
