import React, { Component } from 'react'; // eslint-disable-line import/no-extraneous-dependencies
import { Button, Menu, MenuItem, Popover, Position } from '@blueprintjs/core';
import 'normalize.css/normalize.css';
import '@blueprintjs/core/dist/blueprint.css';

const getDisplayName = Component => Component.displayName ||
  Component.name ||
  (typeof Component === 'string' ? Component : 'Component');

export default class Stories extends Component {
  constructor(props) {
    super(props);
    this.state = this.getComponentsAndStories(props);
  }

  componentWillMount() {
    document.body.style.margin = 0;
    document.body.style.height = '100vh';
    document.body.style.width = '100vw';
  }

  componentWillReceiveProps(props) {
    this.setState(this.getComponentsAndStories(props));
  }

  getComponentsAndStories(props) {
    const children = Array.isArray(props.children) ? props.children : [props.children];
    const components = new Map();
    const stories = children.map((story) => {
      const { component, children } = story.props;
      const kind = getDisplayName(component);
      const states = new Map();
      const stories = (Array.isArray(children) ? children : [children]).map((state) => {
        states.set(state.props.name, state.props);

        return state.props.name;
      });

      components.set(kind, { Component: component, states });

      return { kind, stories };
    });

    return {
      components,
      stories,
      kind: (this.state && this.state.kind) || stories[0].kind,
      Component: (this.state && this.state.Component) || components.get(stories[0].kind).Component,
      props: (this.state && this.state.props) || components.get(stories[0].kind).states.values().next().value
    };
  }

  selectStory({ kind }) {
    const { Component, states } = this.state.components.get(kind);

    this.setState({ Component, props: states.values().next().value, kind });
  }

  selectProps(props) {
    this.setState({ props });
  }

  render() {
    const {
      components, stories, kind, Component, props
    } = this.state;
    const componentsMenu = (
      <Menu>
        {stories.map(story => (
          <MenuItem
            key={`components-menu-${story.kind}`}
            iconName="code"
            text={story.kind}
            onClick={() => this.selectStory(story)} />
        ))}
      </Menu>
    );
    const propsMenu = (
      <Menu>
        {Array.from(components.get(kind).states).map(([name, props]) => (
          <MenuItem
            key={`props-menu-${name}`}
            iconName="changes"
            text={name}
            onClick={() => this.selectProps(props)} />
        ))}
      </Menu>
    );

    return (
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            <Popover content={componentsMenu} position={Position.BOTTOM_LEFT}>
              <Button className="pt-icon-code">{kind}</Button>
            </Popover>
            <span className="pt-navbar-divider" />
            <Popover content={propsMenu} position={Position.BOTTOM_LEFT}>
              <Button className="pt-icon-changes">{props.name}</Button>
            </Popover>
          </div>
        </nav>

        <div style={{
          position: 'absolute',
          top: 50,
          left: 0,
          right: 0,
          bottom: 0
        }}>
          <Component {...props} />
        </div>
      </div>
    );
  }
}
