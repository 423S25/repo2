import React, { createContext, useEffect, useReducer, useState } from "react"
import { HeaderSimple } from "../components/header/Header"
import { NavbarMinimal } from "../components/navbar/navbar"
import { TableSort } from "../components/table/InventoryTable"
import Dashboard from "../components/analytics/Analytics"
import InventoryItem from "../types/InventoryItemType"
import APIRequest from "../api/request"
import { FooterSimple } from "../components/footer/Footer"
import { baseURL } from "../App"

export const TableDataContext = createContext<InventoryItem[]>([]);


export interface ItemReducerAction {
  item : InventoryItem;
  type : string;
}


const inventoryItemReducer = (items : Array<InventoryItem>, action : ItemReducerAction) => {
  const setItemStatuses = (itemList : InventoryItem[]) => {
    itemList.map((e : InventoryItem) => {
      if (e.base_count <= e.stock_count){
        e.status = "Good";
      }
      else if (e.base_count * 0.5 > e.stock_count){
        e.status = "Very Low";
      }
      else if (e.base_count > e.stock_count){
        e.status = "Low";
      }
    })
    return itemList
  }
  switch (action.type) {
    case "set" : {
    // @ts-ignore
      return setItemStatuses(action.item);
    }
    case "add": {
      items = [
        ...items,
        {
          ...action.item
        }
      ];
      return setItemStatuses(items);
    }
    case "update": {
      items = items.map((item) =>
        item.id === action.item.id ? { ...item, ...action.item } : item
      );
      return setItemStatuses(items);
    }

    case "delete": {
      items = items.filter((item) => item.id !== action.item.id);
      return setItemStatuses(items);
    }
    default: {
      throw Error('Unknown action: ' + action.type);
    }
  }
}

/*
Homepage component that serves as the main ui element when users first login

Contains the header, the inventory table, and a navbar to move to other pages

*/
const Home : React.FC = () => {
  const [tab, setTab] = useState('Home');
  const [items, dispatchItemChange] = useReducer(inventoryItemReducer, []);
  const requester = new APIRequest(`${baseURL}/management/inventory/`);

  const changeTab = (newTab : string) => {
    setTab(newTab)
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await requester.get();
        dispatchItemChange({type : "set", "item" : json})
      } catch (err) {
        console.log(err)
      } finally {
      }
    };

    fetchData();}
 ,[]);
  return (
    <>
      <TableDataContext.Provider value={items}>
      <div className="h-screen">
        <HeaderSimple/>
        <div className="flex flex-row mt-4 w-screen">
          <NavbarMinimal changeTab={changeTab}/>
          <div className = "px-8 w-full">
            {tab==="Analytics" ? <Dashboard/> : null}
            {tab==="Home" ? <TableSort items={items} dispatchItemChange={dispatchItemChange}/> : null}
          </div>
        </div>
        <FooterSimple/>
      </div>
      </TableDataContext.Provider>
    </>

  )
}


export default Home
