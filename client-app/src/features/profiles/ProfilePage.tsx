import { observer } from "mobx-react-lite";
import { useStore } from "../../app/stores/store";
import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import { useParams } from "react-router-dom";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";

export default observer(function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const {
    profileStore: {loadLatestProfile, profile },
  } = useStore();

  useEffect(() => {
    loadLatestProfile(username);
  }, [loadLatestProfile, username]);

  return (
    <Grid>
      <Grid.Column width={16}>
        {profile && (
          <>
            <ProfileHeader profile={profile} />
            <ProfileContent profile={profile} />
          </>
        )}
      </Grid.Column>
    </Grid>
  );
});
