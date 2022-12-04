import React, { ReactElement } from "react";

import AuthProvider from "./auth";

interface IProps {
  children: ReactElement;
}

const AppProvider: React.FC = ({ children }: IProps) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
