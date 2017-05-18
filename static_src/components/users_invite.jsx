
/**
 * Renders a form that allows org users to invite new users
 * to cloud.gov
 */

import React from 'react';

import Action from './action.jsx';
import FormStore from '../stores/form_store';
import { Form, FormText } from './form';
import PanelDocumentation from './panel_documentation.jsx';
import userActions from '../actions/user_actions';
import { validateString } from '../util/validators';

const USERS_INVITE_FORM_GUID = 'users-invite-form';
const propTypes = {};
const defaultProps = {};

export default class UsersInvite extends React.Component {
  constructor(props) {
    super(props);
    FormStore.create(USERS_INVITE_FORM_GUID);

    this.validateString = validateString().bind(this);
    this._onValidForm = this._onValidForm.bind(this);
  }

  _onValidForm(errs, values) {
    userActions.fetchUserInvite(values.email.value);
  }

  render() {
    return (
      <div className="test-users-invite">
        <h3>Invite new user</h3>
        <PanelDocumentation description>
          <p>If a user doesn't exist in the list above, you can invite them
          to cloud.gov and your organization by filling out their email address
          below.</p>
        </PanelDocumentation>
        <Form
          guid={ USERS_INVITE_FORM_GUID }
          classes={ ['users_invite_form'] }
          ref="form"
          onSubmit={ this._onValidForm }
        >
          <FormText
            formGuid={ USERS_INVITE_FORM_GUID }
            classes={ ['test-users_invite_name'] }
            label="User's email"
            name="email"
            validator={ this.validateString }
          />
          <Action label="submit" type="submit">Invite new user</Action>
        </Form>
      </div>
    );
  }

}

UsersInvite.propTypes = propTypes;

UsersInvite.defaultProps = defaultProps;
