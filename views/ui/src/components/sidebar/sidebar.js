import React, { Component } from 'react'
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import { CustomScrollbar } from 'components/custom_scrollbar';
import List from '@material-ui/core/List';

import { ListItem } from 'components/menu_item';
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
    console.log(values)
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

  handleClick(e) {
      this.setState({selectedIndex: e})
  }

  createSnippet(str) {
      return str.substr(str, 35) + "...";
  }

  render() {
    return (
        <div style={{
                height: '93vh', 
                background: '#363E47', 
                overflowY: 'hidden'
        }}>
        <CustomScrollbar autoHide
            onScrollFrame={this.handleScrollFrame}
            renderThumbVertical={this.renderThumb}
        >
            <List>
                {
                    this.props.participants.map((cur, index, arr) => {
                        return (
                            <ListItem
                                key={arr[index]._id}
                                handleClick={this.handleClick.bind(this, index)}
                                selected={this.state.selectedIndex === index}
                                altText={arr[index].username}
                                avatarSrc={AvatarPlaceHolder}
                                name={arr[index].username}
                                subText="This is still a snippet"
                            />
                        )
                    })
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
    rooms        : state.serverReducer.rooms,
    currentRoom  : state.serverReducer.currentRoom,
    participants : state.serverReducer.participants
})

export const Sidebar = connect(mapStateToProps, null)(withStyles(Styles)(sidebar))