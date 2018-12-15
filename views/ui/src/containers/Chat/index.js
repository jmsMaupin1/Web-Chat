import React, { Component } from 'react'
import Auth from 'helper/protectedRoute';
import { Chat } from './chat_component';

export default class index extends Component {
  render() {
    return (
      <Auth>
          <Chat />
      </Auth>
    )
  }
}
