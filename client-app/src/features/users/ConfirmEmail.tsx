import { useEffect, useState } from "react";
import useQuery from "../../app/common/util/hooks";
import agent from "../../app/api/agent";
import { stat } from "fs";
import { Button, Header, Icon, Segment } from "semantic-ui-react";
import { Link } from "react-router-dom";

export default function ConfigrmEmail() {
  const email = useQuery().get("email") as string;
  const token = useQuery().get("token") as string;

  const Status = {
    Verifying: "Verifying",
    Failed: "Failed",
    Success: "Success",
  };

  const [status, setStatus] = useState(Status.Verifying);

  function handleConfirmEmailResend() {
    agent.account.resendLink(email);
  }

  useEffect(() => {
    agent.account
      .verifyEmail(token, email)
      .then(() => {
        setStatus(Status.Success);
      })
      .catch(() => {
        setStatus(Status.Failed);
      });
  }, [Status.Failed, Status.Success, token, email]);

  function getBody() {
    switch (status) {
      case Status.Verifying:
        return <p>Verifying...</p>;
      case Status.Failed:
        return (
          <div>
            <p>Verification failed. You can try resend the verify email</p>
            <Button primary onClick={handleConfirmEmailResend} size='huge' content='Resend email' />
          </div>
        );
      case Status.Success:
        return (
          <div>
            <p>Email has been verified - you can login now</p>
            <Button as={Link} to='/login' size='huge' inverted>
              Login
            </Button>
          </div>
        );
    }
  }

  return (
    <Segment placeholder textAlign='center'>
      <Header icon>
        <Icon name='envelope' />
        Email verification
      </Header>
      <Segment.Inline>{getBody()}</Segment.Inline>
    </Segment>
  );
}
