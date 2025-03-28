import classes from './Header.module.css';
import { ActionIcon, useMantineColorScheme, useComputedColorScheme } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconSun, IconMoon, IconBellFilled } from '@tabler/icons-react';
import cx from 'clsx';

export function HeaderSimple() {
  const { setColorScheme } = useMantineColorScheme();
  const [notificationOpen, setNotificationOpen] = useDisclosure(false);

  
  const computedColorScheme = useComputedColorScheme('light', { getInitialValueInEffect: true });
  return (
    <header className={classes.header}>
      <div className="flex flex-row justify-between h-8 items-center mx-4 my-1 grow">
        <img className={classes.img} src={"./HRDC-50-Horz-Reversed-large.png"}/>
          <IconBellFilled size={20} stroke={1.5} color='white' onClick={() => {
            setNotificationOpen.open()
          }
        }/>
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
    </header>
  );
}
