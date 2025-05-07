import classes from './Header.module.css';
import { useMantineColorScheme, useComputedColorScheme, Popover, Avatar, Menu } from '@mantine/core';
import { IconSun, IconMoon, IconBellFilled, IconSwitchHorizontal, IconUserExclamation, IconMenu } from '@tabler/icons-react';
import cx from 'clsx';
import { useContext, useState } from 'react';
import NotificationList from '../notifications/NotificationList';
import { AuthContext, useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../App';


interface HeaderProps {
  toggleNav : () => void;
}


export function HeaderSimple({ toggleNav } : HeaderProps) {
  console.log(toggleNav)
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
        <div className="flex row">
          <img className={classes.img} src={"./HRDC-50-Horz-Reversed-large.png"}/>
          <IconMenu className="block md:hidden ml-2" onClick={() => toggleNav()}/>
        </div>
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
              <Menu.Label>Logged in as {userContext?.user?.username}</Menu.Label>
              <Menu.Item onClick={() => handleLogout()} leftSection={<IconSwitchHorizontal size={16} stroke={1.5} />}>
                Change account
              </Menu.Item>
              {userContext?.user?.superuser ?
              <Menu.Item leftSection={<IconUserExclamation size={16} stroke={1.5}/>}>
                <a href={`${baseURL}/admin`}>View Admin Site</a>
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
