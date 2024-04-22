import {
  MainStyleTitle as Title,
  Wrapper,
  HeaderDescription
} from '@erxes/ui/src';
import React from 'react';

import { ContentBox } from '../styles';
import { IConfigsMap } from '../types';
import Sidebar from './Sidebar';
import { __ } from 'coreui/utils';
import MainConfig from './MainConfig';

function Header() {
  return (
    <HeaderDescription
      icon="/images/actions/25.svg"
      title={__('Loan not calc loss settings')}
      description=""
    />
  );
}

type Props = {
  save: (configsMap: IConfigsMap) => void;
  configsMap: IConfigsMap;
};

type State = {
  configsMap: IConfigsMap;
};

class MainSettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      configsMap: props.configsMap
    };
  }

  renderConfigs(configs) {
    const { configsMap } = this.state;
    return (
      <div>
        <MainConfig
          key={Math.random()}
          configsMap={configsMap}
          currentConfigKey="loansConfig"
          config={{ title: 'main config', ...configs }}
          save={this.props.save}
        />
      </div>
    );
  }

  renderContent() {
    const { configsMap } = this.state;

    const configs = configsMap?.loansConfig || {};

    return (
      <ContentBox id={'MainSettingsMenu'}>
        {this.renderConfigs(configs)}
      </ContentBox>
    );
  }

  render() {
    const breadcrumb = [
      { title: __('Settings'), link: '/settings' },
      { title: __('Loan config') }
    ];

    return (
      <Wrapper
        header={
          <Wrapper.Header title={__('Main configs')} breadcrumb={breadcrumb} />
        }
        mainHead={<Header />}
        actionBar={
          <Wrapper.ActionBar left={<Title>{__('Main configs')}</Title>} />
        }
        leftSidebar={<Sidebar />}
        content={this.renderContent()}
      />
    );
  }
}

export default MainSettings;
