import Alert from '@erxes/ui/src/utils/Alert';
import Button from '@erxes/ui/src/components/Button';
import confirm from '@erxes/ui/src/utils/confirmation/confirm';
import DropdownToggle from '@erxes/ui/src/components/DropdownToggle';
import { FieldStyle } from '@erxes/ui/src/layout/styles';
import Icon from '@erxes/ui/src/components/Icon';
import { MainStyleInfoWrapper as InfoWrapper } from '@erxes/ui/src/styles/eindex';
import ModalTrigger from '@erxes/ui/src/components/ModalTrigger';
import Sidebar from '@erxes/ui/src/layout/components/Sidebar';
import { SidebarCounter, SidebarList } from '@erxes/ui/src/layout/styles';
import { __ } from 'coreui/utils';
import Dropdown from 'react-bootstrap/Dropdown';
import { Action, Name } from '../../contracts/styles';
import React from 'react';

import { Description } from '../../contracts/styles';
import ContractTypeForm from '../containers/ContractTypeForm';
import { IContractTypeDetail } from '../types';
import ContractTypesCustomFields from './ContractTypesCustomFields';
import { isEnabled } from '@erxes/ui/src/utils/core';

type Props = {
  contractType: IContractTypeDetail;
  remove?: () => void;
};

class DetailInfo extends React.Component<Props> {
  renderRow = (label, value) => {
    return (
      <li>
        <FieldStyle>{__(`${label}`)}</FieldStyle>
        <SidebarCounter>{value || '-'}</SidebarCounter>
      </li>
    );
  };

  renderAction() {
    const { remove } = this.props;

    const onDelete = () =>
      confirm()
        .then(() => remove())
        .catch(error => {
          Alert.error(error.message);
        });

    return (
      <Action>
        <Dropdown>
          <Dropdown.Toggle as={DropdownToggle} id="dropdown-info">
            <Button btnStyle="simple" size="medium">
              {__('Action')}
              <Icon icon="angle-down" />
            </Button>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <li>
              <a href="#delete" onClick={onDelete}>
                {__('Delete')}
              </a>
            </li>
          </Dropdown.Menu>
        </Dropdown>
      </Action>
    );
  }

  render() {
    const { contractType } = this.props;
    const { Section } = Sidebar;

    const content = props => (
      <ContractTypeForm {...props} contractType={contractType} />
    );

    return (
      <Sidebar wide={true}>
        <Sidebar.Section>
          <InfoWrapper>
            <Name>{contractType.name}</Name>
            <ModalTrigger
              title={__('Edit basic info')}
              trigger={<Icon icon="edit" />}
              size="lg"
              content={content}
            />
          </InfoWrapper>

          {this.renderAction()}

          <Section>
            <SidebarList className="no-link">
              {this.renderRow('Code', contractType.code)}
              {this.renderRow('Name', contractType.name || '')}
              {this.renderRow('Start Number', contractType.number || '')}
              {this.renderRow(
                'After vacancy count',
                (contractType.vacancy || 0).toLocaleString()
              )}
              {this.renderRow(
                'Loss percent',
                (contractType.lossPercent || 0).toLocaleString()
              )}
              {this.renderRow('Loss calc type', contractType.lossCalcType)}
              {this.renderRow(
                'Is use debt',
                __(contractType.useDebt ? 'Yes' : 'No')
              )}
              {this.renderRow(
                'Is use margin',
                __(contractType.useMargin ? 'Yes' : 'No')
              )}
              {this.renderRow(
                'Is use skip interest',
                __(contractType.useSkipInterest ? 'Yes' : 'No')
              )}

              {this.renderRow('Leasing Type', contractType.leaseType)}
              <li>
                <FieldStyle>{__(`Allow categories`)}</FieldStyle>
              </li>
              <ul>
                {contractType.productCategories.map(cat => {
                  return (
                    <li key={cat._id}>
                      {cat.code} - {cat.name}
                    </li>
                  );
                })}
              </ul>
              <li>
                <FieldStyle>{__(`Description`)}</FieldStyle>
              </li>
              <Description
                dangerouslySetInnerHTML={{
                  __html: contractType.description
                }}
              />
            </SidebarList>
            
          </Section>
        </Sidebar.Section>
        {isEnabled('forms') && <ContractTypesCustomFields contractType={this.props.contractType} isDetail/>}
      </Sidebar>
    );
  }
}

export default DetailInfo;
