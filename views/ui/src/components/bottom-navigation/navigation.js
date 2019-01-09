import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import MessageIcon from '@material-ui/icons/Message';
import UserIcon from '@material-ui/icons/AccountCircle';
import { connect } from 'react-redux';
import { PEOPLE, ROOMS, chooseSidebarView } from 'state/actions/sidebar';

const Style = {
    root: {
        position: 'fixed',
        bottom: '0',
        width: '25vw',
        height: '10vh',
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
                onClick={this.props.chooseRooms}
                label="Rooms" 
                icon={<UserIcon />} 
            />
    
            <BottomNavigationAction 
                classes={{
                    root: classes.actionItem,
                    selected: classes.selected
                }}
                onClick={this.props.chooseMessages}
                label="People" 
                icon={<MessageIcon />} 
            />

            </BottomNavigation>
          </div>
        )
      }
}

const mapDispatchToProps = {
    chooseMessages: () => chooseSidebarView(PEOPLE),
    chooseRooms   : () => chooseSidebarView(ROOMS),
}

export const BottomNav = connect(null, mapDispatchToProps)(withStyles(Style)(bottom_navigation));