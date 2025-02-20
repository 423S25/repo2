import { HeaderSimple } from "../components/header/Header"
import { NavbarMinimal } from "../components/navbar/navbar"
import { TableSort } from "../components/table/InventoryTable"

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
