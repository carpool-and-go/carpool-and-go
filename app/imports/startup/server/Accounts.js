import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Roles } from 'meteor/alanning:roles';

/* eslint-disable no-console */

Meteor.methods({ 'addAdminToUser'({ email }) {
  const usrAccount = Meteor.users.findOne({ username: email });
  console.log(usrAccount);
  const thisId = usrAccount._id;
  Roles.addUsersToRoles(thisId, 'admin');
},
});

function createUser(email, password, role) {
  console.log(`  Creating user ${email}.`);
  const userID = Accounts.createUser({
    username: email,
    email: email,
    password: password,
  });
  // let newRole = role;
  // if (email.includes('carpoolngo.com')) {
    // console.log('true');
    // newRole = 'admin';
  // }
  if (role === 'admin' || email.includes('carpoolngo.com')) {
    Roles.createRole(role, { unlessExists: true });
    Roles.addUsersToRoles(userID, 'admin');
  }
}

// When running app for first time, pass a settings file to set up a default user account.
if (Meteor.users.find().count() === 0) {
  if (Meteor.settings.defaultAccounts) {
    console.log('Creating the default user(s)');
    Meteor.settings.defaultAccounts.map(({ email, password, role }) => createUser(email, password, role));
  } else {
    console.log('Cannot initialize the database!  Please invoke meteor with a settings file.');
  }
}
