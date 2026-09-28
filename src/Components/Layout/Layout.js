import Header from "./Header";
import "./Styles.css";

export default function Layout({ children }) {
  return (
    <Header>
      {children}
    </Header>
  );
}
