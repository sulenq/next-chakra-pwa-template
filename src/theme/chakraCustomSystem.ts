import { SM_SCREEN_W_NUMBER } from "@/shared/constants/styles";
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  conditions: {
    hover: "&:is(:hover, [data-hover]):not(:disabled, [data-disabled])",
  },
  globalCss: {
    "html, body": {
      bg: "bg.body",
    },
    "div, span, section, article, li, ul, ol, a, label, strong, em": {
      fontSize: "md",
    },
  },
  theme: {
    recipes: {
      button: {
        variants: {
          variant: {
            frosted: {
              bg: "bg.frosted",
              color: "fg",
              _hover: {
                bg: "bg.muted",
              },
            },
          },
        },
      },
    },
    breakpoints: {
      sm: "320px",
      md: `${SM_SCREEN_W_NUMBER}px`,
      lg: "960px",
      xl: "1200px",
    },

    tokens: {
      fonts: {
        heading: { value: "Plus Jakarta Sans, sans-serif" },
        body: { value: "Plus Jakarta Sans, sans-serif" },
        number: { value: "Plus Jakarta Sans, sans-serif" },
      },
      fontSizes: {
        xs: { value: "0.625rem" }, // 10px
        sm: { value: "0.75rem" }, // 12px
        md: { value: "0.875rem" }, // 14px
        lg: { value: "1rem" }, // 16px
      },
      colors: {
        light: { value: "#fcfcfc" },
        dark: { value: "#151515" },
        darktrans: { value: "#202020cf" },

        d0: { value: "#8a909614" },
        d1: { value: "#8a90961a" },
        d2: { value: "#8a90962b" },
        d3: { value: "#8a90963c" },
        d4: { value: "#8a90964d" },
        dt: { value: "#7a8086ff" },

        placeholder: { value: "#96969691" },

        neutral: {
          50: { value: "#fdfdfd" },
          100: { value: "#f0f0f2" },
          200: { value: "#e8eaee" },
          300: { value: "#d8dadd" },
          400: { value: "#b3b5b8" },
          500: { value: "#8a8a8a" },
          600: { value: "#6a6a6a" },
          700: { value: "#4f4f4f" },
          800: { value: "#303132" },
          900: { value: "#181819" },
          950: { value: "#121213" },
        },

        gray: {
          50: { value: "#f6f7f8" },
          100: { value: "#f0f2f3" },
          200: { value: "#e6e9eb" },
          300: { value: "#d3d8db" },
          400: { value: "#a5adb3" },
          500: { value: "#717171" },
          600: { value: "#525252" },
          700: { value: "#3f3f3f" },
          800: { value: "#272727" },
          900: { value: "#242424" },
          950: { value: "#1d1d1d" },
        },

        cream: {
          50: { value: "#f7f3ef" },
          100: { value: "#F7F1E4" },
          200: { value: "#EFE5CE" },
          300: { value: "#E7D9B8" },
          400: { value: "#DFCCA2" },
          500: { value: "#d0bb90" },
          600: { value: "#ad9a76" },
          700: { value: "#887655" },
          800: { value: "#5c4f3a" },
          900: { value: "#3a3124" },
          950: { value: "#262017" },
        },

        caramel: {
          50: { value: "#FBF3EA" },
          100: { value: "#F4E0C9" },
          200: { value: "#E8C7A0" },
          300: { value: "#DCAE78" },
          400: { value: "#D0944F" },
          500: { value: "#bb7a36" },
          600: { value: "#a36933" },
          700: { value: "#8a582d" },
          800: { value: "#524033" },
          900: { value: "#3d2d24" },
          950: { value: "#29211c" },
        },

        mocha: {
          50: { value: "#F5EDE9" },
          100: { value: "#EAD7CF" },
          200: { value: "#D7B8A9" },
          300: { value: "#C49A84" },
          400: { value: "#B27B5E" },
          500: { value: "#996043" },
          600: { value: "#85523D" },
          700: { value: "#6E4434" },
          800: { value: "#3f302b" },
          900: { value: "#3d2c27" },
          950: { value: "#26201d" },
        },

        brown: {
          50: { value: "#EFEBE9" },
          100: { value: "#D7CCC8" },
          200: { value: "#BCAAA4" },
          300: { value: "#A1887F" },
          400: { value: "#8D6E63" },
          500: { value: "#795548" },
          600: { value: "#6b4f45" },
          700: { value: "#5a433b" },
          800: { value: "#413533" },
          900: { value: "#37302c" },
          950: { value: "#2a2523" },
        },

        maroon: {
          50: { value: "#FAEBEB" },
          100: { value: "#F2C8C8" },
          200: { value: "#E69E9E" },
          300: { value: "#D97373" },
          400: { value: "#C94C4C" },
          500: { value: "#8f2e35" },
          600: { value: "#75262c" },
          700: { value: "#5c1f23" },
          800: { value: "#522f30" },
          900: { value: "#3c2122" },
          950: { value: "#301c1d" },
        },

        red: {
          50: { value: "#fbeded" },
          100: { value: "#fee2e2" },
          200: { value: "#fecaca" },
          300: { value: "#fca5a5" },
          400: { value: "#f87171" },
          500: { value: "#d45252" },
          600: { value: "#b94747" },
          700: { value: "#963c3c" },
          800: { value: "#4c2c2c" },
          900: { value: "#3e2424" },
          950: { value: "#2b1c1c" },
        },

        salmon: {
          50: { value: "#fceee7" },
          100: { value: "#FFE0DA" },
          200: { value: "#FFC1B3" },
          300: { value: "#FFA18D" },
          400: { value: "#FF8267" },
          500: { value: "#d97463" },
          600: { value: "#bf6658" },
          700: { value: "#9e564c" },
          800: { value: "#5f4440" },
          900: { value: "#47312f" },
          950: { value: "#322524" },
        },

        pastelOrange: {
          50: { value: "#ffeee4" },
          100: { value: "#f5dfd8" },
          200: { value: "#FFD4C1" },
          300: { value: "#FFBDA1" },
          400: { value: "#FFA581" },
          500: { value: "#FF8E62" },
          600: { value: "#E67C4F" },
          700: { value: "#B3623F" },
          800: { value: "#674739" },
          900: { value: "#4e3326" },
          950: { value: "#38271f" },
        },

        orange: {
          50: { value: "#fff7ed" },
          100: { value: "#ffedd5" },
          200: { value: "#fed7aa" },
          300: { value: "#fdba74" },
          400: { value: "#fb923c" },
          500: { value: "#f97316" },
          600: { value: "#d86a2c" },
          700: { value: "#b35a2a" },
          800: { value: "#693e28" },
          900: { value: "#4d302a" },
          950: { value: "#34211f" },
        },

        gold: {
          50: { value: "#fff9e6" },
          100: { value: "#ffefbf" },
          200: { value: "#ffe08a" },
          300: { value: "#ffd24d" },
          400: { value: "#f5c33a" },
          500: { value: "#D1B000" },
          600: { value: "#b89a32" },
          700: { value: "#9c852c" },
          800: { value: "#615732" },
          900: { value: "#544c2f" },
          950: { value: "#3a3524" },
        },

        yellow: {
          50: { value: "#fffccd" },
          100: { value: "#fff7b8" },
          200: { value: "#eae1af" },
          300: { value: "#ffe14d" },
          400: { value: "#ffd633" },
          500: { value: "#ffcc00" },
          600: { value: "#d9b326" },
          700: { value: "#806b20" },
          800: { value: "#5d522a" },
          900: { value: "#474029" },
          950: { value: "#322e20" },
        },

        lime: {
          50: { value: "#f6fad0" },
          100: { value: "#e8ecb2" },
          200: { value: "#dde590" },
          300: { value: "#DCE775" },
          400: { value: "#D4E157" },
          500: { value: "#CDDC39" },
          600: { value: "#b8c84a" },
          700: { value: "#6e7535" },
          800: { value: "#40442c" },
          900: { value: "#3b3e2a" },
          950: { value: "#2e311f" },
        },

        olive: {
          50: { value: "#F2F4E7" },
          100: { value: "#DDE3C4" },
          200: { value: "#C7D29F" },
          300: { value: "#B1C17A" },
          400: { value: "#9CB055" },
          500: { value: "#879F30" },
          600: { value: "#758B2B" },
          700: { value: "#637726" },
          800: { value: "#404e1d" },
          900: { value: "#38431c" },
          950: { value: "#212a13" },
        },

        green: {
          50: { value: "#e4fbeb" },
          100: { value: "#c9f2d7" },
          200: { value: "#b2eec7" },
          300: { value: "#86efac" },
          400: { value: "#4ade80" },
          500: { value: "#22c55e" },
          600: { value: "#16a34a" },
          700: { value: "#116932" },
          800: { value: "#1a3b1c" },
          900: { value: "#1b331c" },
          950: { value: "#182415" },
        },

        jade: {
          50: { value: "#e2faee" },
          100: { value: "#c9eeda" },
          200: { value: "#aee2c6" },
          300: { value: "#6FDEA5" },
          400: { value: "#46D58D" },
          500: { value: "#2ECC71" },
          600: { value: "#26A75C" },
          700: { value: "#1E8449" },
          800: { value: "#173425" },
          900: { value: "#192e22" },
          950: { value: "#14221a" },
        },

        teal: {
          50: { value: "#daf7f0" },
          100: { value: "#baefe3" },
          200: { value: "#adf0e2" },
          300: { value: "#5eead4" },
          400: { value: "#2dd4bf" },
          500: { value: "#14b8a6" },
          600: { value: "#0d9488" },
          700: { value: "#0c5d56" },
          800: { value: "#203f3e" },
          900: { value: "#1c3736" },
          950: { value: "#142322" },
        },

        tealBlue: {
          50: { value: "#def9f6" },
          100: { value: "#c6ece7" },
          200: { value: "#bcede6" },
          300: { value: "#69D2CD" },
          400: { value: "#42BFC0" },
          500: { value: "#1FA8B1" },
          600: { value: "#188893" },
          700: { value: "#126B76" },
          800: { value: "#194347" },
          900: { value: "#163034" },
          950: { value: "#122223" },
        },

        cyan: {
          50: { value: "#ddf8f9" },
          100: { value: "#c1eff3" },
          200: { value: "#b6eaf1" },
          300: { value: "#67e8f9" },
          400: { value: "#22d3ee" },
          500: { value: "#06b6d4" },
          600: { value: "#0891b2" },
          700: { value: "#0c5c72" },
          800: { value: "#2a4a55" },
          900: { value: "#1a2f37" },
          950: { value: "#192328" },
        },

        powderBlue: {
          50: { value: "#e6f1fb" },
          100: { value: "#d8e8f6" },
          200: { value: "#c1def7" },
          300: { value: "#9ecaf0" },
          400: { value: "#7fb4e6" },
          500: { value: "#649fd9" },
          600: { value: "#4f86bf" },
          700: { value: "#3f6ba1" },
          800: { value: "#223249" },
          900: { value: "#202e3c" },
          950: { value: "#19222c" },
        },

        sky: {
          50: { value: "#e8f2fa" },
          100: { value: "#cfe7f7" },
          200: { value: "#c9e7f8" },
          300: { value: "#7DD3FC" },
          400: { value: "#38BDF8" },
          500: { value: "#0EA5E9" },
          600: { value: "#0284C7" },
          700: { value: "#0369A1" },
          800: { value: "#12384a" },
          900: { value: "#13313e" },
          950: { value: "#0d222b" },
        },

        blue: {
          50: { value: "#e8f2ff" },
          100: { value: "#d1e2f8" },
          200: { value: "#bfdbfe" },
          300: { value: "#a3cfff" },
          400: { value: "#60a5fa" },
          500: { value: "#3b82f6" },
          600: { value: "#2563eb" },
          700: { value: "#173da6" },
          800: { value: "#263a5b" },
          900: { value: "#24344d" },
          950: { value: "#1c283b" },
        },

        sapphire: {
          50: { value: "#e7effd" },
          100: { value: "#D5E2FF" },
          200: { value: "#b6c9fb" },
          300: { value: "#7B9BFF" },
          400: { value: "#4E75FF" },
          500: { value: "#1939B7" },
          600: { value: "#152F9B" },
          700: { value: "#10237B" },
          800: { value: "#242d53" },
          900: { value: "#202745" },
          950: { value: "#1a1f31" },
        },

        indigo: {
          50: { value: "#E8EAF6" },
          100: { value: "#C5CAE9" },
          200: { value: "#9FA8DA" },
          300: { value: "#8593d9" },
          400: { value: "#5C6BC0" },
          500: { value: "#3F51B5" },
          600: { value: "#3949AB" },
          700: { value: "#303F9F" },
          800: { value: "#242a4c" },
          900: { value: "#232948" },
          950: { value: "#1c2034" },
        },

        discord: {
          50: { value: "#eaecfd" },
          100: { value: "#D0D6FA" },
          200: { value: "#B3BCF7" },
          300: { value: "#96A3F4" },
          400: { value: "#7989F1" },
          500: { value: "#5865F2" },
          600: { value: "#4A55D2" },
          700: { value: "#3C46B2" },
          800: { value: "#313557" },
          900: { value: "#282c53" },
          950: { value: "#1d2036" },
        },

        powderLavender: {
          50: { value: "#F0F0FF" },
          100: { value: "#E2E1FF" },
          200: { value: "#CECDFF" },
          300: { value: "#BAB8FF" },
          400: { value: "#A6A3FF" },
          500: { value: "#8E8CD8" },
          600: { value: "#7A78C2" },
          700: { value: "#6361A3" },
          800: { value: "#353550" },
          900: { value: "#33334b" },
          950: { value: "#252535" },
        },

        lavender: {
          50: { value: "#ede5fd" },
          100: { value: "#e2d6fc" },
          200: { value: "#CBB3FF" },
          300: { value: "#AF8DFF" },
          400: { value: "#9567FF" },
          500: { value: "#7A42FF" },
          600: { value: "#6720E6" },
          700: { value: "#5314B3" },
          800: { value: "#312a43" },
          900: { value: "#332948" },
          950: { value: "#231d30" },
        },

        purple: {
          50: { value: "#faf5ff" },
          100: { value: "#f3e8ff" },
          200: { value: "#e9d5ff" },
          300: { value: "#d8b4fe" },
          400: { value: "#c084fc" },
          500: { value: "#a855f7" },
          600: { value: "#9333ea" },
          700: { value: "#641ba3" },
          800: { value: "#3e2953" },
          900: { value: "#3c294f" },
          950: { value: "#291e33" },
        },

        bubblegumPink: {
          50: { value: "#FFF0FA" },
          100: { value: "#FFD9F2" },
          200: { value: "#FFB6E4" },
          300: { value: "#FF92D7" },
          400: { value: "#FF6EC9" },
          500: { value: "#FF4ABB" },
          600: { value: "#E642A8" },
          700: { value: "#B33283" },
          800: { value: "#5b2e4a" },
          900: { value: "#4d273f" },
          950: { value: "#341f2c" },
        },

        pink: {
          50: { value: "#fdf2f8" },
          100: { value: "#fce7f3" },
          200: { value: "#fbcfe8" },
          300: { value: "#f9a8d4" },
          400: { value: "#f472b6" },
          500: { value: "#ec4899" },
          600: { value: "#db2777" },
          700: { value: "#a41752" },
          800: { value: "#682747" },
          900: { value: "#402431" },
          950: { value: "#2f1c25" },
        },
      },
    },
    semanticTokens: {
      colors: {
        text: { value: { base: "{colors.neutral.950}", _dark: "#ddd" } },

        ibody: {
          value: {
            base: "{colors.neutral.950}",
            _dark: "{colors.neutral.50}",
          },
        },

        item: {
          value: {
            base: "{colors.neutral.100}",
            _dark: "{colors.neutral.900}",
          },
        },

        bgContent: {
          value: {
            base: "{colors.neutral.200}",
            _dark: "{colors.neutral.950}",
          },
        },

        bg: {
          canvas: {
            value: {
              base: "#f0eff5",
              _dark: "#151515",
            },
          },
          bodySolid: {
            value: {
              base: "#faf9ffff",
              _dark: "#1c1c1c",
            },
          },
          body: {
            value: {
              base: "#faf9ffec",
              _dark: "rgba(27, 27, 27, 0.925)",
            },
          },
          frosted: {
            value: {
              base: "rgba(250, 249, 255, 0.5)",
              _dark: "rgba(27, 27, 27, 0.5)",
            },
          },
          subtle: {
            value: {
              base: "{colors.d0} !important",
              _dark: "{colors.d0} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.d1} !important",
              _dark: "{colors.d1} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.d2} !important",
              _dark: "{colors.d2} !important",
            },
          },
        },

        fg: {
          ibody: {
            value: {
              base: "{colors.neutral.900}",
              _dark: "{colors.neutral.50}",
            },
          },
        },

        border: {
          subtle: {
            value: {
              base: "{colors.d1} !important",
              _dark: "{colors.d1} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.d2} !important",
              _dark: "{colors.d2} !important",
            },
          },
        },

        light: {
          solid: {
            value: {
              base: "{colors.light}",
              _dark: "{colors.light}",
            },
          },
          contrast: {
            value: { base: "{colors.dark}", _dark: "{colors.dark}" },
          },
          fg: {
            value: {
              base: "{colors.light}",
              _dark: "{colors.light}",
            },
          },
          muted: {
            value: {
              base: "{colors.light}",
              _dark: "{colors.light}",
            },
          },
          subtle: {
            value: {
              base: "{colors.d2}",
              _dark: "{colors.d2}",
            },
          },
          emphasized: { value: "{colors.gray.700}" },
          focusRing: {
            value: {
              base: "{colors.light}",
              _dark: "{colors.light}",
            },
          },
        },

        gray: {
          subtle: {
            value: {
              base: "{colors.d1} !important",
              _dark: "{colors.d1} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.d2} !important",
              _dark: "{colors.d2} !important",
            },
          },
          emphasized: {
            value: {
              base: "{colors.gray.200}",
              _dark: "{colors.gray.800}",
            },
          },
        },

        cream: {
          solid: {
            value: {
              base: "{colors.cream.500}",
              _dark: "{colors.cream.700}",
            },
          },
          contrast: {
            value: {
              base: "{colors.cream.50}",
              _dark: "{colors.cream.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.cream.600}",
              _dark: "{colors.cream.200}",
            },
          },
          muted: {
            value: {
              base: "{colors.cream.100}",
              _dark: "{colors.cream.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.cream.50}",
              _dark: "{colors.cream.950}",
            },
          },
          emphasized: { value: "{colors.cream.800}" },
          focusRing: {
            value: {
              base: "{colors.cream.500}",
              _dark: "{colors.cream.700}",
            },
          },
          border: {
            value: {
              base: "{colors.cream.200}",
              _dark: "{colors.cream.800}",
            },
          },
        },

        caramel: {
          solid: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.700}",
            },
          },
          contrast: {
            value: {
              base: "{colors.caramel.50}",
              _dark: "{colors.caramel.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.200}",
            },
          },
          muted: {
            value: {
              base: "{colors.caramel.100}",
              _dark: "{colors.caramel.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.caramel.50}",
              _dark: "{colors.caramel.950}",
            },
          },
          emphasized: { value: "{colors.caramel.800}" },
          focusRing: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.700}",
            },
          },
          border: {
            value: {
              base: "{colors.caramel.200}",
              _dark: "{colors.caramel.800}",
            },
          },
        },

        mocha: {
          solid: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.700}",
            },
          },
          contrast: {
            value: { base: "{colors.mocha.50}", _dark: "{colors.mocha.100}" },
          },
          fg: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.200}",
            },
          },
          muted: {
            value: {
              base: "{colors.mocha.100}",
              _dark: "{colors.mocha.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.mocha.50}",
              _dark: "{colors.mocha.950}",
            },
          },
          emphasized: { value: "{colors.mocha.800}" },
          focusRing: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.700}",
            },
          },
          border: {
            value: {
              base: "{colors.mocha.200}",
              _dark: "{colors.mocha.800}",
            },
          },
        },

        brown: {
          solid: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.700}",
            },
          },
          contrast: {
            value: { base: "{colors.brown.50}", _dark: "{colors.brown.100}" },
          },
          fg: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.200}",
            },
          },
          muted: {
            value: {
              base: "{colors.brown.100}",
              _dark: "{colors.brown.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.brown.50}",
              _dark: "{colors.brown.950}",
            },
          },
          emphasized: { value: "{colors.brown.800}" },
          focusRing: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.700}",
            },
          },
          border: {
            value: {
              base: "{colors.brown.200}",
              _dark: "{colors.brown.800}",
            },
          },
        },

        maroon: {
          solid: {
            value: {
              base: "{colors.maroon.500}",
              _dark: "{colors.maroon.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.maroon.50}",
              _dark: "{colors.maroon.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.maroon.500}",
              _dark: "{colors.maroon.200}",
            },
          },
          muted: {
            value: {
              base: "{colors.maroon.100}",
              _dark: "{colors.maroon.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.maroon.50}",
              _dark: "{colors.maroon.950}",
            },
          },
          emphasized: { value: "{colors.maroon.800}" },
          focusRing: {
            value: {
              base: "{colors.maroon.500}",
              _dark: "{colors.maroon.700}",
            },
          },
          border: {
            value: {
              base: "{colors.maroon.200}",
              _dark: "{colors.maroon.800}",
            },
          },
        },

        red: {
          solid: {
            value: {
              base: "{colors.red.500}",
              _dark: "{colors.red.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.red.50}",
              _dark: "{colors.red.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.red.500}",
              _dark: "{colors.red.200}",
            },
          },
          muted: {
            value: {
              base: "{colors.red.100} !important",
              _dark: "{colors.red.900} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.red.50} !important",
              _dark: "{colors.red.950} !important",
            },
          },
          emphasized: { value: "{colors.red.800}" },
          focusRing: {
            value: {
              base: "{colors.red.500}",
              _dark: "{colors.red.700}",
            },
          },
          border: {
            value: {
              base: "{colors.red.200} !important",
              _dark: "{colors.red.800} !important",
            },
          },
        },

        salmon: {
          solid: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.700}",
            },
          },
          contrast: {
            value: {
              base: "{colors.salmon.50}",
              _dark: "{colors.salmon.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.200}",
            },
          },
          muted: {
            value: {
              base: "{colors.salmon.100}",
              _dark: "{colors.salmon.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.salmon.50}",
              _dark: "{colors.salmon.950}",
            },
          },
          emphasized: { value: "{colors.salmon.800}" },
          focusRing: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.700}",
            },
          },
          border: {
            value: {
              base: "{colors.salmon.200}",
              _dark: "{colors.salmon.800}",
            },
          },
        },

        pastelOrange: {
          solid: {
            value: {
              base: "{colors.pastelOrange.500}",
              _dark: "{colors.pastelOrange.700}",
            },
          },
          contrast: {
            value: {
              base: "{colors.pastelOrange.50}",
              _dark: "{colors.pastelOrange.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.pastelOrange.500}",
              _dark: "{colors.pastelOrange.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.pastelOrange.100}",
              _dark: "{colors.pastelOrange.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.pastelOrange.50}",
              _dark: "{colors.pastelOrange.950}",
            },
          },
          emphasized: { value: "{colors.pastelOrange.800}" },
          focusRing: {
            value: {
              base: "{colors.pastelOrange.500}",
              _dark: "{colors.pastelOrange.700}",
            },
          },
          border: {
            value: {
              base: "{colors.pastelOrange.200}",
              _dark: "{colors.pastelOrange.800}",
            },
          },
        },

        orange: {
          solid: {
            value: {
              base: "{colors.orange.500}",
              _dark: "{colors.orange.700}",
            },
          },
          contrast: {
            value: {
              base: "{colors.orange.50}",
              _dark: "{colors.orange.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.orange.500}",
              _dark: "{colors.orange.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.orange.100}",
              _dark: "{colors.orange.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.orange.50}",
              _dark: "{colors.orange.950}",
            },
          },
          emphasized: { value: "{colors.orange.800}" },
          focusRing: {
            value: {
              base: "{colors.orange.500}",
              _dark: "{colors.orange.700}",
            },
          },
          border: {
            value: {
              base: "{colors.orange.200} !important",
              _dark: "{colors.orange.800} !important",
            },
          },
        },

        gold: {
          solid: {
            value: {
              base: "{colors.gold.500}",
              _dark: "{colors.gold.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.gold.50}",
              _dark: "{colors.gold.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.gold.500}",
              _dark: "{colors.gold.500}",
            },
          },
          muted: {
            value: {
              base: "{colors.gold.100}",
              _dark: "{colors.gold.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.gold.50}",
              _dark: "{colors.gold.950}",
            },
          },
          emphasized: { value: "{colors.gold.800}" },
          focusRing: {
            value: {
              base: "{colors.gold.500}",
              _dark: "{colors.gold.700}",
            },
          },
          border: {
            value: {
              base: "{colors.gold.200} !important",
              _dark: "{colors.gold.800} !important",
            },
          },
        },

        yellow: {
          solid: {
            value: {
              base: "{colors.yellow.500}",
              _dark: "{colors.yellow.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.yellow.900} !important",
              _dark: "{colors.yellow.950} !important",
            },
          },
          fg: {
            value: {
              base: "{colors.yellow.700} !important",
              _dark: "{colors.yellow.300} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.yellow.100} !important",
              _dark: "{colors.yellow.900} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.yellow.50} !important",
              _dark: "{colors.yellow.950} !important",
            },
          },
          emphasized: { value: "{colors.yellow.800}" },
          focusRing: {
            value: {
              base: "{colors.yellow.500}",
              _dark: "{colors.yellow.700}",
            },
          },
          border: {
            value: {
              base: "{colors.yellow.200} !important",
              _dark: "{colors.yellow.800} !important",
            },
          },
        },

        lime: {
          solid: {
            value: {
              base: "{colors.lime.500}",
              _dark: "{colors.lime.600}",
            },
          },
          contrast: {
            value: {
              base: "{colors.lime.800}",
              _dark: "{colors.lime.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.lime.700}",
              _dark: "{colors.lime.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.lime.100}",
              _dark: "{colors.lime.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.lime.50}",
              _dark: "{colors.lime.950}",
            },
          },
          emphasized: { value: "{colors.lime.800}" },
          focusRing: {
            value: {
              base: "{colors.lime.500}",
              _dark: "{colors.lime.700}",
            },
          },
          border: {
            value: {
              base: "{colors.lime.200}",
              _dark: "{colors.lime.800}",
            },
          },
        },

        olive: {
          solid: {
            value: {
              base: "{colors.olive.500}",
              _dark: "{colors.olive.600}",
            },
          },
          contrast: {
            value: {
              base: "{colors.olive.50}",
              _dark: "{colors.olive.50}",
            },
          },
          fg: {
            value: {
              base: "{colors.olive.700}",
              _dark: "{colors.olive.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.olive.100}",
              _dark: "{colors.olive.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.olive.50}",
              _dark: "{colors.olive.950}",
            },
          },
          emphasized: { value: "{colors.olive.800}" },
          focusRing: {
            value: {
              base: "{colors.olive.500}",
              _dark: "{colors.olive.700}",
            },
          },
          border: {
            value: {
              base: "{colors.olive.200}",
              _dark: "{colors.olive.800}",
            },
          },
        },

        green: {
          solid: {
            value: {
              base: "{colors.green.500}",
              _dark: "{colors.green.600}",
            },
          },
          contrast: {
            value: {
              base: "{colors.green.50}",
              _dark: "{colors.green.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.green.600} !important",
              _dark: "{colors.green.300} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.green.100} !important",
              _dark: "{colors.green.900} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.green.50} !important",
              _dark: "{colors.green.950} !important",
            },
          },
          emphasized: { value: "{colors.green.800}" },
          focusRing: {
            value: {
              base: "{colors.green.500}",
              _dark: "{colors.green.500}",
            },
          },
          border: {
            value: {
              base: "{colors.green.200} !important",
              _dark: "{colors.green.800} !important",
            },
          },
        },

        jade: {
          solid: {
            value: {
              base: "{colors.jade.500}",
              _dark: "{colors.jade.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.jade.950}",
              _dark: "{colors.jade.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.jade.600}",
              _dark: "{colors.jade.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.jade.100}",
              _dark: "{colors.jade.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.jade.50}",
              _dark: "{colors.jade.950}",
            },
          },
          emphasized: { value: "{colors.jade.800}" },
          focusRing: {
            value: {
              base: "{colors.jade.500}",
              _dark: "{colors.jade.500}",
            },
          },
          border: {
            value: {
              base: "{colors.jade.200}",
              _dark: "{colors.jade.800}",
            },
          },
        },

        teal: {
          solid: {
            value: {
              base: "{colors.teal.500} !important",
              _dark: "{colors.teal.500} !important",
            },
          },
          contrast: {
            value: {
              base: "{colors.teal.50}",
              _dark: "{colors.teal.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.teal.600} !important",
              _dark: "{colors.teal.300} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.teal.100} !important",
              _dark: "{colors.teal.900} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.teal.50} !important",
              _dark: "{colors.teal.950} !important",
            },
          },
          emphasized: { value: "{colors.teal.800}" },
          focusRing: {
            value: {
              base: "{colors.teal.500}",
              _dark: "{colors.teal.500}",
            },
          },
          border: {
            value: {
              base: "{colors.teal.200} !important",
              _dark: "{colors.teal.800} !important",
            },
          },
        },

        tealBlue: {
          solid: {
            value: {
              base: "{colors.tealBlue.500}",
              _dark: "{colors.tealBlue.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.tealBlue.50}",
              _dark: "{colors.tealBlue.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.tealBlue.600}",
              _dark: "{colors.tealBlue.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.tealBlue.100}",
              _dark: "{colors.tealBlue.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.tealBlue.50}",
              _dark: "{colors.tealBlue.950}",
            },
          },
          emphasized: { value: "{colors.tealBlue.800}" },
          focusRing: {
            value: {
              base: "{colors.tealBlue.500}",
              _dark: "{colors.tealBlue.500}",
            },
          },
          border: {
            value: {
              base: "{colors.tealBlue.200}",
              _dark: "{colors.tealBlue.800}",
            },
          },
        },

        cyan: {
          solid: {
            value: {
              base: "{colors.cyan.500} !important",
              _dark: "{colors.cyan.500} !important",
            },
          },
          contrast: {
            value: {
              base: "{colors.cyan.50}",
              _dark: "{colors.cyan.950}",
            },
          },
          fg: {
            value: {
              base: "{colors.cyan.600} !important",
              _dark: "{colors.cyan.300} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.cyan.100} !important",
              _dark: "{colors.cyan.900} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.cyan.50} !important",
              _dark: "{colors.cyan.950} !important",
            },
          },
          emphasized: { value: "{colors.cyan.800}" },
          focusRing: {
            value: {
              base: "{colors.cyan.500}",
              _dark: "{colors.cyan.500}",
            },
          },
          border: {
            value: {
              base: "{colors.cyan.200} !important",
              _dark: "{colors.cyan.800} !important",
            },
          },
        },

        powderBlue: {
          solid: {
            value: {
              base: "{colors.powderBlue.500}",
              _dark: "{colors.powderBlue.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.powderBlue.50}",
              _dark: "{colors.powderBlue.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.powderBlue.500}",
              _dark: "{colors.powderBlue.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.powderBlue.100}",
              _dark: "{colors.powderBlue.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.powderBlue.50}",
              _dark: "{colors.powderBlue.950}",
            },
          },
          emphasized: { value: "{colors.powderBlue.400}" },
          focusRing: {
            value: {
              base: "{colors.powderBlue.500}",
              _dark: "{colors.powderBlue.700}",
            },
          },
          border: {
            value: {
              base: "{colors.powderBlue.200}",
              _dark: "{colors.powderBlue.800}",
            },
          },
        },

        sky: {
          solid: {
            value: {
              base: "{colors.sky.500}",
              _dark: "{colors.sky.500}",
            },
          },
          contrast: {
            value: { base: "{colors.sky.50}", _dark: "{colors.sky.900}" },
          },
          fg: {
            value: {
              base: "{colors.sky.500}",
              _dark: "{colors.sky.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.sky.100}",
              _dark: "{colors.sky.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.sky.50}",
              _dark: "{colors.sky.950}",
            },
          },
          emphasized: { value: "{colors.sky.400}" },
          focusRing: {
            value: {
              base: "{colors.sky.500}",
              _dark: "{colors.sky.700}",
            },
          },
          border: {
            value: {
              base: "{colors.sky.200}",
              _dark: "{colors.sky.800}",
            },
          },
        },

        blue: {
          solid: {
            value: {
              base: "{colors.blue.500}",
              _dark: "{colors.blue.600}",
            },
          },
          contrast: {
            value: { base: "{colors.blue.50}", _dark: "{colors.blue.100}" },
          },
          fg: {
            value: {
              base: "{colors.blue.500} !important",
              _dark: "{colors.blue.400} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.blue.100} !important",
              _dark: "{colors.blue.900} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.blue.50} !important",
              _dark: "{colors.blue.950} !important",
            },
          },
          emphasized: { value: "{colors.blue.400}" },
          focusRing: {
            value: {
              base: "{colors.blue.500}",
              _dark: "{colors.blue.500}",
            },
          },
          border: {
            value: {
              base: "{colors.blue.200} !important",
              _dark: "{colors.blue.800} !important",
            },
          },
        },

        sapphire: {
          solid: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.600}",
            },
          },
          contrast: {
            value: {
              base: "{colors.sapphire.100}",
              _dark: "{colors.sapphire.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.sapphire.100}",
              _dark: "{colors.sapphire.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.sapphire.50}",
              _dark: "{colors.sapphire.950}",
            },
          },
          emphasized: { value: "{colors.sapphire.400}" },
          focusRing: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.700}",
            },
          },
          border: {
            value: {
              base: "{colors.sapphire.200}",
              _dark: "{colors.sapphire.800}",
            },
          },
        },

        indigo: {
          solid: {
            value: {
              base: "{colors.indigo.500}",
              _dark: "{colors.indigo.500}",
            },
          },
          contrast: {
            value: { base: "{colors.indigo.50}", _dark: "{colors.indigo.50}" },
          },
          fg: {
            value: {
              base: "{colors.indigo.500}",
              _dark: "{colors.indigo.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.indigo.100}",
              _dark: "{colors.indigo.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.indigo.50}",
              _dark: "{colors.indigo.950}",
            },
          },
          emphasized: { value: "{colors.indigo.400}" },
          focusRing: {
            value: {
              base: "{colors.indigo.500}",
              _dark: "{colors.indigo.700}",
            },
          },
          border: {
            value: {
              base: "{colors.indigo.200}",
              _dark: "{colors.indigo.800}",
            },
          },
        },

        discord: {
          solid: {
            value: {
              base: "{colors.discord.500}",
              _dark: "{colors.discord.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.discord.50}",
              _dark: "{colors.discord.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.discord.500}",
              _dark: "{colors.discord.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.discord.100}",
              _dark: "{colors.discord.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.discord.50}",
              _dark: "{colors.discord.950}",
            },
          },
          emphasized: { value: "{colors.discord.400}" },
          focusRing: {
            value: {
              base: "{colors.discord.500}",
              _dark: "{colors.discord.700}",
            },
          },
          border: {
            value: {
              base: "{colors.discord.200}",
              _dark: "{colors.discord.800}",
            },
          },
        },

        powderLavender: {
          solid: {
            value: {
              base: "{colors.powderLavender.500}",
              _dark: "{colors.powderLavender.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.powderLavender.50}",
              _dark: "{colors.powderLavender.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.powderLavender.600}",
              _dark: "{colors.powderLavender.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.powderLavender.100}",
              _dark: "{colors.powderLavender.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.powderLavender.50}",
              _dark: "{colors.powderLavender.950}",
            },
          },
          emphasized: { value: "{colors.powderLavender.400}" },
          focusRing: {
            value: {
              base: "{colors.powderLavender.500}",
              _dark: "{colors.powderLavender.700}",
            },
          },
          border: {
            value: {
              base: "{colors.powderLavender.200}",
              _dark: "{colors.powderLavender.800}",
            },
          },
        },

        lavender: {
          solid: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.600}",
            },
          },
          contrast: {
            value: {
              base: "{colors.lavender.50}",
              _dark: "{colors.lavender.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.lavender.100}",
              _dark: "{colors.lavender.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.lavender.50}",
              _dark: "{colors.lavender.950}",
            },
          },
          emphasized: { value: "{colors.lavender.400}" },
          focusRing: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.700}",
            },
          },
          border: {
            value: {
              base: "{colors.lavender.200}",
              _dark: "{colors.lavender.800}",
            },
          },
        },

        purple: {
          solid: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.600}",
            },
          },
          contrast: {
            value: { base: "{colors.purple.50}", _dark: "{colors.purple.100}" },
          },
          fg: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.purple.100}",
              _dark: "{colors.purple.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.purple.50}",
              _dark: "{colors.purple.950}",
            },
          },
          emphasized: { value: "{colors.purple.400}" },
          focusRing: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.700}",
            },
          },
          border: {
            value: {
              base: "{colors.purple.200}",
              _dark: "{colors.purple.800}",
            },
          },
        },

        bubblegumPink: {
          solid: {
            value: {
              base: "{colors.bubblegumPink.500}",
              _dark: "{colors.bubblegumPink.600}",
            },
          },
          contrast: {
            value: {
              base: "{colors.bubblegumPink.50}",
              _dark: "{colors.bubblegumPink.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.bubblegumPink.500}",
              _dark: "{colors.bubblegumPink.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.bubblegumPink.100}",
              _dark: "{colors.bubblegumPink.900}",
            },
          },
          subtle: {
            value: {
              base: "{colors.bubblegumPink.50}",
              _dark: "{colors.bubblegumPink.950}",
            },
          },
          emphasized: { value: "{colors.bubblegumPink.400}" },
          focusRing: {
            value: {
              base: "{colors.bubblegumPink.500}",
              _dark: "{colors.bubblegumPink.700}",
            },
          },
          border: {
            value: {
              base: "{colors.bubblegumPink.200}",
              _dark: "{colors.bubblegumPink.800}",
            },
          },
        },

        pink: {
          solid: {
            value: {
              base: "{colors.pink.500}",
              _dark: "{colors.pink.600}",
            },
          },
          contrast: {
            value: { base: "{colors.pink.50}", _dark: "{colors.pink.100}" },
          },
          fg: {
            value: {
              base: "{colors.pink.500} !important",
              _dark: "{colors.pink.400} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.pink.100} !important",
              _dark: "{colors.pink.900} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.pink.50}",
              _dark: "{colors.pink.950}",
            },
          },
          emphasized: { value: "{colors.pink.400}" },
          focusRing: {
            value: {
              base: "{colors.pink.500}",
              _dark: "{colors.pink.700}",
            },
          },
          border: {
            value: {
              base: "{colors.pink.200} !important",
              _dark: "{colors.pink.800} !important",
            },
          },
        },
      },
      shadows: {
        soft: {
          value: {
            base: "0 4px 8px rgba(0,0,0,0.03), 0 1px 2px rgba(0,0,0,0.02) !important",
            _dark:
              "0 4px 8px rgba(0,0,0,0.20), 0 1px 2px rgba(0,0,0,0.16) !important",
          },
        },
      },
    },
  },
});

const chakraCustomSystem = createSystem(defaultConfig, customConfig);

export default chakraCustomSystem;
