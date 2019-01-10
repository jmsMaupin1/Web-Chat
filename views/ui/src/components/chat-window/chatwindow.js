import React, { Component } from 'react'
import Styled from 'styled-components';
import { connect } from 'react-redux';

import Message from 'components/message';

import { sendMessage } from 'state/actions/server';

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

  constructor(props) {
      super(props);

      this.state = {
          chatRef: null,
          chatMessage: ''
      }

      this.chatRef = React.createRef();
      this.bottomRef = React.createRef();

      this.handleChange = this.handleChange.bind(this);
      this.keyDown = this.keyDown.bind(this);
  }

  scrollToMyRef = () => {   // run this method to execute scrolling. 
        console.log(this.chatRef.current.offsetTop)
        window.scrollTo({
            top:this.chatRef.current.offsetTop-20, 
            behavior: "smooth"   // Optional, adds animation
        })
    }

  componentDidUpdate = (prevProps, prevState) => {
      this.chatRef.scrollTop = this.chatRef.scrollHeight;
  }
  

  keyDown(e) {
      if (e.keyCode === 13 && e.shiftKey === false) {
          e.preventDefault();
          if(this.props.currentRoom) {
              sendMessage(
                  this.props.currentRoom,
                  this.state.chatMessage,
                  this.props.user
              )
          }
          this.setState({
              chatMessage: ''
          })
      }    
  }

  handleChange(e) {
      this.setState({
          chatMessage: e.target.value
      })
  }

  render() {
    const {messages, currentRoom} = this.props;
    const chatMessages = messages[currentRoom._id];

    return (
      <ChatContainer>
          <MessageWindow ref={el => this.chatRef = el}>
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
              <div ref={el => this.bottomRef = el}></div>
          </MessageWindow>

          <ChatBox value={this.state.chatMessage} onChange={this.handleChange} onKeyDown={this.keyDown}/>       
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