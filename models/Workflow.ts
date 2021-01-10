import { Product } from "./Product";

export interface WorkflowItem {
  item: Product;
  quantily: number;
  totalPrice?: number;
}

export interface Workflow {
  costs: number;
  name: string;
  fromItems: WorkflowItem[];
  toItem: WorkflowItem;
  type?: string;
}
