
/**
 * Renders a list of users.
 */

import React from 'react';

import Action from './action.jsx';
import ComplexList from './complex_list.jsx';
import ComplexListItem from './complex_list_item.jsx';
import ElasticLine from './elastic_line.jsx';
import ElasticLineItem from './elastic_line_item.jsx';
import EntityEmpty from './entity_empty.jsx';
import Loading from './loading.jsx';
import PanelDocumentation from './panel_documentation.jsx';
import UserRoleListControl from './user_role_list_control.jsx';
import createStyler from '../util/create_styler';
import { config } from 'skin';
import formatDateTime from '../util/format_date';
import style from 'cloudgov-style/css/cloudgov-style.css';

const propTypes = {
  users: React.PropTypes.array,
  userType: React.PropTypes.string,
  entityGuid: React.PropTypes.string,
  currentUserAccess: React.PropTypes.bool,
  empty: React.PropTypes.bool,
  loading: React.PropTypes.bool,
  saving: React.PropTypes.bool,
  savingText: React.PropTypes.string,
  // Set to a function when there should be a remove button.
  onRemove: React.PropTypes.func,
  onRemovePermissions: React.PropTypes.func,
  onAddPermissions: React.PropTypes.func
};

const defaultProps = {
  users: [],
  userType: 'space_users',
  currentUserAccess: false,
  saving: false,
  savingText: '',
  empty: false,
  loading: false
};

export default class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.styler = createStyler(style);
    this._handleDelete = this._handleDelete.bind(this);
  }

  _handleDelete(userGuid, ev) {
    this.props.onRemove(userGuid, ev);
  }

  get columns() {
    const columns = [
      { label: 'User Name', key: 'username' },
      { label: 'Roles', key: 'permissions' },
      { label: 'Date Created', key: 'created_at' }
    ];

    if (this.props.onRemove) {
      columns.push({ label: 'Actions', key: 'actions' });
    }

    return columns;
  }

  get userTypePretty() {
    return (this.props.userType === 'org_users') ? 'Organization' : 'Space';
  }

  get documentation() {
    return (
      <PanelDocumentation description>
        <p>
          { this.userTypePretty } Managers can change these roles. For details
            about these roles, see <a href="https://docs.cloudfoundry.org/concepts/roles.html#roles">Cloud Foundry roles and permissions</a>.
          { config.docs.invite_user &&
            <span> To invite a user and give them roles, see <a href={ config.docs.invite_user }>Managing Teammates</a>.
            </span>
          }
        </p>
      </PanelDocumentation>
    );
  }

  get emptyState() {
    const callout = `There are no users in this ${this.userTypePretty.toLowerCase()}`;
    const content = config.docs.invite_user &&
      <a href={ config.docs.invite_user }>Read more about adding users to this space.</a>

    return (
      <EntityEmpty callout={ callout }>
        { content }
      </EntityEmpty>
    );
  }

  get onlyOneState() {
    let content;
    const callout = `You are the only user in this ${this.userTypePretty.toLowerCase()}`;

    if (this.props.userType === 'org_users') {
      const readMore = config.docs.invite_user &&
        <a href={ config.docs.invite_user }>Read more about inviting new users.</a>

      content = (
        <p>
          You can invite teammates to get cloud.gov accounts. You can invite
          anyone you need to work with, including federal employees and
          federal contractors. { readMore }
        </p>
      );
    } else {
      const content = config.docs.invite_user &&
        <a href={ config.docs.invite_user }>Read more about adding users to this space.</a>
    }

    return (
      <EntityEmpty callout={ callout }>
        { content }
      </EntityEmpty>
    );
  }

  render() {
    let content = <div><Loading text="Loading users" /></div>;

    if (this.props.empty) {
      content = this.emptyState;
    } else if (this.props.users.length === 1) {
      content = this.onlyOneState;
    } else if (!this.props.loading && this.props.users.length) {
      content = (
      <div className="test-user_list">
        <Loading active={ this.props.saving } loadingDelayMS={0} text="Saving" style="globalSaving" />
        { this.documentation }
        <ComplexList>
          { this.props.users.map((user) => {
            let actions;
            if (this.props.onRemove) {
              let button = <span></span>;
              if (this.props.currentUserAccess) {
                button = (
                  <Action
                    style="base"
                    clickHandler={ this._handleDelete.bind(this, user.guid) }
                    label="delete">
                    <span>Remove User From Org</span>
                  </Action>
                );
              }
              actions = (
                <ElasticLineItem align="end">
                  { button }
                </ElasticLineItem>
              );
            }
            return (
              <ElasticLine key={ user.guid }>
                <ElasticLineItem>{ user.username }</ElasticLineItem>
                <ElasticLineItem key={ `${user.guid}-role` } align="end">
                  <UserRoleListControl
                    userType={ this.props.userType }
                    currentUserAccess={ this.props.currentUserAccess }
                    onAddPermissions={ this.props.onAddPermissions }
                    onRemovePermissions={ this.props.onRemovePermissions }
                    entityGuid={ this.props.entityGuid }
                    user={ user }
                  />
                </ElasticLineItem>
                { actions }
              </ElasticLine>
              );
          })}
        </ComplexList>
      </div>
      );
    }

    return (
    <div className={ this.styler('tableWrapper') }>
      { content }
    </div>
    );
  }
}

UserList.propTypes = propTypes;
UserList.defaultProps = defaultProps;
