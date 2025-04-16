// / Define a ts interface that contains the datatypes and schema for the return data for each inventory item
interface InventoryItem {
  id : number,
  item_name: string;
  stock_count : number;
  base_count: number;
  bulk_count : number;
  status : string;
  brand : string;
  item_category : string;
  individual_cost : number;
  bulk_cost : number;
  is_bulk : boolean
  donated : boolean;

}

export default InventoryItem
