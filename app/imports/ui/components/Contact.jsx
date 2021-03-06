import React from 'react';
import { Card, Image, Feed } from 'semantic-ui-react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Note from './Note';
import AddNote from './AddNote';

/** Renders a single row in the List Stuff table. See pages/ListStuff.jsx. */
class Contact extends React.Component {
  render() {
    return (
      <Card centered >
        <Card.Content>
          <Image
            floated='right'
            size='mini'
            src={this.props.contact.image}
          />
          <Card.Header>{this.props.contact.departureTime} {this.props.contact.arrivalTime}</Card.Header>
          <Card.Meta>{this.props.contact.currentLocation}</Card.Meta>
          <Card.Meta>{this.props.contact.endDestination}</Card.Meta>
          <Card.Description>
            {this.props.contact.note}
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
          <Feed>
            {this.props.notes.map((note, index) => <Note key={index} note={note}/>)}
          </Feed>
          <Card.Content extra>
            <AddNote owner={this.props.contact.owner} contactId={this.props.contact._id}/>
          </Card.Content>
        </Card.Content>
      </Card>
    );
  }
}

// Require a document to be passed to this component.
Contact.propTypes = {
  contact: PropTypes.object.isRequired,
  notes: PropTypes.array.isRequired,
};

// Wrap this component in withRouter since we use the <Link> React Router element.
export default withRouter(Contact);
