import React, { createContext, useEffect, useReducer, useState } from "react"
import { HeaderSimple } from "../components/header/Header"
import { NavbarMinimal } from "../components/navbar/navbar"
import { TableSort } from "../components/table/InventoryTable"
import InventoryItem from "../types/InventoryItemType"
import APIRequest from "../api/request"
import { FooterSimple } from "../components/footer/Footer"
import { baseURL } from "../App"
import Analytics from "../components/analytics/Analytics"
import Dashboard from "../components/dashboard/Dashboard"
import { IconX } from "@tabler/icons-react"
import { UserCard } from "../components/userinfo/UserInfo"

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
const Home: React.FC = () => {
  const [tab, setTab] = useState('Home');
  const [items, dispatchItemChange] = useReducer(inventoryItemReducer, []);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const requester = new APIRequest(`${baseURL}/management/inventory/`);
  
  const changeTab = (newTab: string) => {
    setTab(newTab);
    setMobileNavOpen(false); // Close mobile nav when tab changes
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const json = await requester.get();
        dispatchItemChange({type: "set", "item": json});
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, []);
  
  return (
    <>
      <TableDataContext.Provider value={items}>
        <div className="min-h-screen flex flex-col w-screen">
          <HeaderSimple toggleNav={() => setMobileNavOpen(!mobileNavOpen)} />
          
          <div className="flex flex-grow w-full overflow-hidden">
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <NavbarMinimal changeTab={changeTab} />
            </div>
            
            {mobileNavOpen && (
              <div className="fixed inset-0 z-50 bg-white md:hidden">
                <div className="flex justify-end p-4">
                  <button onClick={() => setMobileNavOpen(false)}>
                    <IconX size={24} />
                  </button>
                </div>
                <NavbarMinimal changeTab={changeTab} />
              </div>
            )}
            
            <div className="w-full px-4 md:px-8 overflow-auto pb-16">
              {tab === "Home" && <Dashboard items={items} />}
              {tab === "Analytics" && <Analytics />}
              {tab === "Dashboard" && <TableSort items={items} dispatchItemChange={dispatchItemChange} />}
              {tab === "Settings" && <UserCard/> }
            </div>
          </div>
          
          <FooterSimple />
        </div>
      </TableDataContext.Provider>
    </>
  );
};

export default Home;
