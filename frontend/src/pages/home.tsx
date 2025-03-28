import { useState } from "react"
import { HeaderSimple } from "../components/header/Header"
import { NavbarMinimal } from "../components/navbar/navbar"
import { TableSort } from "../components/table/InventoryTable"
import Analytics from "../components/analytics/Analytics"
import Dashboard from "../components/analytics/Analytics"


/*
Homepage component that serves as the main ui element when users first login

Contains the header, the inventory table, and a navbar to move to other pages

*/
const Home = () => {
  const [tab, setTab] = useState('Home')

  const changeTab = (newTab : string) => {
    setTab(newTab)
  }
  
  return (
    <>
      <HeaderSimple/>
      <div className="flex flex-row mt-4 w-screen">
        <NavbarMinimal changeTab={changeTab}/>
        <div className = "px-8 w-full">
          {tab==="Analytics" ? <Dashboard/> : null}
          {tab==="Home" ? <TableSort /> : null}
        </div>
      </div>
    </>

  )
}


export default Home
