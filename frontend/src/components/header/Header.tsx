import classes from './Header.module.css';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Popover, Avatar, Menu } from '@mantine/core';
import { IconSun, IconMoon, IconBellFilled, IconSwitchHorizontal, IconUserExclamation } from '@tabler/icons-react';
import cx from 'clsx';
import { useContext, useState } from 'react';
import NotificationList from '../notifications/NotificationList';
import { AuthContext } from '../../contexts/AuthContext';

export function HeaderSimple() {
  const { setColorScheme } = useMantineColorScheme();
  const userContext = useContext(AuthContext);
  console.log(userContext)

  const [opened, setOpened] = useState(false);  

  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  return (
    <header className={classes.header}>
      <div className="flex flex-row justify-between h-8 items-center mx-4 my-1 grow">
        <img className={classes.img} src={"./HRDC-50-Horz-Reversed-large.png"}/>
        <div className="flex flex-row items-center">
          <Menu>
            <Menu.Target>
              <Avatar src={"avatar-image.jpg"} alt={"Admin"} />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}>
                Change account
              </Menu.Item>
              <Menu.Item leftSection={<IconUserExclamation size={16} stroke={1.5}/>}>
                View Admin Site
              </Menu.Item>
                <Menu.Item
                onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
                leftSection={
                  <>
                    <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
                    <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
                  </>
              }
                  >
                  Change Color Theme
                </Menu.Item>

              </Menu.Dropdown>
            </Menu>

          <Popover opened={opened} onChange={setOpened} >
            <Popover.Target>
                <IconBellFilled className="mr-1" size ={30} stroke={1.5} color='white'onClick={() => setOpened((o) => !o)} />
            </Popover.Target>

            <Popover.Dropdown><NotificationList/></Popover.Dropdown>
          </Popover>
        </div>
      </div>
    </header>
  );
}
