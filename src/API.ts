/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type CreateBookmarkInput = {
  id?: string | null,
  url: string,
  timestamp: number,
  title?: string | null,
  thumbnail?: string | null,
  note?: string | null,
  _version?: number | null,
};

export type ModelBookmarkConditionInput = {
  url?: ModelStringInput | null,
  timestamp?: ModelFloatInput | null,
  title?: ModelStringInput | null,
  thumbnail?: ModelStringInput | null,
  note?: ModelStringInput | null,
  and?: Array< ModelBookmarkConditionInput | null > | null,
  or?: Array< ModelBookmarkConditionInput | null > | null,
  not?: ModelBookmarkConditionInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export enum ModelAttributeTypes {
  binary = "binary",
  binarySet = "binarySet",
  bool = "bool",
  list = "list",
  map = "map",
  number = "number",
  numberSet = "numberSet",
  string = "string",
  stringSet = "stringSet",
  _null = "_null",
}


export type ModelSizeInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
};

export type ModelFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type ModelBooleanInput = {
  ne?: boolean | null,
  eq?: boolean | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
};

export type Bookmark = {
  __typename?: "Bookmark",
  id?: string,
  url: string,
  timestamp: number,
  title?: string | null,
  thumbnail?: string | null,
  note?: string | null,
  createdAt?: string,
  updatedAt?: string,
  _version?: number,
  _deleted?: boolean | null,
  _lastChangedAt?: number,
};

export type UpdateBookmarkInput = {
  id: string,
  url?: string | null,
  timestamp?: number | null,
  title?: string | null,
  thumbnail?: string | null,
  note?: string | null,
  _version?: number | null,
};

export type DeleteBookmarkInput = {
  id: string,
  _version?: number | null,
};

export type ModelBookmarkFilterInput = {
  id?: ModelIDInput | null,
  url?: ModelStringInput | null,
  timestamp?: ModelFloatInput | null,
  title?: ModelStringInput | null,
  thumbnail?: ModelStringInput | null,
  note?: ModelStringInput | null,
  and?: Array< ModelBookmarkFilterInput | null > | null,
  or?: Array< ModelBookmarkFilterInput | null > | null,
  not?: ModelBookmarkFilterInput | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  attributeExists?: boolean | null,
  attributeType?: ModelAttributeTypes | null,
  size?: ModelSizeInput | null,
};

export type ModelBookmarkConnection = {
  __typename: "ModelBookmarkConnection",
  items:  Array<Bookmark | null >,
  nextToken?: string | null,
  startedAt?: number | null,
};

export type ModelSubscriptionBookmarkFilterInput = {
  id?: ModelSubscriptionIDInput | null,
  url?: ModelSubscriptionStringInput | null,
  timestamp?: ModelSubscriptionFloatInput | null,
  title?: ModelSubscriptionStringInput | null,
  thumbnail?: ModelSubscriptionStringInput | null,
  note?: ModelSubscriptionStringInput | null,
  and?: Array< ModelSubscriptionBookmarkFilterInput | null > | null,
  or?: Array< ModelSubscriptionBookmarkFilterInput | null > | null,
  _deleted?: ModelBooleanInput | null,
};

export type ModelSubscriptionIDInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionStringInput = {
  ne?: string | null,
  eq?: string | null,
  le?: string | null,
  lt?: string | null,
  ge?: string | null,
  gt?: string | null,
  contains?: string | null,
  notContains?: string | null,
  between?: Array< string | null > | null,
  beginsWith?: string | null,
  in?: Array< string | null > | null,
  notIn?: Array< string | null > | null,
};

export type ModelSubscriptionFloatInput = {
  ne?: number | null,
  eq?: number | null,
  le?: number | null,
  lt?: number | null,
  ge?: number | null,
  gt?: number | null,
  between?: Array< number | null > | null,
  in?: Array< number | null > | null,
  notIn?: Array< number | null > | null,
};

export type CreateBookmarkMutationVariables = {
  input: CreateBookmarkInput,
  condition?: ModelBookmarkConditionInput | null,
};

export type CreateBookmarkMutation = {
  createBookmark?:  {
    __typename: "Bookmark",
    id: string,
    url: string,
    timestamp: number,
    title?: string | null,
    thumbnail?: string | null,
    note?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type UpdateBookmarkMutationVariables = {
  input: UpdateBookmarkInput,
  condition?: ModelBookmarkConditionInput | null,
};

export type UpdateBookmarkMutation = {
  updateBookmark?:  {
    __typename: "Bookmark",
    id: string,
    url: string,
    timestamp: number,
    title?: string | null,
    thumbnail?: string | null,
    note?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type DeleteBookmarkMutationVariables = {
  input: DeleteBookmarkInput,
  condition?: ModelBookmarkConditionInput | null,
};

export type DeleteBookmarkMutation = {
  deleteBookmark?:  {
    __typename: "Bookmark",
    id: string,
    url: string,
    timestamp: number,
    title?: string | null,
    thumbnail?: string | null,
    note?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type GetBookmarkQueryVariables = {
  id: string,
};

export type GetBookmarkQuery = {
  getBookmark?:  {
    __typename: "Bookmark",
    id: string,
    url: string,
    timestamp: number,
    title?: string | null,
    thumbnail?: string | null,
    note?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type ListBookmarksQueryVariables = {
  filter?: ModelBookmarkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
};

export type ListBookmarksQuery = {
  listBookmarks?:  {
    __typename: "ModelBookmarkConnection",
    items:  Array< {
      __typename: "Bookmark",
      id: string,
      url: string,
      timestamp: number,
      title?: string | null,
      thumbnail?: string | null,
      note?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type SyncBookmarksQueryVariables = {
  filter?: ModelBookmarkFilterInput | null,
  limit?: number | null,
  nextToken?: string | null,
  lastSync?: number | null,
};

export type SyncBookmarksQuery = {
  syncBookmarks?:  {
    __typename: "ModelBookmarkConnection",
    items:  Array< {
      __typename: "Bookmark",
      id: string,
      url: string,
      timestamp: number,
      title?: string | null,
      thumbnail?: string | null,
      note?: string | null,
      createdAt: string,
      updatedAt: string,
      _version: number,
      _deleted?: boolean | null,
      _lastChangedAt: number,
    } | null >,
    nextToken?: string | null,
    startedAt?: number | null,
  } | null,
};

export type OnCreateBookmarkSubscriptionVariables = {
  filter?: ModelSubscriptionBookmarkFilterInput | null,
};

export type OnCreateBookmarkSubscription = {
  onCreateBookmark?:  {
    __typename: "Bookmark",
    id: string,
    url: string,
    timestamp: number,
    title?: string | null,
    thumbnail?: string | null,
    note?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnUpdateBookmarkSubscriptionVariables = {
  filter?: ModelSubscriptionBookmarkFilterInput | null,
};

export type OnUpdateBookmarkSubscription = {
  onUpdateBookmark?:  {
    __typename: "Bookmark",
    id: string,
    url: string,
    timestamp: number,
    title?: string | null,
    thumbnail?: string | null,
    note?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};

export type OnDeleteBookmarkSubscriptionVariables = {
  filter?: ModelSubscriptionBookmarkFilterInput | null,
};

export type OnDeleteBookmarkSubscription = {
  onDeleteBookmark?:  {
    __typename: "Bookmark",
    id: string,
    url: string,
    timestamp: number,
    title?: string | null,
    thumbnail?: string | null,
    note?: string | null,
    createdAt: string,
    updatedAt: string,
    _version: number,
    _deleted?: boolean | null,
    _lastChangedAt: number,
  } | null,
};
