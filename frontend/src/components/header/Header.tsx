import classes from './Header.module.css';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme, Popover } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon, IconBellFilled } from '@tabler/icons-react';
import cx from 'clsx';
import { useState } from 'react';
import NotificationList from '../notifications/NotificationList';

export function HeaderSimple() {
  const { setColorScheme } = useMantineColorScheme();

  const [opened, setOpened] = useState(false);  

  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  return (
    <header className={classes.header}>
      <div className="flex flex-row justify-between h-8 items-center mx-4 my-1 grow">
        <img className={classes.img} src={"./HRDC-50-Horz-Reversed-large.png"}/>
        <div className="flex flex-row items-center">
          <Popover opened={opened} onChange={setOpened} >
            <Popover.Target>
                <IconBellFilled className="mr-1" size ={30} stroke={1.5} color='white'onClick={() => setOpened((o) => !o)} />
            </Popover.Target>

            <Popover.Dropdown><NotificationList/></Popover.Dropdown>
          </Popover>
          <ActionIcon
            onClick={() => setColorScheme(computedColorScheme === 'light' ? 'dark' : 'light')}
            variant="default"
            size="xl"
            aria-label="Toggle color scheme"
          >
            <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
            <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
          </ActionIcon>
        </div>
      </div>
    </header>
  );
}
