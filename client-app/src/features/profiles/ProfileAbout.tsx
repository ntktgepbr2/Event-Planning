import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { Button, Container, Grid, Header, Segment } from "semantic-ui-react";
import LoadingComponents from "../../app/layout/LoadingComponents";
import { Link } from "react-router-dom";

export default observer(function ProfileAbout() {
  const {
    profileStore: { profile, isCurrentUser },
  } = useStore();

  return (
    <Container>
      {profile ? (
        <>
          <Segment>
            <Grid columns={2} stackable>
              <Grid.Row>
                <Grid.Column>
                  <Header as='h3'>First Name</Header>
                  <p>{profile.firstName}</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as='h3'>Second Name</Header>
                  <p>{profile.secondName}</p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header as='h3'>Gender</Header>
                  <p>{profile.gender}</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as='h3'>Phone</Header>
                  <p>{profile.phone}</p>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Header as='h3'>Address</Header>
                  <p>{profile.address}</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as='h3'>Birthday</Header>
                  <p>{profile.birthday}</p>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
          <Segment>
            <Grid.Column>
              <Header as='h3'>Bio</Header>
              <span style={{ whiteSpace: "pre-wrap" }}>{profile.bio}</span>
            </Grid.Column>
          </Segment>
          {isCurrentUser && (
            <Button as={Link} to='/updateProfile' color='teal' content='Edit' size='large' />
          )}
        </>
      ) : (
        <LoadingComponents content='Loading....' />
      )}
    </Container>
  );
});
