import * as compose from 'lodash.flowright';

import { router as routerUtils, withProps } from '@erxes/ui/src/utils';

import { BoardGetLastQueryResponse } from '../types';
// import { withRouter } from 'react-router-dom';
import Home from '../components/Home';
import { IBoard } from '../../calendar/types';
import { IRouterProps } from '@erxes/ui/src/types';
import React from 'react';
import Spinner from '@erxes/ui/src/components/Spinner';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import { queries } from '../graphql';

type MainProps = {
  history: any;
  queryParams: any;
};

type HomeContainerProps = MainProps & {
  boardId: string;
};

class HomeContainer extends React.Component<HomeContainerProps> {
  componentDidMount() {
    const { history, boardId, queryParams } = this.props;

    if (!queryParams.boardId && boardId) {
      routerUtils.setParams(history, { boardId });
    }
  }

  render() {
    return <Home {...this.props} />;
  }
}

type LastBoardProps = MainProps & {
  boardGetLastQuery: BoardGetLastQueryResponse;
};

// Getting lastBoard id to currentBoard
const LastBoard = (props: LastBoardProps) => {
  const { boardGetLastQuery } = props;

  if (boardGetLastQuery.loading) {
    return <Spinner objective={true} />;
  }

  const lastBoard = boardGetLastQuery.calendarBoardGetLast || ({} as IBoard);

  const extendedProps = {
    ...props,
    boardId: lastBoard._id,
  };

  return <HomeContainer {...extendedProps} />;
};

type HomerProps = { queryParams: any } & IRouterProps;

const LastBoardContainer = withProps<MainProps>(
  compose(
    graphql<MainProps, BoardGetLastQueryResponse, {}>(
      gql(queries.boardGetLast),
      {
        name: 'boardGetLastQuery',
      },
    ),
  )(LastBoard),
);

// Main home component
const MainContainer = (props: HomerProps) => {
  const { history } = props;
  const boardId = routerUtils.getParam(history, 'boardId');

  if (boardId) {
    const extendedProps = { ...props, boardId };

    return <HomeContainer {...extendedProps} />;
  }

  return <LastBoardContainer {...props} />;
};

export default MainContainer;
