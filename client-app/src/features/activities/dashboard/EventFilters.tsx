import Calendar from "react-calendar";
import { Header, Menu } from "semantic-ui-react";

export default function EventFilters() {
  return (
    <>
      <Menu vertical size='large' style={{ width: "100%", marginTop: "2em" }}>
        <Header icon='filter' attached color='teal' content='Filters'></Header>
        <Menu.Item content='All events' />
      </Menu>
      <Header />
      <Calendar />
    </>
  );
}
