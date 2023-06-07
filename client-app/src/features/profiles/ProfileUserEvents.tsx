import { observer } from "mobx-react-lite";
import { Grid, Card, Image } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { Link } from "react-router-dom";
import { format } from "date-fns";

export default observer(function ProfileUserEvents() {
  const {
    profileStore: { userEvents },
  } = useStore();
  return (
    <Grid>
      <Grid.Column width={16}>
        <Card.Group itemsPerRow={4}>
          {userEvents.map((userEvent) => (
            <Card
              key={userEvent.id}
              as={Link}
              to={`/events/${userEvent.id}`}
              style={{ marginBottom: "3%", textAlign: "center" }}
            >
              <Image src={`/assets/categoryImages/${userEvent.category}.jpg`} fluid />
              <Card.Content>
                <Card.Header>{userEvent.title}</Card.Header>
              </Card.Content>
              <Card.Content extra>
                <span>{format(userEvent.date, "dd MMM yyyy h:mm aa")}</span>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
      </Grid.Column>
    </Grid>
  );
});
