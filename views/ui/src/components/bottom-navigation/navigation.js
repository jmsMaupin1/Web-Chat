import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MessageIcon from '@material-ui/icons/Message';
import UserIcon from '@material-ui/icons/AccountCircle';

const Style = {
    root: {
        position: 'fixed',
        bottom: '0',
        width: '25vw',
        height: '7vh',
        background: '#303841',
        color: 'black'
    },

    actionItem: {
        color: 'white',
        "&$selected" : {
            color: 'white'
        }
    },

    selected: {}
}

class bottom_navigation extends Component {
    constructor(props) {
        super(props);
        
        this.state = {
          value: 0
        };
      }
    
      handleChange = (event, value) => {
        this.setState({ value });
      }  
      
      render() {
        const { classes } = this.props;
        const { value } = this.state;
        return (
          <div>
            <CssBaseline />
            <BottomNavigation
              value={value}
              onChange={this.handleChange}
              className={classes.root}   
            >
    
            <BottomNavigationAction 
                classes={{
                    root: classes.actionItem,
                    selected: classes.selected
                }} 
                label="Messages" 
                icon={<MessageIcon />} 
            />

            <BottomNavigationAction
                classes={{
                    root: classes.actionItem,
                    selected: classes.selected
                }}
                label="Rooms" 
                icon={<UserIcon />} 
            />
            </BottomNavigation>
          </div>
        )
      }
}

export const BottomNav = withStyles(Style)(bottom_navigation);