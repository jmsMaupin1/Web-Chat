import React, { Component } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { withStyles, Typography } from '@material-ui/core';

class menu_item extends Component {
  createSnippet(str, length) {
      if(str.length <= length)
        return str;
      else return str.substr(str, length) + "...";
  }

  render() {
    const { classes } = this.props;
    return (
      <MenuItem selected={this.props.selectedIndex} onClick={()=>this.props.handleClick()} classes={{
          root: classes.root,
          selected: classes.selected
      }}>
        <ListItemAvatar>
            <Avatar 
                alt={this.props.altText} 
                src={this.props.avatarSrc}
            />
        </ListItemAvatar>
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