import {
  defaultAdminStrategyAll,
  isOneOfActionOnResource,
  EActions,
  EResource,
} from "@0xflick/ordinals-rbac-models";

export const canSeeAdminPanel = defaultAdminStrategyAll(
  EResource.ADMIN,
  isOneOfActionOnResource([EActions.USE], EResource.ADMIN)
);

export const canPreSaleMint = defaultAdminStrategyAll(
  EResource.PRESALE,
  isOneOfActionOnResource([EActions.USE], EResource.PRESALE)
);
