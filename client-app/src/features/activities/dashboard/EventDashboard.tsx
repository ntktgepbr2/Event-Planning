import { Grid } from "semantic-ui-react";
import EventList from "./EventList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponents from "../../../app/layout/LoadingComponents";
import { useEffect } from "react";
import EventFilters from "./EventFilters";

export default observer(function EventDashboard() {
  const { eventStore } = useStore();
  const { loadEvents, events } = eventStore;

  useEffect(() => {
    if (events.length <= 0) loadEvents();
  }, [events.length, loadEvents]);

  if (eventStore.loadingInitial) return <LoadingComponents content='Loading app...' />;

  return (
    <Grid>
      <Grid.Column width='10'>
        <EventList />
      </Grid.Column>
      <Grid.Column width='6'>
        <EventFilters />
      </Grid.Column>
    </Grid>
  );
});
