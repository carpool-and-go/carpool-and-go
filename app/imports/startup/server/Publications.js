import { Meteor } from 'meteor/meteor';
import { Interests } from '../../api/interests/Interests';
import { Notes } from '../../api/note/Notes';
import { Profiles } from '../../api/profiles/Profiles';
import { ProfilesInterests } from '../../api/profiles/ProfilesInterests';
import { ProfilesProjects } from '../../api/profiles/ProfilesProjects';
import { Projects } from '../../api/projects/Projects';
import { ProjectsInterests } from '../../api/projects/ProjectsInterests';
import { Users } from '../../api/users/Users';
import { UsersLocations } from '../../api/users/UsersLocations';
import { Locations } from '../../api/locations/Locations';
import { Contacts } from '../../api/contact/Contacts';
import { Requests } from '../../api/request/requests';

/** Define a publication to publish all interests. */
Meteor.publish(Interests.userPublicationName, () => Interests.collection.find());

/** Define a publication to publish all profiles. */
Meteor.publish(Profiles.userPublicationName, () => Profiles.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesInterests.userPublicationName, () => ProfilesInterests.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProfilesProjects.userPublicationName, () => ProfilesProjects.collection.find());

/** Define a publication to publish all projects. */
Meteor.publish(Projects.userPublicationName, () => Projects.collection.find());

/** Define a publication to publish this collection. */
Meteor.publish(ProjectsInterests.userPublicationName, () => ProjectsInterests.collection.find());

Meteor.publish(Requests.userPublicationName, () => Requests.collection.find());

/** Define a publication to publish all users */
Meteor.publish(Users.userPublicationName, () => Users.collection.find());
Meteor.publish(UsersLocations.userPublicationName, () => UsersLocations.collection.find());
Meteor.publish(Locations.userPublicationName, () => Locations.collection.find());

// User-level publication.
// If logged in, then publish documents owned by this user. Otherwise publish nothing.
Meteor.publish(Contacts.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Contacts.collection.find({ owner: username });
  }
  return this.ready();
});

Meteor.publish(Notes.userPublicationName, function () {
  if (this.userId) {
    const username = Meteor.users.findOne(this.userId).username;
    return Notes.collection.find({ owner: username });
  }
  return this.ready();
});

// alanning:roles publication
// Recommended code to publish roles for each user.
Meteor.publish(null, function () {
  if (this.userId) {
    return Meteor.roleAssignment.find({ 'user._id': this.userId });
  }
  return this.ready();
});
