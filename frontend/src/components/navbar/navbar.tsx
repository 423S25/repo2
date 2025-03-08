import { useState } from 'react'
import {
  IconDeviceDesktopAnalytics,
  IconGauge,
  IconHome2,
  IconLogout,
  IconSettings,
  IconSwitchHorizontal,
  
}

from '@tabler/icons-react';
import { Center, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import classes from './NavbarMinimal.module.css';

interface NavbarLinkProps {
  icon: typeof IconHome2;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function NavbarLink({ icon: Icon, label, active, onClick }: NavbarLinkProps) {
  return (
    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
      <UnstyledButton onClick={onClick} className={classes.link} data-active={active || undefined}>
        <Icon size={20} stroke={1.5} />
      </UnstyledButton>
    </Tooltip>
  );
}

const mockdata = [
  { icon: IconHome2, label: 'Home' },
  { icon: IconDeviceDesktopAnalytics, label: 'Analytics' },
  { icon: IconGauge, label: 'Dashboard' },
  // { icon: IconCalendarStats, label: 'Releases' },
  // { icon: IconUser, label: 'Account' },
  // { icon: IconFingerprint, label: 'Security' },
  { icon: IconSettings, label: 'Settings' },
];


interface NavBarProps {
  changeTab : (tab : string) => void
}


export function NavbarMinimal(props : NavBarProps) {
  const [active, setActive] = useState(0);

  const links = mockdata.map((link, index) => (
    <NavbarLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => {
        setActive(index);
        props.changeTab(link.label)
      }
    }
    />
  ));

  return (
    <nav className={classes.navbar}>
      <Center>
      </Center>

      <div className={classes.navbarMain}>
        <Stack justify="center" gap={0}>
          {links}
        </Stack>
      </div>

      <Stack justify="center" gap={0}>
        <NavbarLink icon={IconSwitchHorizontal} label="Change account" />
        <NavbarLink icon={IconLogout} label="Logout" />
      </Stack>
    </nav>
  );
}
