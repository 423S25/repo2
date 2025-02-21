import { HeaderSimple } from "../components/header/Header"
import { NavbarMinimal } from "../components/navbar/navbar"
import { TableSort } from "../components/table/InventoryTable"


/*
Homepage component that serves as the main ui element when users first login

Contains the header, the inventory table, and a navbar to move to other pages

*/
const Home = () => {
  return (
    <>
      <HeaderSimple/>
      <div className="flex flex-row mt-4">
        <NavbarMinimal/>
        <div className = "px-8">
          <TableSort />
        </div>
      </div>
    </>

  )
}


export default Home
