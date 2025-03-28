import { Anchor, Container, Group } from '@mantine/core';
import classes from './Footer.module.css';

const links = [
  { link: 'https://423s25.github.io/repo2/DeveloperDocs', label: 'Developer Documentation' },
  { link: 'https://423s25.github.io/repo2/UserDocumentation', label: 'User Documentation' },
];

export function FooterSimple() {
  const items = links.map((link) => (
    <Anchor<'a'>
      c="dimmed"
      key={link.label}
      href={link.link}
      onClick={(event) => event.preventDefault()}
      size="sm"
    >
      {link.label}
    </Anchor>
  ));

  return (
    <div className={classes.footer}>
      <Container className={classes.inner}>
        <Group className={classes.links}>{items}</Group>
      </Container>
    </div>
  );
}
