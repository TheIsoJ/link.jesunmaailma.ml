"use client"

import {
  createStyles,
  Container,
  Text,
  TextInput,
  Button,
  MantineProvider,
  keyframes,
  Tooltip,
  Table,
} from "@mantine/core"
import { useViewportSize } from "@mantine/hooks"
import { Link1Icon } from "@radix-ui/react-icons"
import type { NextPage } from "next"
import { useEffect, useState } from "react"
import { ChangeEvent } from "react"
import axios from "axios"
import { Poppins } from "next/font/google"
import { Ring } from "@uiball/loaders"

const poppins = Poppins({
  weight: ["500", "400", "900"],
  subsets: ["latin"],
})

const BREAKPOINT = 755

const fadeOut = keyframes({
  from: {
    opacity: 1,
    transform: "translateY(0)",
  },

  to: {
    opacity: 0,
    transform: "translateY(-20px)",
  },
})

const useStyles = createStyles((theme) => ({
  inner: {
    position: "relative",
    paddingTop: useViewportSize().height / 3.1,
    [`@media (max-width: ${BREAKPOINT})`]: {
      paddingBottom: 80,
      paddingTop: 80,
    },
  },
  table: {
    borderRadius: ".5rem"
  },
  title: {
    fontFamily: poppins.style.fontFamily,
    fontSize: 40,
    fontWeight: 900,
    lineHeight: 1.1,
    textAlign: "center",
    margin: 0,
    padding: 0,
    color: theme.white,

    [`@media (max-width: ${BREAKPOINT})`]: {
      fontSize: 42,
      lineHeight: 1.2,
    },
  },
  subtitle: {
    fontFamily: poppins.style.fontFamily,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.1,
    textAlign: "center",
    marginTop: 16,
    padding: 0,
    color: theme.white,
  },
  subtitle2: {
    fontFamily: poppins.style.fontFamily,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.1,
    textAlign: "center",
    marginTop: 16,
    padding: 0,
    color: "hsl(0, 0%, 60%)",
  },
  listText: {
    fontFamily: poppins.style.fontFamily,
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 1.1,
    marginTop: 16,
    marginBottom: 16,
    padding: 0,
    color: theme.white,
  },
  listText2: {
    fontFamily: poppins.style.fontFamily,
    fontSize: 24,
    fontWeight: 400,
    lineHeight: 1.1,
    marginTop: 16,
    padding: 0,
    color: "hsl(0, 0%, 60%)",
  },
  controls: {
    marginTop: theme.spacing.xl * 2,

    [`@media (max-width: ${BREAKPOINT})`]: {
      marginTop: theme.spacing.xl,
    },
  },
  notification: {
    animation: `${fadeOut} 2s forwards`,
  },
}))

const Home: NextPage = () => {
  const { classes } = useStyles()

  const [text, setText] = useState("")

  const [showCopy, setShowCopy] = useState(false)

  const [opened, setOpened] = useState(false)

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const [links, setLinks] = useState<ShortLinksProps>([])

  function handleChange(event: ChangeEvent<HTMLInputElement>): void {
    setText(event.target.value)
    setShowCopy(false)
  }

  async function handleClick() {
    try {
      const response = await axios.post<Props>(
        `${process.env.NEXT_PUBLIC_API_URL}/new`,
        { url: text }
      )
      setText(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${response.data.short}`)
      getShortenedLinks()
    } catch (error) {
      console.error(error)
    }

    setShowCopy(true)
  }

  async function getShortenedLinks() {
    setError("")
    setLoading(true)

    try {
      const response = await axios.get<ShortLinksProps>(
        `${process.env.NEXT_PUBLIC_API_URL}/short-links`
      )
      setLinks(response.data)
    } catch (e: any) {
      setError(e.message)
      console.error(e.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    getShortenedLinks()
  }, [])

  function handleCopyToClipboard(): void {
    navigator.clipboard.writeText(text)

    setOpened((o) => !o)

    setTimeout(() => {
      setOpened((o) => !o)
    }, 200)
  }

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (event.key === "Enter" && !showCopy) {
      handleClick()
    }
  }

  return (
    <>
      <MantineProvider
        theme={{ colorScheme: "dark" }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Container size={700} className={classes.inner}>
          <h1 className={classes.title}>
            <Text
              component="a"
              href="https://jesunmaailma.ml"
              variant="gradient"
              gradient={{ from: "#18c082", to: "#1472d0", deg: 65.61 }}
              inherit
            >
              Linkin Short
            </Text>
          </h1>
          <div
            className={classes.controls}
            style={{ display: "flex", alignItems: "center" }}
          >
            <TextInput
              value={text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              styles={(theme) => ({
                input: {
                  borderRadius: "3rem"
                },
                wrapper: {
                  color: "white"
                }
              })}
              style={{ marginRight: 8, flex: 1 }}
              placeholder="Osoite"
              size="md"
              icon={<Link1Icon />}
            />
            <Tooltip
              classNames={{ tooltip: classes.notification }}
              opened={opened}
              label="Kopioitu!"
            >
              <Button
                styles={(theme) => ({
                  root: {
                    backgroundColor: "#23bde7",
                    fontFamily: poppins.style.fontFamily,
                    fontSize: 16,
                    fontWeight: 500,
                    border: 0,
                    paddingLeft: 20,
                    paddingRight: 20,
                    borderRadius: "3rem",
                    "&:hover": {
                      backgroundColor: theme.fn.darken("#23bde7", 0.05),
                    },
                  },
                })}
                size="md"
                onClick={showCopy ? handleCopyToClipboard : handleClick}
              >
                {showCopy ? "Kopioi" : "Lyhennä linkki"}
              </Button>
            </Tooltip>
          </div>
          <Button
            styles={(theme) => ({
              root: {
                backgroundColor: "#23bde7",
                fontFamily: poppins.style.fontFamily,
                fontSize: 16,
                fontWeight: 500,
                border: 0,
                marginTop: 16,
                marginBottom: 16,
                paddingLeft: 20,
                borderRadius: "3rem",
                paddingRight: 20,
                width: "100%",
                "&:hover": {
                  backgroundColor: theme.fn.darken("#23bde7", 0.05),
                },
              },
            })}
            size="md"
            onClick={() => window.location.reload()}
          >
            Lataa sivu uudelleen
          </Button>
          <Table align="center" bg="dark" className={classes.table} mt={32}>
            {loading ? (
              <>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    marginTop: "16px",
                  }}
                >
                  <Ring speed={2.4} size={48} color="white" />
                  <p className={classes.subtitle2}>Ladataan...</p>
                </div>
              </>
            ) : (
              <>
                <thead className={classes.subtitle}>
                  <td>Pitkä osoite</td>
                  <td>Lyhyt osoite</td>
                  <td>Klikkauksia</td>
                </thead>
                {links.map((link) => (
                  <tbody style={{ padding: 16 }} className={classes.subtitle2}>
                    <tr>
                      <td>{link.long}</td>
                      <td>
                        <a
                          target="_blank"
                          href={`${process.env.NEXT_PUBLIC_FRONTEND_URL}/${link.short}`}
                        >
                          {link.short}
                        </a>
                      </td>
                      <td>{link.clicks}</td>
                    </tr>
                  </tbody>
                ))}
              </>
            )}
          </Table>
        </Container>
      </MantineProvider>
    </>
  )
}

export default Home
