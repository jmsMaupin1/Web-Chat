import React, { Component } from 'react'
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { CustomScrollbar } from 'components/custom-scrollbar';
import List from '@material-ui/core/List';

import { ListItem } from 'components/menu-item';
import { ROOMS, getMessageHistory } from 'state/actions/server';
import { chooseRoom } from 'state/actions/sidebar';
import AvatarPlaceHolder from 'assets/avatar-placeholder.png';

class sidebar extends Component {
  constructor(props) {
      super(props);

      this.state = {
          selectedIndex: -1,
          top: 0,
      }
  }

  handleScrollFrame = (values) => {
    const { top } = values;
    this.setState({ top });
  }

  renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
        backgroundColor: `rgba(0, 250, 250, .8)`
    };
    return (
        <div
            style={{ ...style, ...thumbStyle }}
            {...props}
        />
    );
}

  handleClick(index, payload) {
      this.setState({selectedIndex: index});

      if (this.props.view === ROOMS) {
          this.props.chooseRoom(payload);
          getMessageHistory(payload);
      }
  }

  createSnippet(str) {
      return str.substr(str, 35) + "...";
  }

  generateList(view, props) {
      if(view === ROOMS)
        return Object.keys(props.rooms);
      else
        return props.participants;
  }  

  render() {
    const sidebarList = this.generateList(
        this.props.view,
        this.props
    )
    return (
        <div style={{
            height: '90vh', 
            background: '#363E47', 
            overflowY: 'hidden'
        }}>
        <CustomScrollbar autoHide
            onScrollFrame={this.handleScrollFrame}
            renderThumbVertical={this.renderThumb}
        >
            <List>
                {
                    sidebarList ? sidebarList.map( (cur, index, arr) => {
                        let name = this.props.view === ROOMS ? cur : cur.username;
                        let payload = this.props.view === ROOMS ? this.props.rooms[cur] : cur;
                        let subText = this.props.view === ROOMS ? this.props.rooms[cur].lastMessage.message : '';

                        console.log(this.props.view === ROOMS ? this.props.rooms[cur].lastMessage : '')
                        return (
                            <ListItem 
                                key={index}
                                handleClick={this.handleClick.bind(this, index, payload)}
                                selectedIndex={this.state.selectedIndex === index}
                                altText={name}
                                name={name}
                                avatarSrc={AvatarPlaceHolder}
                                subText={subText}
                            />
                        )
                    }) 
                    :<></>
                }
            </List>
        </CustomScrollbar>
        </div>
    )
  }
}

const Styles = theme => ({
    items: {
        padding: "30px 10px",

        '&$selected': {
            background: '#404953'
        }
    },

    selected: {}
});

const mapStateToProps = state => ({
    user : state.user.user,
    view : state.sidebar.view,
    rooms : state.sidebar.rooms,
    currentRoom : state.sidebar.currentRoom,
    participants : state.sidebar.currentRoom.participants
})

const mapDispatchToPropps = {
    chooseRoom: chooseRoom,
};

export const Sidebar = connect(mapStateToProps, mapDispatchToPropps)(withStyles(Styles)(sidebar))