import {
  TAllowedAction,
  EActions,
  EResource,
} from "@0xflick/ordinals-rbac-models";
import {
  PermissionAction,
  PermissionResource,
  Permission,
} from "@/graphql/types";

export function graphqlActionToEAction(action: PermissionAction): EActions {
  switch (action) {
    case PermissionAction.Admin:
      return EActions.ADMIN;
    case PermissionAction.Get:
      return EActions.GET;
    case PermissionAction.Update:
      return EActions.UPDATE;
    case PermissionAction.Delete:
      return EActions.DELETE;
    case PermissionAction.List:
      return EActions.LIST;
    case PermissionAction.Create:
      return EActions.CREATE;
    case PermissionAction.Use:
      return EActions.USE;
    default:
      throw new Error(`Unknown action ${action}`);
  }
}

export function graphqlResourceToEResource(resource: PermissionResource) {
  switch (resource) {
    case PermissionResource.All:
      return EResource.ALL;
    case PermissionResource.Admin:
      return EResource.ADMIN;
    case PermissionResource.Presale:
      return EResource.PRESALE;
    case PermissionResource.User:
      return EResource.USER;
    case PermissionResource.Affiliate:
      return EResource.AFFILIATE;
    default:
      throw new Error(`Unknown resource ${resource}`);
  }
}

export function graphQlAllowedActionToPermission(
  permission: Permission
): TAllowedAction {
  return {
    action: graphqlActionToEAction(permission.action),
    resource: graphqlResourceToEResource(permission.resource),
  };
}
