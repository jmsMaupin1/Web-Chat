import React, { Component } from 'react'
import Styled from 'styled-components';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import AvatarPlaceHolder from 'assets/avatar-placeholder.png';

const AvatarContainer = Styled.div`
    display: flex;
    align-items: center;
`;

const Content  = Styled.div`
    display: flex;
`;

const Message  = Styled.div`
    padding: 10px;
    border-radius: 10px;
`;

const MessageContent = Styled.div``;

const Username = Styled.div``;

const MessageContainer = Styled.div`
    display: block;
    padding: 10px 0;

    ${Content} {
        flex-direction: ${props => props.mine ? 'row-reverse' : 'row'};
    }

    ${MessageContent} {
        padding: ${props => props.mine ? '0 10px 0 0' : '0 0 0 10px'};
    }

    ${Message} {
        background-color: ${props => props.mine ? '#eef' : '#ddd'}
    }

    ${Username} {
        text-align: ${props => props.mine ? 'right' : 'left'};
        padding: ${props => props.mine ? '0 5px 0 0' : '0 0 0 5px'};
    }
`;
export default class message extends Component {
  render() {
    return (
      <MessageContainer mine={this.props.mine}>
          <Content>
              <AvatarContainer>
                  <ListItemAvatar>
                      <Avatar src={AvatarPlaceHolder} />
                  </ListItemAvatar>
              </AvatarContainer>

              <MessageContent>
                  <Message>
                      {this.props.message}
                  </Message>
                  <Username>
                      <strong>
                          {this.props.username}
                      </strong>
                  </Username>
              </MessageContent>
          </Content>
      </MessageContainer>
    )
  }
}
