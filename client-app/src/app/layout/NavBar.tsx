import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
  const {
    userStore: { user, logout, IsLoggedIn },
  } = useStore();

  return (
    <Menu inverted fixed='top'>
      <Container>
        <Menu.Item as={NavLink} exact to='/' header>
          <img src='/assets/logo.png' alt='logo' style={{ marginRight: "10px" }} />
          Events
        </Menu.Item>
        {IsLoggedIn && (
          <>
            <Menu.Item as={NavLink} to='/events' name='Events' />
            <Menu.Item>
              <Button as={NavLink} to='/createEvent' positive content='Create Event' />
            </Menu.Item>
            <Menu.Item position='right'>
              <Image src={user?.image || "/assets/user.png"} avatar spaced='right'></Image>
              <Dropdown pointing='top left' text={user?.displayName}>
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={`/profile/${user?.userName}`}
                    text='My Profile'
                    icon='user'
                  ></Dropdown.Item>
                  <Dropdown.Item onClick={logout} icon='power' text='Logout'></Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </>
        )}
      </Container>
    </Menu>
  );
});
