import React, { Component } from 'react'
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';

import { ListItem } from 'components/menu_item';
import AvatarPlaceHolder from 'assets/avatar-placeholder.png';

class sidebar extends Component {
  constructor(props) {
      super(props);

      this.state = {
          selectedIndex: -1
      }
  }

  handleClick(e) {
      this.setState({selectedIndex: e})
  }

  createSnippet(str) {
      return str.substr(str, 35) + "...";
  }

  render() {
    return (
        <div style={{height: '93vh', background: '#363E47', overflowY: 'scroll'}}>
            <List>
                <ListItem
                    handleClick={this.handleClick.bind(this, 0)}
                    selected={this.state.selectedIndex === 0}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />

                <ListItem
                    handleClick={this.handleClick.bind(this, 1)}
                    selected={this.state.selectedIndex === 1}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />
            </List>
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
    
})

export const Sidebar = connect(mapStateToProps, null)(withStyles(Styles)(sidebar))