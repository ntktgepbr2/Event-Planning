import { Button, Header, Icon, Segment } from "semantic-ui-react";
import agent from "../../app/api/agent";
import useQuery from "../../app/common/util/hooks";

export default function RegisterSuccess() {
  const email = useQuery().get("email") as string;

  function handleConfirmEmailResend() {
    agent.account.resendLink(email);
  }
  return (
    <Segment placeholder textAlign='center'>
      <Header icon color='green'>
        <Icon name='check' />
        Successfully registered!
      </Header>
      <p>Please check you email for the verification link.</p>
      {email && (
        <>
          <p>Didn't recieve the email? Click the button to resend</p>
          <Button primary onClick={handleConfirmEmailResend} content='Resend emeil' size='huge' />
        </>
      )}
    </Segment>
  );
}
