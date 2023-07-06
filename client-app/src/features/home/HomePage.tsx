import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

export default function HomePage() {
  const { userStore, modalStore } = useStore();

  return (
    <Segment inverted textAlign='center' vertical className='masthead'>
      <Container text>
        <Header as='h1' inverted>
          <Image size='massive' src='/assets/logo.png' alt='logo' style={{ marginBottom: "1em" }} />
          Event planning
        </Header>
        {userStore.isLoggedIn ? (
          <>
            <Header as='h2' inverted content='Welcome to Events!' />
            <Button as={Link} to='/events' size='huge' inverted>
              Go to events!
            </Button>
          </>
        ) : (
          <>
            <Button
              onClick={() => modalStore.openModal(<LoginForm />)}
              to='/login'
              size='huge'
              inverted
            >
              Login
            </Button>
            <Button
              onClick={() => modalStore.openModal(<RegisterForm />)}
              to='/register'
              size='huge'
              inverted
            >
              Register
            </Button>
          </>
        )}
      </Container>
    </Segment>
  );
}
