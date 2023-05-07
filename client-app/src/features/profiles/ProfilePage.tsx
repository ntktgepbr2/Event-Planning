import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import { Container, Grid, Header, Segment } from "semantic-ui-react";

export default observer(function ProfilePage() {
  const {
    profileStore: { loadProfile, profile },
  } = useStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <Container>
      {profile ? (
        <Segment>
          <Grid columns={2} stackable>
            <Grid.Row>
              <Grid.Column>
                <Header as='h2'>{profile.displayName}</Header>
                <p>{profile.bio}</p>
              </Grid.Column>
              <Grid.Column>
                <Header as='h2'>Profile Picture</Header>
                <img src={profile.image || "/assets/user.png"} alt='Profile' />
              </Grid.Column>
            </Grid.Row>
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
      ) : (
        <p>Loading profile...</p>
      )}
    </Container>
  );
});
