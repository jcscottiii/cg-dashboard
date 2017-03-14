
import React from 'react';

import createStyler from '../../util/create_styler';
import style from 'cloudgov-style/css/cloudgov-style.css';

export class Footer extends React.Component {

  constructor(props) {
    super(props);
    this.styler = createStyler(style);
  }

  render() {
    return (
      <footer className={ this.styler('grid', 'footer', 'footer-no_sidebar') }>
        <section className={ this.styler('grid-width-6') }>
          <ul className={ this.styler('footer-links') }>
            <li>one</li>
            <li>two</li>
            <li>three</li>
          </ul>
        </section>
        <section className={ this.styler('grid-width-6') }>
          <ul className={ this.styler('footer-info') }>
            <li>alpha</li>
            <li>beta</li>
            <li>delta</li>
          </ul>
        </section>
      </footer>
    );
  }
}

export default Footer;
