import React, { Component } from 'react'
import Styled from 'styled-components';
import { connect } from 'react-redux';

import Message from 'components/message';

const ChatContainer = Styled.div`
    display: grid;
    height: 100vh;
    grid-template-rows: 90fr 10fr;
`;

const ChatBox = Styled.textarea`
    display: block;
    border-top: 1px solid black;
`;

const MessageWindow = Styled.div`
    overflow-y: auto;
    padding: 20px;
`;

class chatWindow extends Component {
  render() {
    const {messages, currentRoom} = this.props;
    const chatMessages = messages[currentRoom.name];
    return (
      <ChatContainer>
          <MessageWindow>
              {
                  chatMessages ? chatMessages.map( msg => {
                      let me = JSON.parse(this.props.user);
                      return (
                        <Message
                            key={msg._id}
                            mine={msg.user._id === me._id} 
                            message={msg.message}
                            username={msg.user.username}/>)
                  }) : null
              }
          </MessageWindow>

          <ChatBox />       
      </ChatContainer>
    )
  }
}

const mapStateToProps = state => ({
    user: state.user.user,
    messages: state.chat.messages,
    currentRoom: state.sidebar.currentRoom,
})

export default connect(mapStateToProps, null)(chatWindow);