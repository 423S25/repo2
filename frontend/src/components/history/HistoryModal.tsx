import { Button, Modal, List } from "@mantine/core"
import { baseURL } from "../../App"
import APIRequest from "../../api/request"
import { useEffect, useState } from "react"
import InventoryItem from "../../types/InventoryItemType"


interface HistoryModalProps {
  currentItem : InventoryItem;
  opened : boolean,
  close : () => void,
}

const HistoryModal = ({currentItem, opened, close} : HistoryModalProps) => {
  const [itemHistory, setItemHistory] = useState<string[]>([]);


  const formatHistory = (current : InventoryItem, previous : InventoryItem) => {
    // let changedKeys : { [key: string]: any } = {};
    let historyString : string = "";
    console.log(current);
    (Object.keys(current) as Array<keyof typeof current>).forEach(function(key : string, _){
      if (Object(current)[key] !== Object(previous)[key]){
        historyString = `Update was made on field ${key} and value changed to ${Object(current)[key]}` 
        // changedKeys[key] = Object(current)[key];
      }
    });
    return historyString;
  }

  const historyElements = (formattedHistory : string[]) => {
    return formattedHistory.map((row, _) => 
      (
        <List.Item>{row}</List.Item>
      )
    );
  }
  const getHistory = async (pk : number, page : number) =>{
    const requester = new APIRequest(`${baseURL}/management/inventory/history/${pk}`)
    const response = await requester.get({"page": page});
    // let formattedHistory : { [key: string]: any }[] = [];
    let formattedHistory : string[] = [];
    for (let i = 0; i< response.length-1; i++){
      formattedHistory.push(formatHistory(response[i], response[i+1]));
    }
    setItemHistory(formattedHistory);
  }
  const [item, setItem] = useState(currentItem);
  useEffect(() => {
    setItem(currentItem)
    console.log(item)
    getHistory(currentItem.id, 1);
  }, [currentItem])
    
  return (
    <>
      <Modal opened={opened} onClose={close} title="Delete Item">
        <List>
          {historyElements(itemHistory)}
        </List>
      </Modal>
    </>
  )
}

export default HistoryModal
