import classes from './Header.module.css';
import { useMantineColorScheme, useComputedColorScheme, Popover, Avatar, Menu } from '@mantine/core';
import { IconSun, IconMoon, IconBellFilled, IconSwitchHorizontal, IconUserExclamation } from '@tabler/icons-react';
import cx from 'clsx';
import { useContext, useState } from 'react';
import NotificationList from '../notifications/NotificationList';
import { AuthContext, useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';


interface HeaderProps {
  toggleNav : () => void;
}


export function HeaderSimple({ toggleNav } : HeaderProps) {
  const { setColorScheme } = useMantineColorScheme();
  const userContext = useContext(AuthContext);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login"); // Redirect to login after logout
  };
  const [opened, setOpened] = useState(false);  

  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });
  return (
    <header className={classes.header}>
      <div className="flex flex-row justify-between h-8 items-center mx-4 my-1 grow">
        <img className={classes.img} src={"./HRDC-50-Horz-Reversed-large.png"}/>
        <div className="flex flex-row items-center">
          <Popover opened={opened} onChange={setOpened}>
            <Popover.Target>
                <IconBellFilled className="mr-4" size ={30} stroke={1.5} color='white' onClick={() => setOpened((o) => !o)} />
            </Popover.Target>

            <Popover.Dropdown><NotificationList/></Popover.Dropdown>
          </Popover>
          <Menu>
            <Menu.Target>
              <Avatar src={"avatar-image.jpg"} alt={"Admin"} />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => handleLogout()} leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}>
                Change account
              </Menu.Item>
              {userContext?.user?.superuser ?
              <Menu.Item leftSection={<IconUserExclamation size={16} stroke={1.5}/>}>
                View Admin Site
              </Menu.Item>
              : null}
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

        </div>
      </div>
    </header>
  );
}
