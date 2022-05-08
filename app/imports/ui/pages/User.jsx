import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Container, Loader, Card, Image, Segment, Header, Grid, Button, Icon } from 'semantic-ui-react';
import { withTracker } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';
import { _ } from 'meteor/underscore';
import { Link } from 'react-router-dom';
import swal from 'sweetalert';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { Users } from '../../api/users/Users';
import { UsersLocations } from '../../api/users/UsersLocations';

function deleteCard(usrID) {
  // find email from id in users collection
  const usrEmail = _.pluck(Users.collection.find({ _id: usrID }).fetch(), 'email');
  // remove from user
  Users.collection.update({ _id: usrID }, { $unset: { firstName: 1, lastName: 1,
    role: 1, profilePicture: 1, bio: 1, arriveTime: 1,
    leaveTime: 1, location: 1, contact: 1, rating: 1 } }, false, true);
  // find location id with email
  // remove from location
  const usrLocID = _.pluck(UsersLocations.collection.find({ profile: usrEmail[0] }).fetch(), '_id');
  UsersLocations.collection.remove({ _id: usrLocID[0] });
  swal('Success', 'Account Deleted Successfully', 'success');
}
/** Returns the Profile and associated Projects and Interests associated with the passed user email. */
/** get email of user in users collection, find matching email in profiles collection, when found display that data */
const MakeCard = (props) => (
  <Grid centered padded style={{ paddingTop: '30px', paddingBottom: '30px' }}>
    <Grid.Row columns={2}>
      <Grid.Column>
        {props.profile.rating === 5 ? (
          <Image label={{
            as: 'a',
            color: 'green',
            content: '5 Star Rating',
            icon: 'star',
            ribbon: true,
          }} src={props.profile.profilePicture} fluid rounded />
        ) : ''}
        {props.profile.rating <= 2 && props.profile.rating !== 0 ? (
          <Image label={{
            as: 'a',
            color: 'red',
            content: 'Low Star Rating',
            icon: 'star',
            ribbon: true,
          }} src={props.profile.profilePicture} fluid rounded />
        ) : '' }
        {props.profile.rating > 2 && props.profile.rating < 5 ? (
          <Image src={props.profile.profilePicture} fluid rounded className='userImg'/>
        ) : '' }
        {props.profile.rating === 0 ? (
          <Image src={props.profile.profilePicture} fluid rounded className='userImg'/>
        ) : '' }
      </Grid.Column>
      <Grid.Column>
        <Header as="h2">{props.profile.firstName} {props.profile.lastName}</Header>
        <hr style={{ width: '50%', marginLeft: '0' }}/>
        <Header as="h5">{props.profile.role} Location: {_.pluck(UsersLocations.collection.find({
          profile: props.profile.email }).fetch(), 'location')}<Icon name='map pin'/></Header>
        <Header as="h5">  {props.profile.bio}</Header>
        <Header as="h4"> Arrives: {props.profile.arriveTime} | Leaves {props.profile.leaveTime}</Header>
        <Header as="h4"> Contact me: {props.profile.contact}</Header>
        <Header as="h4">Star Rating: {props.profile.rating} <Icon name='star'/></Header>
        <Button basic color='blue' id='edit-button' size='tiny' as={Link} to={`/useredit/${props.profile._id}`}><Icon name='edit outline'/>
          Edit my profile</Button>
        <Button basic color='red' id='delete-button' size='tiny' as={Link} onClick={() => deleteCard(props.profile._id)} to={'/user'}>
          <Icon name='trash alternate outline'/>
          Delete my profile</Button>
      </Grid.Column>
    </Grid.Row>
  </Grid>
);

MakeCard.propTypes = {
  profile: PropTypes.object.isRequired,
};

/** Renders the Profile Collection as a set of Cards. */
class ProfilesPage extends React.Component {

  /** If the subscription(s) have been received, render the page, otherwise show a loading icon. */
  render() {
    return (this.props.ready) ? this.renderPage() : <Loader active>Getting data</Loader>;
  }

  /** Render the page once subscriptions have been received. */
  renderPage() {
    const usrEmail = Meteor.users.findOne({ _id: Meteor.userId() }).username;
    const usrAccount = Users.collection.findOne({ email: usrEmail });
    const myId = usrAccount._id;
    if (typeof usrAccount === 'undefined' || typeof usrAccount.firstName === 'undefined') {
      return (
        <Container id="account-page">
          <Header as="h1" textAlign='center'>Your Profile</Header>
          <Segment textAlign='center'>It seems you do not have a profile yet! Click
            <Link id='create-button' color='blue' to={`/useredit/${myId}`}> here</Link> to create your profile.</Segment>
        </Container>
      );
    }
    return (
      <Container id="account-page">
        <Card.Group centered>
          <MakeCard profile={usrAccount}/>
        </Card.Group>
      </Container>
    );
  }
}

ProfilesPage.propTypes = {
  ready: PropTypes.bool.isRequired,
};

/** withTracker connects Meteor data to React components. https://guide.meteor.com/react.html#using-withTracker */
export default withTracker(() => {
  // Ensure that minimongo is populated with all collections prior to running render().
  const sub1 = Meteor.subscribe(Profiles.userPublicationName);
  const sub2 = Meteor.subscribe(ProfilesInterests.userPublicationName);
  const sub3 = Meteor.subscribe(ProfilesProjects.userPublicationName);
  const sub4 = Meteor.subscribe(Projects.userPublicationName);
  const subUsers = Meteor.subscribe(Users.userPublicationName);
  const subUserLoc = Meteor.subscribe(UsersLocations.userPublicationName);
  return {
    ready: sub1.ready() && sub2.ready() && sub3.ready() && sub4.ready() && subUsers.ready() && subUserLoc.ready(),
  };
})(ProfilesPage);
