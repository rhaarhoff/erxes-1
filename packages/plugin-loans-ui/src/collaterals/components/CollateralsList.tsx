import { can, router } from '@erxes/ui/src/utils/core';

import { BarItems } from '@erxes/ui/src/layout/styles';
import CollateralRow from './CollateralRow';
import { CollateralsTableWrapper } from '../styles';
import DataWithLoader from '@erxes/ui/src/components/DataWithLoader';
import FormControl from '@erxes/ui/src/components/form/Control';
import { ICollateral } from '../types';
import { IRouterProps } from '@erxes/ui/src/types';
import { IUser } from '@erxes/ui/src/auth/types';
import Pagination from '@erxes/ui/src/components/pagination/Pagination';
import React from 'react';
import SelectProducts from '@erxes/ui-products/src/containers/SelectProducts';
import Sidebar from './Sidebar';
import SortHandler from '@erxes/ui/src/components/SortHandler';
import Table from '@erxes/ui/src/components/table';
import Wrapper from '@erxes/ui/src/layout/components/Wrapper';
import { __ } from 'coreui/utils';
// import { withRouter } from 'react-router-dom';
import { menuContracts } from '../../constants';
import withConsumer from '../../withConsumer';

interface IProps extends IRouterProps {
  collaterals: ICollateral[];
  loading: boolean;
  searchValue: string;
  productIds: string[];
  totalCount: number;
  history: any;
  queryParams: any;
  currentUser: IUser;
}

type State = {
  searchValue?: string;
  productIds?: string[];
};

class CollateralsList extends React.Component<IProps, State> {
  private timer?: NodeJS.Timer = undefined;

  constructor(props) {
    super(props);

    this.state = {
      searchValue: this.props.searchValue,
      productIds: this.props.productIds,
    };
  }

  onSelectProducts = (productIds) => {
    const { history } = this.props;

    this.setState({ productIds });
    router.removeParams(history, 'page');
    router.setParams(history, { productIds });
  };

  search = (e) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    const { history } = this.props;
    const searchValue = e.target.value;

    this.setState({ searchValue });
    this.timer = setTimeout(() => {
      router.removeParams(history, 'page');
      router.setParams(history, { searchValue });
    }, 500);
  };

  moveCursorAtTheEnd = (e) => {
    const tmpValue = e.target.value;
    e.target.value = '';
    e.target.value = tmpValue;
  };

  render() {
    const {
      collaterals,
      history,
      loading,
      totalCount,
      queryParams,
      currentUser,
    } = this.props;

    const mainContent = (
      <CollateralsTableWrapper>
        <Table whiteSpace="nowrap" bordered={true} hover={true} striped>
          <thead>
            <tr>
              <th>
                <SortHandler sortField={'code'} label={__('Code')} />
              </th>
              <th>
                <SortHandler sortField={'name'} label={__('Name')} />
              </th>
              <th>
                <SortHandler
                  sortField={'certificate'}
                  label={__('Certificate №')}
                />
              </th>
              <th>
                <SortHandler sortField={'vinNumber'} label={__('VINNumber')} />
              </th>
              <th>
                <SortHandler sortField={'cost'} label={__('Cost')} />
              </th>
              <th>
                <SortHandler
                  sortField={'marginAmount'}
                  label={__('margin Amount')}
                />
              </th>
              <th>
                <SortHandler
                  sortField={'leaseAmount'}
                  label={__('Lease Amount')}
                />
              </th>
            </tr>
          </thead>
          <tbody id="collaterals">
            {collaterals.map((collateral) => (
              <CollateralRow
                collateral={collateral}
                key={`${
                  collateral.collateralData
                    ? collateral.collateralData._id
                    : collateral._id
                }`}
                history={history}
              />
            ))}
          </tbody>
        </Table>
      </CollateralsTableWrapper>
    );

    const actionBarRight = (
      <BarItems>
        <FormControl
          type="text"
          placeholder={__('Type to search')}
          onChange={this.search}
          value={this.state.searchValue}
          autoFocus={true}
          onFocus={this.moveCursorAtTheEnd}
        />
        <SelectProducts
          label="Filter by products"
          name="productIds"
          queryParams={queryParams}
          onSelect={this.onSelectProducts}
        />
      </BarItems>
    );

    const actionBar = <Wrapper.ActionBar right={actionBarRight} />;

    return (
      <Wrapper
        header={
          <Wrapper.Header
            title={__(`Collaterals`) + ` (${totalCount})`}
            submenu={menuContracts.filter((row) =>
              can(row.permission, currentUser),
            )}
          />
        }
        actionBar={actionBar}
        hasBorder
        footer={<Pagination count={totalCount} />}
        leftSidebar={
          <Sidebar
            loadingMainQuery={loading}
            queryParams={queryParams}
            history={history}
          />
        }
        content={
          <DataWithLoader
            data={mainContent}
            loading={loading}
            count={collaterals.length}
            emptyText="Add in your first collateral!"
            emptyImage="/images/actions/1.svg"
          />
        }
      />
    );
  }
}

export default withConsumer(CollateralsList);
