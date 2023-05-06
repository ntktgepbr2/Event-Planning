import "./style.css";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
import { Route, useLocation } from "react-router-dom";
import HomePage from "../../features/home/HomePage";
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store";
import { useEffect } from "react";
import LoadingComponents from "./LoadingComponents";
import RegisterForm from "../../features/users/RegisterForm";
import RegisterSuccess from "../../features/users/RegisterSuccess";
import ConfigrmEmail from "../../features/users/ConfirmEmail";
import EventDashboard from "../../features/activities/dashboard/EventDashboard";
import EventDetails from "../../features/activities/details/EventDetails";
import EventForm from "../../features/activities/forms/EventForm";

function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) return <LoadingComponents />;

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <Route exact path='/' component={HomePage} />
        <Route exact path='/events' component={EventDashboard} />
        <Route path='/events/:id' component={EventDetails} />
        <Route
          path={["/createEvent", "/manage/:id"]}
          component={EventForm}
          key={location.pathname}
        />
        <Route exact path='/login' component={LoginForm} />
        <Route exact path='/register' component={RegisterForm} />
        <Route exact path='/account/registerSuccess' component={RegisterSuccess} />
        <Route exact path='/account/verifyEmail' component={ConfigrmEmail} />
      </Container>
    </>
  );
}

export default observer(App);
