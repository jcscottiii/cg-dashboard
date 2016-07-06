
import React from 'react';

import AppList from '../components/app_list.jsx';
import OrgStore from '../stores/org_store.js';
import ServiceInstanceList from '../components/service_instance_list.jsx';
import SpaceStore from '../stores/space_store.js';
import Users from './users.jsx';
import Tabnav from './tabnav.jsx';
import TabnavItem from './tabnav_item.jsx';

const PAGES = {
  'apps': AppList,
  'services': ServiceInstanceList,
  'users': Users
}

export default class Space extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      space: SpaceStore.get(this.props.initialSpaceGuid) || {},
      currentOrg: OrgStore.get(this.props.initialOrgGuid),
      currentSpaceGuid: this.props.initialSpaceGuid
    };

    this._onChange = this._onChange.bind(this);
    this.spaceUrl = this.spaceUrl.bind(this);
  }

  componentDidMount() {
    SpaceStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SpaceStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      currentOrg: OrgStore.get(OrgStore.currentOrgGuid),
      currentSpaceGuid: this.props.initialSpaceGuid,
      space: SpaceStore.get(this.props.initialSpaceGuid)
    });
  }

  spaceUrl(page) {
    // TODO fix this with a link somehow
    return `/#/org/${this.state.currentOrg.guid}/spaces/${this.state.space.guid}/${page}`;
  }

  get currentContent() {
    return PAGES[this.props.currentPage];
  }

  get subNav() {
    return [
      { name: 'apps',
        element: <TabnavItem controls="apps" href={this.spaceUrl('apps')}
          content="Apps" />
      },
      { name: 'services',
        element: <TabnavItem controls="services" href={this.spaceUrl('services')}
          content="Service Instances" />
      },
      { name: 'users',
        element: <TabnavItem controls="users" href={this.spaceUrl('users')}
          content="User Management" />
      }
    ];
  }

  render() {
    var Content = this.currentContent,
        tabNav;

    if (this.state.space.guid) {
      tabNav = (
        <Tabnav items={ this.subNav } initialItem={ this.props.currentPage } />
      );
    }

    return (
      <div>
        <div>
          <h2>{ this.state.space.name } Space of the { this.state.currentOrg.name } Organization</h2>
        </div>
        { tabNav }
        <div>
          <div role="tabpanel" id={ this.props.currentPage }>
            <Content
              initialOrgGuid={ this.state.currentOrg.guid }
              initialSpaceGuid={ this.state.currentSpaceGuid }
            />
          </div>
        </div>
      </div>
    );
  }
};

Space.propTypes = {
  currentPage: React.PropTypes.string,
  initialOrgGuid: React.PropTypes.string.isRequired,
  initialSpaceGuid: React.PropTypes.string.isRequired
};

Space.defaultProps = {
  currentPage: 'apps'
};