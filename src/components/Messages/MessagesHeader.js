import React, { Component } from 'react';
import { Segment, Header, Icon, Input } from 'semantic-ui-react';

export class MessagesHeader extends Component {
  render() {
    return (
      <Segment clearing>
        {/* Channel Title */}
        <Header fluid="true" as="h2" floated="left" style={{ marginBottom: 0 }}>
          <span>
            Channel
            <Icon name={'star outline'} color="black" />
          </span>
          <Header.Subheader> 2 Users</Header.Subheader>
        </Header>

        {/* Channel Search Input  */}
        <Header flaoted="right">
          <Input
            size="mini"
            icon="search"
            name="searchTerm"
            placeholder="Search Messages"
          />
        </Header>
      </Segment>
    );
  }
}

export default MessagesHeader;
