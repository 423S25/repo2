// / Define a ts interface that contains the datatypes and schema for the return data for each inventory item
interface InventoryItem {
  pk : number,
  item_name: string;
  stock_count : number;
  minimum_count: number;
  category : string;
}

export default InventoryItem
