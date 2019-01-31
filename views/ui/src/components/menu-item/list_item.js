import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Styled from 'styled-components';
import { withStyles, Typography } from '@material-ui/core';

import MessageIcon from '@material-ui/icons/Message';
import UserIcon from '@material-ui/icons/AccountCircle';

const Menu = Styled.div`
    display: flex;
    justify-content: space-around;
    align-items: center;
    position: absolute;
    right: 0;
    visibility: ${props => props.hovering ? 'visible' : 'hidden'};
    background: ${props => {
        let { hovering, selected } = props;

        if (hovering && selected)
            return '#2E353D'
        else if (hovering && !selected)
            return '#323941'
        else if (selected)
            return '#404953'

        return '#363E47';
    }};

    width: ${props => {
            return props.hovering ? '85%' : '0%'
        }
    };

    height: 100%;
    transition: all ease-in-out .5s;
    
`;

class menu_item extends Component {

  constructor(props) {
      super(props);
      this.state = {};
  }
  createSnippet(str, length) {
      if(str.length <= length)
        return str;
      else return str.substr(str, length) + "...";
  }

  render() {
    const { classes } = this.props;
    return (
      <MenuItem onMouseEnter={this.props.onMouseEnter} onMouseLeave={this.props.onMouseLeave} selected={this.props.selectedIndex} onClick={()=>this.props.handleClick()} classes={{
          root: classes.root,
          selected: classes.selected
      }}>
        {this.props.avatar}
        <Menu hovering={this.props.hovering} selected={this.props.selectedIndex}>
            <div onClick={this.props.privateMessage}><MessageIcon></MessageIcon></div>
            <div onClick={()=>console.log('clicked menu item 2')}><UserIcon></UserIcon></div>
        </Menu>
        <ListItemText 
            primary = {
                <Typography style={{ color: 'white'}}>
                    {this.props.name}
                </Typography>
            }
            secondary = {
                <Typography style={{ color: 'white'}}>
                    {this.createSnippet(this.props.subText, 35)}
                </Typography>
            }
        />
      </MenuItem>
    )
  }
}

const Styles = theme => ({
    root: {
        padding: "30px 10px",
        '&$selected': {
            background: '#404953'
        }
    },

    selected: {}
})

export const ListItem = withStyles(Styles)(menu_item);