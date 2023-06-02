import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";

export default function EventFilters() {
  return (
    <>
      <Menu vertical size='large' style={{ width: "100%", marginTop: "2em" }}>
        <Calendar />
      </Menu>
      <Header />
    </>
  );
}
