
import style from 'cloudgov-style/css/cloudgov-style.css';
import React from 'react';

import Action from './action.jsx';
import { Form, FormNumber } from './form';
import Loading from './loading.jsx';
import PanelActions from './panel_actions.jsx';
import PanelGroup from './panel_group.jsx';
import PanelBlock from './panel_block.jsx';
import ResourceUsage from './resource_usage.jsx';
import FormStore from '../stores/form_store';

import { appHealth } from '../util/health';
import { entityHealth } from '../constants';
import appActions from '../actions/app_actions.js';
import createStyler from '../util/create_styler';
import formatBytes from '../util/format_bytes';
import { validateInteger } from '../util/validators';

// Calculates the running average based on a fixed n number of items To average
// across instances you can do something like `average.bind(null, // numberOfInstances)`
function average(n, avg, value) {
  return avg + (value / n);
}

// Calculate the cumulative sum
function sum(s, value) {
  return s + value;
}

function getStat(statName, props, accumulator) {
  const _accumulator = accumulator || sum;
  if (statName.indexOf('quota') > -1) {
    return (props.app.app_instances &&
            props.app.app_instances.length &&
            props.app.app_instances[0].stats &&
            props.app.app_instances[0].stats[statName] ||
            0);
  }

  // For usage, sometimes we want an average across instances, sometimes we
  // want the total. Use the accumulator to delegate this to the caller
  return (props.app.app_instances || [])
    .map(instance => instance.stats && instance.stats.usage[statName] || 0)
    .reduce((cumulative, value) => _accumulator(cumulative, value || 0), 0);
}

function megabytes(value) {
  return Math.floor(value / 1024 / 1024);
}

function stateSetter(props) {
  return {
    editing: !!props.editing,
    form: props.form,
    partialApp: {
      // Properties are mapped directly to API https://apidocs.cloudfoundry.org/246/apps/updating_an_app.html
      disk_quota: props.app.disk_quota,
      instances: props.app.instances,
      memory: props.app.memory
    }
  };
}

