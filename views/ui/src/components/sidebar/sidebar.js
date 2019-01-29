import React, { Component } from 'react'
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { CustomScrollbar } from 'components/custom-scrollbar';
import List from '@material-ui/core/List';

import { ListItem } from 'components/menu-item';
import { ROOMS, PEOPLE, getMessageHistory, privateMessage } from 'state/actions/server';
import { chooseRoom } from 'state/actions/sidebar';
import AvatarPlaceHolder from 'assets/avatar-placeholder.png';

class sidebar extends Component {
  constructor(props) {
      super(props);

      this.state = {
          selectedIndex: -1,
          hoverIndex: -1,
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

  configureMenuItem(cur, index) {
    const { user } = this.props;
    const isViewRoom = this.props.view === ROOMS;
    let name = '';

    if(isViewRoom) {
        if (cur === '')
            name = this.props.rooms[cur].participants.filter((participant, index, arr) => {
                return participant._id !== this.props.user._id;
            }).username;
        else 
            name = cur;
            
    } else name = cur.username;

    return {
        name: name,
        payload: isViewRoom  ? this.props.rooms[cur] : cur,
        subText: isViewRoom && this.props.rooms[cur].lastMessage ? this.props.rooms[cur].lastMessage.message : '',
        hovering: !isViewRoom && this.state.hoverIndex === index,
        pm: !isViewRoom ? this.sendPM.bind(this, cur, user) : null
    }
  }

  onHover(index) {
      this.setState({hoverIndex: index});
  }

  leaveHover() {
      this.setState({hoverIndex: -1});
  }

  sendPM(to,from) {
      privateMessage(to, from);
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
                        let config = this.configureMenuItem(cur, index);

                        return (
                            <ListItem 
                                onMouseEnter={this.onHover.bind(this, index)}
                                onMouseLeave={this.leaveHover.bind(this)}
                                hovering={config.hovering}
                                privateMessage={config.pm}
                                userRole={'ADMIN'}
                                key={index}
                                handleClick={this.handleClick.bind(this, index, config.payload)}
                                selectedIndex={this.state.selectedIndex === index}
                                altText={config.name}
                                name={config.name}
                                avatarSrc={AvatarPlaceHolder}
                                subText={config.subText}
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
    user : JSON.parse(state.user.user),
    view : state.sidebar.view,
    rooms : state.sidebar.rooms,
    currentRoom : state.sidebar.currentRoom,
    participants : state.sidebar.currentRoom.participants
})

const mapDispatchToPropps = {
    chooseRoom: chooseRoom,
};

export const Sidebar = connect(mapStateToProps, mapDispatchToPropps)(withStyles(Styles)(sidebar))