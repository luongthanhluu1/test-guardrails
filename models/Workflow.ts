import { Product } from "./Product";
import { Location } from "./Location";

export interface WorkflowItem {
  item: Product;
  quantily: number;
  totalPrice?: number;
}

export interface Workflow {
  costs: number;
  location: Location | null;
  name: string;
  fromItems: WorkflowItem[];
  toItem: WorkflowItem;
  type?: string;
}
