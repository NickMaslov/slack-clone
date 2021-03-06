import React, { Component } from 'react';
import firebase from '../../firebase';
import { connect } from 'react-redux';
import { setCurrentChannel, setPrivateChannel } from '../../actions';
import { Menu, Icon, Modal, Form, Input, Button } from 'semantic-ui-react';

export class Channels extends Component {
  state = {
    channels: [],
    modal: false,
    channelName: '',
    channelDetails: '',
    channelRef: firebase.database().ref('channels'),
    user: this.props.currentUser,
    firstload: true,
    activeChannel: '',
  };

  componentDidMount() {
    this.addListeners();
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  addListeners = () => {
    let loadedChannels = [];
    this.state.channelRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      this.setState({ channels: loadedChannels }, () => this.setFirstChannel());
    });
  };

  removeListeners = () => {
    this.state.channelRef.off();
  };

  setFirstChannel = () => {
    const firstChannel = this.state.channels[0];
    if (this.state.firstload && this.state.channels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
    }
    this.setState({ firstload: false });
  };

  addChannel = () => {
    const { channelRef, channelName, channelDetails, user } = this.state;

    const key = channelRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: user.displayName,
        avatar: user.photoURL,
      },
    };

    channelRef
      .child(key)
      .update(newChannel)
      .then(() => {
        this.setState({ channelName: '', channelDetails: '' });
        this.closeModal();
        console.log(' channel added 2');
      })
      .catch(err => console.error(err));
  };

  handleSubmit = event => {
    event.preventDefault();
    if (this.isFormValid(this.state)) {
      console.log(' channel added 1');
      this.addChannel();
    }
  };

  isFormValid = ({ channelName, channelDetails }) =>
    channelName && channelDetails;

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  displayChannels = channels =>
    channels.length > 0 &&
    channels.map(channel => (
      <Menu.Item
        key={channel.id}
        onClick={() => this.changeChannel(channel)}
        name={channel.name}
        style={{ opasity: '0.7' }}
        active={channel.id === this.state.activeChannel}
      >
        # {channel.name}
      </Menu.Item>
    ));

  closeModal = () => {
    this.setState({ modal: false, channelName: '', channelDetails: '' });
  };

  openModal = () => {
    this.setState({ modal: true });
  };

  render() {
    const { channels, modal } = this.state;
    return (
      <React.Fragment>
        <Menu.Menu className="menu">
          <Menu.Item>
            <span>
              <Icon name="exchange" /> CHANNELS{'  '}
            </span>
            ({channels.length}) <Icon name="add" onClick={this.openModal} />
          </Menu.Item>
          {/* Channels */}
          {this.displayChannels(channels)}
        </Menu.Menu>
        {/* Add Channel Modal */}
        <Modal basic open={modal} onClose={this.closeModal}>
          <Modal.Header>Add a Channel</Modal.Header>
          <Modal.Content>
            <Form onSubmit={this.handleSubmit}>
              <Form.Field>
                <Input
                  fluid
                  label="Name of Channel"
                  name="channelName"
                  onChange={this.handleChange}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  fluid
                  label="About the Channel"
                  name="channelDetails"
                  onChange={this.handleChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" inverted onClick={this.handleSubmit}>
              <Icon name="checkmark" /> Add
            </Button>
            <Button color="red" inverted onClick={this.closeModal}>
              <Icon name="remove" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(
  null,
  { setCurrentChannel, setPrivateChannel }
)(Channels);
