import * as compose from 'lodash.flowright';

import { Alert, withProps } from '@erxes/ui/src';
import {
  ICar,
  RemoveMutationResponse,
  RemoveMutationVariables,
} from '../../types';
import { mutations, queries } from '../../graphql';

import BasicInfoSection from '../../components/common/BasicInfoSection';
import { IRouterProps } from '@erxes/ui/src/types';
// import { withRouter } from 'react-router-dom';
import { IUser } from '@erxes/ui/src/auth/types';
import React from 'react';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';

type Props = {
  car: ICar;
};

type FinalProps = { currentUser: IUser } & Props &
  IRouterProps &
  RemoveMutationResponse;

const BasicInfoContainer = (props: FinalProps) => {
  const { car, carsRemove, history } = props;

  const { _id } = car;

  const remove = () => {
    carsRemove({ variables: { carIds: [_id] } })
      .then(() => {
        Alert.success('You successfully deleted a car');
        history.push('/cars');
      })
      .catch((e) => {
        Alert.error(e.message);
      });
  };

  const updatedProps = {
    ...props,
    remove,
  };

  return <BasicInfoSection {...updatedProps} />;
};

const generateOptions = () => ({
  refetchQueries: ['carsMain', 'carCounts', 'carCategoriesCount'],
});

export default withProps<Props>(
  compose(
    graphql<{}, RemoveMutationResponse, RemoveMutationVariables>(
      gql(mutations.carsRemove),
      {
        name: 'carsRemove',
        options: generateOptions,
      },
    ),
  )(BasicInfoContainer),
);