export default class UsageAndLimits extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;

    this.formGuid = `app-${props.app.guid}-usage-and-limits`;
    // Setup a change listener so the maximum adjusts properly with instances
    const memory = this.props.app.memory;
    const disk_quota = this.props.app.disk_quota; // eslint-disable-line camelcase
    const form = FormStore.create(this.formGuid, {
      memory: {
        value: memory,
        validator: validateInteger({ min: 1, max: 2048 })
      },
      disk_quota: {
        value: disk_quota,
        validator: validateInteger({ min: 1, max: 2 * 1024 })
      },
      instances: {
        value: 1,
        validator: validateInteger({ min: 1 })
      }
    });

    this.styler = createStyler(style);
    this.state = stateSetter({ ...props, form });

    this.getStat = this.getStat.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._onToggleEdit = this._onToggleEdit.bind(this);
  }

  getStat(statName, accumulator) {
    return getStat(statName, this.props, accumulator);
  }

  _onToggleEdit() {
    this.setState(stateSetter(Object.assign({}, this.props, { editing: !this.state.editing })));
  }

  get disk() {
    const disk = this.props.app.disk_quota;

    // For instance usage, we average the instances together
    return (
    <div className={ this.styler('stat-group') }>
      <ResourceUsage title="Instance disk used"
        amountUsed={ this.getStat('disk', average.bind(null, this.props.app.running_instances)) }
        amountTotal={ this.getStat('disk_quota') }
      />
      <ResourceUsage title="Instance disk allocation"
        amountTotal={ disk * 1024 * 1024 }
        editable={ this.state.editing }
        formGuid = { this.formGuid }
        name="disk_quota"
      />
    </div>
    );
  }

  get memory() {
    const memory = this.props.app.memory;

    // For instance usage, we average the instances together
    return (
    <div className={ this.styler('stat-group') }>
      <ResourceUsage title="Instance memory used"
        amountUsed={ this.getStat('mem', average.bind(null, this.props.app.running_instances)) }
        amountTotal={ this.getStat('mem_quota') }
      />
      <ResourceUsage title="Instance memory allocation"
        amountTotal={ memory * 1024 * 1024 }
        editable={ this.state.editing }
        formGuid={ this.formGuid }
        name="memory"
      />
    </div>
    );
  }

  get totalDisk() {
    // There is no org/space level disk quota, so only show single stat
    return (
        <ResourceUsage title="Total disk used"
          amountTotal={ this.getStat('disk', sum) }
        />
    );
  }

  get totalMemory() {
    const amountTotal = this.props.quota.memory_limit * 1024 * 1024;
    const amountUsed = this.getStat('mem', sum);
    const title = amountUsed ? 'Total memory used' : 'Total memory available';
    const secondaryInfo = `${formatBytes(amountTotal)} quota`;

    return (
      <ResourceUsage title={ title }
        amountTotal={ amountUsed }
        secondaryInfo={ secondaryInfo }
      />
    );
  }

  get scale() {
    const instanceCount = this.props.app.instances;

    let instances = (
      <span className={ this.styler('stat-primary')}>
	{ instanceCount }
      </span>
    );

    if (this.state.editing) {
      instances = (
        <FormNumber
          className={ this.styler('stat-input', 'stat-input-text', 'stat-input-text-scale') }
          id="scale"
          inline
          name="instances"
          formGuid={ this.formGuid }
          value={ instanceCount }
        />
      );
    }

    return (
      <div className={ this.styler('stat', 'stat-single_box') }>
        <h2 className={ this.styler('stat-header')}>Instances</h2>
	{ instances }
        <br />
        <span className={ this.styler('subtext') }>
          Instance applies to memory and disk
        </span>
      </div>
    );
  }

  _onSubmit(errors, form) {
    if (errors.length) {
      console.warn({ errors });
      return;
    }

    // Parse the form
    const partialApp = {
      disk_quota: parseInt(form.disk_quota, 10),
      instances: parseInt(form.instances, 10),
      memory: parseInt(form.memory, 10)
    };

    appActions.updateApp(this.props.app.guid, partialApp);
    this.setState({ editing: false });
  }

  render() {
    let content = <div></div>;
    let controls;

    controls = (
      <Action
        disabled={ (appHealth(this.props.app) !== entityHealth.ok) }
        style="primary"
        type="outline"
        label="Modify allocation and scale"
        clickHandler={ this._onToggleEdit }
      >
          <span>Modify allocation and scale</span>
      </Action>
    );

    if (this.props.app.updating) {
      controls = <Loading text="Updating app" style="inline" />;
    }

    if (this.state.editing) {
      controls = (
        <div>
          <Action style="finish" type="submit" label="OK">
            <span>OK</span>
          </Action>
          <Action type="outline" label="Cancel" clickHandler={ this._onToggleEdit }>
            <span>Cancel</span>
          </Action>
        </div>
      );
    }

    if (this.props.app) {
      content = (
      <div>
        <PanelGroup>
          <PanelGroup columns={ 6 }>
            { this.memory }
            { this.disk }
          </PanelGroup>
          <PanelGroup columns={ 3 }>
            <PanelBlock>
              { this.scale }
            </PanelBlock>
          </PanelGroup>
          <PanelGroup columns={ 3 }>
            { this.totalMemory }
            { this.totalDisk }
          </PanelGroup>
        </PanelGroup>
        <PanelActions align="right">
          { controls }
        </PanelActions>
      </div>
      );
    }

    if (this.props.app && this.state.editing) {
      // Wrap content in a form element
      content = <Form guid={ this.formGuid } onSubmit={ this._onSubmit }>{ content }</Form>;
    }

    return content;
  }
}

UsageAndLimits.propTypes = {
  app: React.PropTypes.object,
  editing: React.PropTypes.bool,
  quota: React.PropTypes.object
};

UsageAndLimits.defaultProps = {
  app: {},
  editing: false,
  quota: {}
};
