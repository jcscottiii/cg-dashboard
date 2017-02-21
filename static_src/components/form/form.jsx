
/**
 * form.jsx
 *
 * A controlled Form component. The form listens to DOM events that bubble up
 * in order to update FormFields in the FormStore and handle form submit
 * actions.
 **/

import React from 'react';
import classNames from 'classnames';

import FormError from './form_error.jsx';
import formActions from '../../actions/form_actions';
import FormStore from '../../stores/form_store';


function stateSetter(props) {
  const model = FormStore.get(props.guid, false);
  const errors = model.validate() || [];

  return {
    errors,
    model
  };
}

export default class Form extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = stateSetter(props);

    this._onChange = this._onChange.bind(this);
    this._onStoreChange = this._onStoreChange.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    FormStore.addChangeListener(this._onStoreChange);
  }

  componentWillUnmount() {
    FormStore.removeChangeListener(this._onStoreChange);
  }

  validate() {
  }

  _onStoreChange() {
    this.setState(stateSetter(this.props));
  }

  _onSubmit(e) {
    if (!this.props.onSubmit) {
      // Without an onSubmit, just default to normal form behavior
      return;
    }

    e.preventDefault();
    const errors = this.state.errors;

    // Create a simple object of name/value pairs
    const formData = this.state.model.fields.reduce((form, formField) =>
      ({ ...form, [formField.name]: formField.value })
    , {});

    this.props.onSubmit(errors, formData);
  }

  _onChange(e) {
    if (!e.target.name) {
      return;
    }

    formActions.changeField(this.props.guid, e.target.name, e.target.value);
  }

  render() {
    let errorMsg;
    const classes = classNames(...this.props.classes);

    if (this.state.errors.length) {
      errorMsg = <FormError message="There were errors submitting the form." />;
    }

    return (
      <form id={ this.props.guid } action={ this.props.action } method={ this.props.method }
        onSubmit={ this._onSubmit } className={ classes } onChange={ this._onChange }
      >
        { errorMsg }
        <fieldset>
          { this.props.children }
        </fieldset>
      </form>
    );
  }
}

Form.propTypes = {
  action: React.PropTypes.string,
  children: React.PropTypes.node,
  classes: React.PropTypes.array,
  guid: React.PropTypes.string,
  method: React.PropTypes.string,
  model: React.PropTypes.object,
  onSubmit: React.PropTypes.func,
  onValidate: React.PropTypes.func,
  onValid: React.PropTypes.func
};

Form.defaultProps = {
  action: '/',
  classes: [],
  method: 'post',
  onValidate: () => {},
  onValid: () => {}
};
