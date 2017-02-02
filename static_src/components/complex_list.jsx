
import React from 'react';

import ComplexListItem from './complex_list_item.jsx';
import createStyler from '../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

const propTypes = {
  children: React.PropTypes.array,
  title: React.PropTypes.string,
  titleElement: React.PropTypes.element,
  emptyMessage: React.PropTypes.element
};
const defaultProps = {
  children: [],
  title: null,
  titleElement: null,
  emptyMessage: null
};

export default class ComplexList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.styler = createStyler(style);
  }

  hasAnyTitle() {
    return !!(this.props.title || this.props.titleElement);
  }

  render() {
    const props = this.props;
    const emptyMessage = this.props.emptyMessage && (
      <div className={ this.styler('complex_list-empty') }>
        { this.props.emptyMessage }
      </div>
    );
    let header;

    if (this.hasAnyTitle()) {
      let title;
      if (props.titleElement) {
        title = props.titleElement;
      } else {
        title = this.props.title;
      }
      header  = (
        <header className={ this.styler('complex_list-header') }>
          <h4 className={ this.styler('complex_list-title') }>
            { title }
          </h4>
        </header>
      );
    }

    return (
      <div className={ this.styler('complex_list') }>
        { header }
        { emptyMessage }
        { this.props.children.length > 0 && this.props.children.map((child, i) => {
          if (child.type.name === 'ComplexList') {
            return child;
          }
          return (
            <ComplexListItem key={ i }>
              { child }
            </ComplexListItem>
          )
        })}
      </div>
    );
  }
}

ComplexList.propTypes = propTypes;
ComplexList.defaultProps = defaultProps;
