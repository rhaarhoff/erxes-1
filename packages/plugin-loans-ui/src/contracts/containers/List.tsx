import * as compose from 'lodash.flowright';

import {
  ListQueryVariables,
  MainQueryResponse,
  RemoveMutationResponse,
  RemoveMutationVariables,
} from '../types';
import { mutations, queries } from '../graphql';
import { router, withProps } from '@erxes/ui/src/utils/core';

import Alert from '@erxes/ui/src/utils/Alert';
import Bulk from '@erxes/ui/src/components/Bulk';
import ContractList from '../components/list/ContractsList';
import { FILTER_PARAMS_CONTRACT } from '../../constants';
// import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import queryString from 'query-string';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  contractsMainQuery: MainQueryResponse;
  contractsAlertQuery: any;
} & Props &
  IRouterProps &
  RemoveMutationResponse;

type State = {
  loading: boolean;
};

type ContractAlert = { name: string; count: number; filter: any };

const generateQueryParams = ({ location }) => {
  return queryString.parse(location.search);
};

class ContractListContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  onSearch = (searchValue: string) => {
    if (!searchValue) {
      return router.removeParams(this.props.history, 'searchValue');
    }

    router.setParams(this.props.history, { searchValue });
  };

  onSelect = (values: string[] | string, key: string) => {
    const params = generateQueryParams(this.props.history);

    if (params[key] === values) {
      return router.removeParams(this.props.history, key);
    }

    return router.setParams(this.props.history, { [key]: values });
  };

  isFiltered = (): boolean => {
    const params = generateQueryParams(this.props.history);

    for (const param in params) {
      if (FILTER_PARAMS_CONTRACT.includes(param)) {
        return true;
      }
    }

    return false;
  };

  clearFilter = () => {
    const params = generateQueryParams(this.props.history);
    router.removeParams(this.props.history, ...Object.keys(params));
  };

  render() {
    const {
      contractsMainQuery,
      contractsRemove,
      contractsAlertQuery,
      // contractsMerge,
    } = this.props;

    const removeContracts = ({ contractIds }, emptyBulk) => {
      contractsRemove({
        variables: { contractIds },
      })
        .then(() => {
          emptyBulk();
          Alert.success('You successfully deleted a contract');
        })
        .catch((e) => {
          Alert.error(e.message);
        });
    };

    const searchValue = this.props.queryParams.searchValue || '';
    const { list = [], totalCount = 0 } =
      contractsMainQuery.contractsMain || {};

    const alerts: ContractAlert[] = contractsAlertQuery?.contractsAlert || [];

    const updatedProps = {
      ...this.props,
      totalCount,
      searchValue,
      contracts: list,
      alerts,
      loading: contractsMainQuery.loading || this.state.loading,
      queryParams: this.props.queryParams,
      removeContracts,
      onSelect: this.onSelect,
      onSearch: this.onSearch,
      isFiltered: this.isFiltered(),
      clearFilter: this.clearFilter,
    };

    const contractsList = (props) => {
      return <ContractList {...updatedProps} {...props} />;
    };

    const refetch = () => {
      this.props.contractsMainQuery.refetch();
    };

    return <Bulk content={contractsList} refetch={refetch} />;
  }
}

const generateOptions = () => ({
  refetchQueries: ['contractsMain'],
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, MainQueryResponse, ListQueryVariables>(
      gql(queries.contractsMain),
      {
        name: 'contractsMainQuery',
        options: ({ queryParams }) => {
          return {
            variables: {
              ...router.generatePaginationParams(queryParams || {}),
              ids: queryParams.ids,
              searchValue: queryParams.searchValue,
              isExpired: queryParams.isExpired,
              closeDateType: queryParams.closeDateType,
              startStartDate: queryParams.startStartDate,
              endStartDate: queryParams.endStartDate,
              startCloseDate: queryParams.startCloseDate,
              contractTypeId: queryParams.contractTypeId,
              endCloseDate: queryParams.endCloseDate,
              customerId: queryParams.customerId,
              branchId: queryParams.branchId,

              leaseAmount: !!queryParams.leaseAmount
                ? parseFloat(queryParams.leaseAmount)
                : undefined,
              interestRate: !!queryParams.interestRate
                ? parseFloat(queryParams.interestRate)
                : undefined,
              tenor: !!queryParams.tenor
                ? parseInt(queryParams.tenor)
                : undefined,
              repayment: queryParams.repayment,

              repaymentDate: queryParams.repaymentDate,
              sortField: queryParams.sortField,
              sortDirection: queryParams.sortDirection
                ? parseInt(queryParams.sortDirection, 10)
                : undefined,
            },
            fetchPolicy: 'network-only',
          };
        },
      },
    ),
    graphql<{ queryParams: any }, any, any>(gql(queries.contractsAlert), {
      name: 'contractsAlertQuery',
      options: () => {
        return {
          variables: {
            date: new Date(),
          },
          fetchPolicy: 'network-only',
        };
      },
    }),
    // mutations
    graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.contractsRemove),
      {
        name: 'contractsRemove',
        options: generateOptions,
      },
    ),
  )(ContractListContainer),
);
