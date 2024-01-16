import * as compose from 'lodash.flowright';

import { ListQueryVariables, MainQueryResponse } from '../types';
import { router, withProps } from '@erxes/ui/src';

import CollateralsList from '../components/CollateralsList';
// import { withRouter } from 'react-router-dom';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries } from '../graphql';

type Props = {
  queryParams: any;
  history: any;
};

type FinalProps = {
  collateralsMainQuery: MainQueryResponse;
} & Props &
  IRouterProps;

type State = {
  loading: boolean;
};

class CollateralListContainer extends React.Component<FinalProps, State> {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
    };
  }

  render() {
    const { collateralsMainQuery } = this.props;

    const searchValue = this.props.queryParams.searchValue || '';
    const productIds = this.props.queryParams.productIds || '';
    const { list = [], totalCount = 0 } =
      collateralsMainQuery.collateralsMain || {};

    const updatedProps = {
      ...this.props,
      totalCount,
      searchValue,
      productIds,
      collaterals: list,
      loading: collateralsMainQuery.loading || this.state.loading,
    };

    return <CollateralsList {...updatedProps} />;
  }
}

const generateParams = ({ queryParams }) => ({
  variables: {
    ...router.generatePaginationParams(queryParams || {}),
    ids: queryParams.ids,
    categoryId: queryParams.categoryId,
    productIds: queryParams.productIds,
    searchValue: queryParams.searchValue,
    sortField: queryParams.sortField,
    sortDirection: queryParams.sortDirection
      ? parseInt(queryParams.sortDirection, 10)
      : undefined,
  },
});

export default withProps<Props>(
  compose(
    graphql<{ queryParams: any }, MainQueryResponse, ListQueryVariables>(
      gql(queries.collateralsMain),
      {
        name: 'collateralsMainQuery',
        options: ({ queryParams }) => {
          return generateParams({ queryParams });
        },
      },
    ),
  )(CollateralListContainer),
);
