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

                <ListItem
                    handleClick={this.handleClick.bind(this, 2)}
                    selected={this.state.selectedIndex === 2}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />

                <ListItem
                    handleClick={this.handleClick.bind(this, 3)}
                    selected={this.state.selectedIndex === 3}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />

                <ListItem
                    handleClick={this.handleClick.bind(this, 4)}
                    selected={this.state.selectedIndex === 4}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />

                <ListItem
                    handleClick={this.handleClick.bind(this, 5)}
                    selected={this.state.selectedIndex === 5}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />

                <ListItem
                    handleClick={this.handleClick.bind(this, 6)}
                    selected={this.state.selectedIndex === 6}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />

                <ListItem
                    handleClick={this.handleClick.bind(this, 7)}
                    selected={this.state.selectedIndex === 7}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />

                <ListItem
                    handleClick={this.handleClick.bind(this, 8)}
                    selected={this.state.selectedIndex === 8}
                    altText="PersonsName"
                    avatarSrc={AvatarPlaceHolder}
                    name="Persons Name"
                    subText="This is a snippet"
                />
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
    
})

export const Sidebar = connect(mapStateToProps, null)(withStyles(Styles)(sidebar))