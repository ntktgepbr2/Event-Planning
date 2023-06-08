import { observer } from "mobx-react-lite";
import { Grid, Header, Tab } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import ProfileUserEvents from "./ProfileUserEvents";

export default observer(function ProfileUserEventsContent() {
  const {
    profileStore: { loadingUserEvents, setUserEventTab, userEvents, loadUserEvents },
  } = useStore();
  const panes = [
    {
      menuItem: "Future Events",
      render: () => <ProfileUserEvents />,
    },
    { menuItem: "Past Events", render: () => <ProfileUserEvents /> },
    { menuItem: "Hosting", render: () => <ProfileUserEvents /> },
  ];
  useEffect(() => {
    if (userEvents.length === 0) {
      loadUserEvents("future");
    }
  }, []);
  return (
    <Tab.Pane loading={loadingUserEvents}>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon='image' content='Events' />
        </Grid.Column>
        <Tab
          panes={panes}
          menu={{ secondary: true, pointing: true }}
          onTabChange={(e, data) => setUserEventTab(data.activeIndex)}
        />
      </Grid>
    </Tab.Pane>
  );
});
