import { gql } from 'apollo-server-express';
import Query from './Query';
import Mutation from './Mutation';
import ForumCategory from './ForumCategory';
import ForumPost from './ForumPost';
import ForumComment from './ForumComment';
import { ADMIN_APPROVAL_STATES, POST_STATES } from '../../db/models/post';
import {
  ALL_CP_USER_LEVELS,
  PERMISSIONS,
  READ_CP_USER_LEVELS,
  USER_TYPES,
  WRITE_CP_USER_LEVELS
} from '../../consts';
import ForumPermissionGroupCategoryPermit from './ForumPermissionGroupCategoryPermit';
import ForumPermissionGroup from './ForumPermissionGroup';

export default async function genTypeDefs(serviceDiscovery) {
  return gql`
    scalar JSON
    scalar Date

    enum ForumPostState {
      ${POST_STATES.join('\n')}
    }

    enum AdminApprovalState {
      ${ADMIN_APPROVAL_STATES.join('\n')}
    }

    enum ForumUserType {
      ${USER_TYPES.join('\n')}
    }

    enum ForumPermission {
      ${PERMISSIONS.join('\n')}
    }

    enum ForumAllUserLevels {
      ${Object.keys(ALL_CP_USER_LEVELS).join('\n')}
    }

    enum ForumUserLevelsWrite {
      ${Object.keys(WRITE_CP_USER_LEVELS).join('\n')}
    }

    enum ForumUserLevelsRead {
      ${Object.keys(READ_CP_USER_LEVELS).join('\n')}
    }

    extend type User @key(fields: "_id") {
      _id: String! @external
    }

    extend type ClientPortalUser @key(fields: "_id") {
      _id: String! @external
      forumSubscriptionEndsAfter: Date
      forumIsSubscribed: Boolean!

      forumFollowerCpUsers(limit: Int, offset: Int): [ClientPortalUser!]
      forumFollowingCpUsers(limit: Int, offset: Int): [ClientPortalUser!]
      forumPermissionGroups: [ForumPermissionGroup!]

      forumCategoriesAllowedToPost: [ForumCategory!]
    }

    ${ForumCategory}
    ${ForumPost}
    ${ForumComment}

    ${ForumPermissionGroup}
    ${ForumPermissionGroupCategoryPermit}

    ${Query}
    ${Mutation}
  `;
}
