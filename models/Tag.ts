export enum TagType {
  TAG = "tag",
  COLOR = "color",
  CATEGORY = "category",
}

export interface Tag {
  name: string;
  value: string;
  _id?: string;
  id?: string;
  type: TagType;
  typeName?: string;
}

export const TagOptions: TagType[] = [TagType.TAG, TagType.COLOR];
