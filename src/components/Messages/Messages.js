import React, { Component } from 'react';
import firebase from '../../firebase';
import { Segment, Comment } from 'semantic-ui-react';
import MessagesHeader from './MessagesHeader';
import MessagesForm from './MessagesForm';
import Message from './Message';

export default class Messages extends Component {
  state = {
    messagesRef: firebase.database().ref('messages'),
    channel: this.props.currentChannel,
    user: this.props.currentUser,
    messages: [],
    messagesLoading: true,
    progressBar: false,
    numUniqueUsers: '',
    searchTerm: '',
    searchLoading: false,
    searchResults: [],
    privateChannel: this.props.isPrivateChannel,
    privateMessagesRef: firebase.database().ref('privateMessages'),
  };

  componentDidMount() {
    const { channel, user } = this.state;

    if (channel && user) {
      this.addListener(channel.id);
    }
  }

  addListener = channelId => {
    this.addMessageListener(channelId);
  };

  addMessageListener = channelId => {
    let loadedMessages = [];
    const ref = this.getMessagesRef();
    ref.child(channelId).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({ messages: loadedMessages, messagesLoading: false });
      this.countUniqueUsers(loadedMessages);
    });
  };

  getMessagesRef = () => {
    const { messagesRef, privateMessagesRef, privateChannel } = this.state;
    return privateChannel ? privateMessagesRef : messagesRef;
  };

  handleSearchChange = event => {
    this.setState(
      {
        searchTerm: event.target.value,
        searchLoading: true,
      },
      () => this.handleSearchMessages()
    );
  };

  handleSearchMessages = () => {
    const channelMessages = [...this.state.messages];
    const regex = new RegExp(this.state.searchTerm, 'gi');
    const searchResults = channelMessages.reduce((acc, message) => {
      if (
        (message.content && message.content.match(regex)) ||
        message.user.name.match(regex)
      ) {
        acc.push(message);
      }
      return acc;
    }, []);
    this.setState({ searchResults });
    setTimeout(() => this.setState({ searchLoading: false }), 1000);
  };

  countUniqueUsers = messages => {
    const uniqueUsers = messages.reduce((acc, message) => {
      if (!acc.includes(message.user.name)) {
        acc.push(message.user.name);
      }
      return acc;
    }, []);
    const plural = uniqueUsers.length > 1 || uniqueUsers.length === 0;
    const numUniqueUsers = `${uniqueUsers.length} user${plural ? 's' : ''}`;
    this.setState({ numUniqueUsers });
  };

  displayMessages = messages =>
    messages.length > 0 &&
    messages.map(message => (
      <Message
        key={message.timestamp}
        message={message}
        user={this.state.user}
      />
    ));

  displayChannelName = channel => {
    //(channel ? `#${channel.name}` : '');
    return channel
      ? `${this.state.privateChannel ? '@' : '#'}${channel.name}`
      : '';
  };

  // isProgressBarVisible = percent => {
  //   if (percent > 0) {
  //     this.setState({ progressBar: true });
  //   }
  // };

  render() {
    const {
      messagesRef,
      channel,
      user,
      messages,
      // progressBar,
      numUniqueUsers,
      searchResults,
      searchTerm,
      searchLoading,
      privateChannel,
    } = this.state;

    return (
      <React.Fragment>
        <MessagesHeader
          channelName={this.displayChannelName(channel)}
          numUniqueUsers={numUniqueUsers}
          handleSearchChange={this.handleSearchChange}
          searchLoading={searchLoading}
          isPrivateChannel={privateChannel}
        />

        <Segment>
          <Comment.Group
            //className={progressBar ? 'messages__progress' : 'messages'}
            className="messages"
          >
            {searchTerm
              ? this.displayMessages(searchResults)
              : this.displayMessages(messages)}
          </Comment.Group>
        </Segment>

        <MessagesForm
          messagesRef={messagesRef}
          currentChannel={channel}
          currentUser={user}
          //   isProgressBarVisible={this.isProgressBarVisible}
          isPrivateChannel={privateChannel}
          getMessagesRef={this.getMessagesRef}
        />
      </React.Fragment>
    );
  }
}
