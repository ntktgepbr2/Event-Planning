import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import EventDetailedInfo from "./EventDetailedInfo";
import EventDetailedHeader from "./EventDetailedHeader";
import EventDetailedSidebar from "./EventDetailedSidebar";
import EventDetailedChat from "./EventDetailedChat";

export default observer(function EventDetails() {
  const { eventStore } = useStore();
  const { selectedEvent: event, loadEvent, loadingInitial } = eventStore;
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) loadEvent(id);

    return () => {
      clearSelectedEvent();
    };
  }, [id, loadEvent]);

  function clearSelectedEvent() {
    eventStore.selectedEvent = undefined;
  }

  if (loadingInitial || !event) return <></>;

  return (
    <Grid>
      <Grid.Column width={10}>
        <EventDetailedHeader event={event} />
        <EventDetailedInfo event={event} />
        <EventDetailedChat eventId={event.id} />
      </Grid.Column>
      <Grid.Column width={6}>
        <EventDetailedSidebar event={event!} />
      </Grid.Column>
    </Grid>
  );
});
