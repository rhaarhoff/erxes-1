import {
  FieldStyle,
  SidebarCounter,
  SidebarList,
} from '@erxes/ui/src/layout/styles';
import { __, router } from '@erxes/ui/src/utils';

import Box from '@erxes/ui/src/components/Box';
import { ClientPortalConfig } from '../../types';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import { IRouterProps } from '@erxes/ui/src/types';
import Icon from '@erxes/ui/src/components/Icon';
import React from 'react';
// import { withRouter } from 'react-router-dom';

interface IProps extends IRouterProps {
  counts: { [key: string]: number };
  loading: boolean;
  emptyText?: string;
  clientPortalGetConfigs: ClientPortalConfig[];
  kind?: string;
}

function ClientPortalUser({
  history,
  counts,
  loading,
  emptyText,
  clientPortalGetConfigs,
  kind = 'client',
}: IProps) {
  React.useEffect(() => {
    if (
      clientPortalGetConfigs.length > 0 &&
      !router.getParam(history, 'cpId')
    ) {
      router.setParams(history, { cpId: clientPortalGetConfigs[0]._id });
    }
  }, [clientPortalGetConfigs]);

  const onRemove = () => {
    router.removeParams(history, 'cpId');
  };

  const extraButtons = (
    <>
      {router.getParam(history, 'cpId') && (
        <a href="#" tabIndex={0} onClick={onRemove}>
          <Icon icon="times-circle" />
        </a>
      )}
    </>
  );

  const data = (
    <SidebarList>
      {clientPortalGetConfigs.map((cp) => {
        const onClick = () => {
          router.setParams(history, { cpId: cp._id });
          router.removeParams(history, 'page');
        };

        return (
          <li key={cp._id}>
            <a
              href="#filter"
              tabIndex={0}
              className={
                router.getParam(history, 'clientPortalId') === cp._id
                  ? 'active'
                  : ''
              }
              onClick={onClick}
            >
              <FieldStyle>{cp.name}</FieldStyle>
              <SidebarCounter>{counts[cp._id || '']}</SidebarCounter>
            </a>
          </li>
        );
      })}
    </SidebarList>
  );

  return (
    <Box
      title={__(`Filter by ${kind} portal`)}
      collapsible={clientPortalGetConfigs.length > 5}
      extraButtons={extraButtons}
      name="showFilterByClientPortalId"
    >
      <DataWithLoader
        data={data}
        loading={loading}
        count={clientPortalGetConfigs.length}
        emptyText={emptyText || 'Empty'}
        emptyIcon="leaf"
        size="small"
        objective={true}
      />
    </Box>
  );
}

export default ClientPortalUser;
