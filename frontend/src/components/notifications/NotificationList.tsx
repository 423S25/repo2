import { useContext, useEffect, useState } from "react"
import { List, ThemeIcon } from "@mantine/core";
import { IconCircleCheck } from "@tabler/icons-react";
import InventoryItem from "../../types/InventoryItemType";
import { TableDataContext } from "../../pages/home";



const NotificationList = () => {
  const data = useContext(TableDataContext);
  let displayData = data.filter((e) => e.status !== "Good");
  console.log(data)
  displayData = displayData.slice(0, 4);
  const rows = displayData.map((e :InventoryItem) => (
         <List.Item>{e.item_name} is running {e.status} on supply.</List.Item>
  ));
  const emptyNotification = (
    <div>
      No Notifications
    </div>
  )
  return (
    <>
      <List
      spacing="xs"
      size="sm"
      center
      icon={
        <ThemeIcon color="teal" size={24} radius="xl">
          <IconCircleCheck size={16} />
        </ThemeIcon>
      }
    >
    {displayData.length > 0 ? rows : emptyNotification}
    </List>
    </>
  )
}

export default NotificationList
