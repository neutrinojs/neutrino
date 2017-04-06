import React from 'react';
import { Menu, MenuItem, Popover, Position } from "@blueprintjs/core";
import Frame from 'react-frame-component';
import '@blueprintjs/core/dist/blueprint.css';

class Previewer extends React.Component {
  componentWillMount() {
    this.switchPreview(0);
  }

  getDisplayName(Component) {
    return Component.displayName ||
      Component.name ||
      (typeof Component === 'string' ? Component : 'Component')
  }

  switchPreview(index) {
    const preview = this.props.children[index];

    this.setState({
      preview,
      previewName: this.getDisplayName(preview.props.component),
      previewState: preview.props.children[0]
    });
  }

  switchPreviewState(index) {
    this.setState({
      previewState: this.state.preview.props.children[index]
    });
  }

  renderComponentMenu() {
    const current = this.state.previewName;

    return (
      <Menu>
        {this.props.children.map((preview, index) => {
          const name = this.getDisplayName(preview.props.component);

          return (
            <MenuItem
              key={name}
              disabled={name === current}
              iconName="pt-icon-code"
              onClick={e => this.switchPreview(index)}
              text={name} />
          );
        })}
      </Menu>
    );
  }

  renderStateMenu() {
    const current = this.state.previewState.props.name;

    return (
      <Menu>
        {this.state.preview.props.children.map((previewState, index) => {
          const { name } = previewState.props;

          return (
            <MenuItem
              key={name}
              disabled={name === current}
              iconName="pt-icon-exchange"
              onClick={e => this.switchPreviewState(index)}
              text={name} />
          );
        })}
      </Menu>
    );
  }

  render() {
    const { preview, previewName, previewState } = this.state;
    const Component = preview.props.component;

    return (
      <div>
        <nav className="pt-navbar">
          <div className="pt-navbar-group pt-align-left">
            {this.props.children.length > 1 ? (
              <Popover content={this.renderComponentMenu()} position={Position.BOTTOM_LEFT}>
                <button className="pt-button pt-minimal pt-icon-code">
                  <code style={{ fontSize: 'initial' }}>{previewName}</code>
                </button>
              </Popover>
            ) : (
              <span>
                <span className="pt-icon-standard pt-icon-code" />&nbsp;
                <code style={{ fontSize: 'initial' }}>{previewName}</code>
              </span>
            )}
          </div>
          <div className="pt-navbar-group pt-align-left">
            <span className="pt-navbar-divider" />
            {preview.props.children.length > 1 ? (
              <Popover content={this.renderStateMenu()} position={Position.BOTTOM_LEFT}>
                <button className="pt-button pt-minimal pt-icon-exchange">
                  {previewState.props.name}
                </button>
              </Popover>
            ) : (
              <span>
                <span className="pt-icon-standard pt-icon-exchange" />&nbsp;
                {previewState.props.name}
              </span>
            )}
          </div>
        </nav>
        <main style={{ position: 'relative', height: 0, overflow: 'hidden', paddingBottom: '56.25%' }}>
          <Frame style={{ border: 0, position: 'absolute', top:0, left: 0, width: '100%', height: '100%' }}>
            <Component {...previewState.props} />
          </Frame>
        </main>
      </div>
    );
  }
}

export default Previewer;
