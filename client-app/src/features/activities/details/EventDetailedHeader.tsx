import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Item, Segment, Image, Label } from "semantic-ui-react";
import { Event } from "../../../app/models/event";
import { Link } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

const eventImageStyle = {
  filter: "brightness(30%)",
};

const eventImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface Props {
  event: Event;
}

export default observer(function EventDetailedHeader({ event }: Props) {
  const {
    eventStore: { updateAttendance, loading, cancelEventToggle, isMaximumAttendanceReached },
  } = useStore();

  return (
    <Segment.Group>
      <Segment basic attached='top' style={{ padding: "0" }}>
        {event.isCanceled && (
          <Label
            color='red'
            content='Canceled'
            ribbon
            style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
          ></Label>
        )}
        <Image src={`/assets/categoryImages/music.jpg`} fluid style={eventImageStyle} />
        <Segment style={eventImageTextStyle} basic>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header size='huge' content={event.title} style={{ color: "white" }} />
                <p>{event.date}</p>
                <p>
                  Hosted by <strong>{event.host?.displayName}</strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached='bottom'>
        {event.isHost ? (
          <>
            <Button
              color={event.isCanceled ? "green" : "red"}
              floated='left'
              basic
              content={event.isCanceled ? "Undo cancel" : "Cancel event"}
              onClick={cancelEventToggle}
              loading={loading}
            />
            <Button
              disabled={event.isCanceled}
              as={Link}
              to={`/manage/${event.id}`}
              color='orange'
              floated='right'
            >
              Manage Event
            </Button>
          </>
        ) : event.isGoing ? (
          <Button loading={loading} onClick={()=>{updateAttendance(true)}}>
            Cancel attendance
          </Button>
        ) : (
          <Button
            disabled={event.isCanceled || event.isMaximumAttendensReached}
            loading={loading}
            onClick={()=>{updateAttendance()}}
            color='teal'
          >
            Join Event
          </Button>
        )}
        {event.isMaximumAttendensReached && (
          <Label
            color='red'
            content='Maxim attendees reached'
            ribbon
            style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
          ></Label>
        )}
      </Segment>
    </Segment.Group>
  );
});
