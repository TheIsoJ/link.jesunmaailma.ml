import { createStyles, Title, Text, Button, Container, Group, MantineProvider } from '@mantine/core';
import type { NextPage } from 'next';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['500', '400', '900'],
  subsets: ['latin'],
});

const useStyles = createStyles((theme) => ({
  root: {
    paddingTop: 80,
    paddingBottom: 80,
  },

  label: {
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 220,
    lineHeight: 1,
    marginBottom: theme.spacing.xl * 1.5,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],

    [theme.fn.smallerThan('sm')]: {
      fontSize: 120,
    },
  },

  title: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    textAlign: 'center',
    fontWeight: 900,
    fontSize: 38,

    [theme.fn.smallerThan('sm')]: {
      fontSize: 32,
    },
  },

  description: {
    maxWidth: 500,
    margin: 'auto',
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xl * 1.5,
  },
}));

const PageNotFound: NextPage = () => {
  const { classes } = useStyles();

  return (
    <MantineProvider
      theme={{
        // Override any other properties from default theme
        colorScheme: 'dark',
        fontFamily: poppins.style.fontFamily,
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <Container className={classes.root}>
        <div className={classes.label}>404</div>
        <Title className={classes.title}>Sivua ei löytynyt</Title>
        <Text color="dimmed" size="lg" align="center" className={classes.description}>
        Valitettavasti pyytämääsi sivua ei löytynyt tältä sivustolta. Olet ehkä kirjoittanut osoitteen väärin tai sivu on saatettu siirtää toiseen URL-osoitteeseen.
        </Text>
        <Group position="center">
          <Button component="a" href="/" variant="subtle" size="md">
            Takaisin kotisivulle
          </Button>
        </Group>
      </Container>
    </MantineProvider>
  );
};

export default PageNotFound;