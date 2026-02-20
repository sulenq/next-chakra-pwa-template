import { SM_SCREEN_W_NUMBER } from "@/constants/styles";
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const customConfig = defineConfig({
  conditions: {
    hover: "&:is(:hover, [data-hover]):not(:disabled, [data-disabled])",
  },
  globalCss: {
    "html, body": {
      bg: "body",
    },
    "div, span, section, article, li, ul, ol, a, label, strong, em": {
      fontSize: "md",
    },
  },
  theme: {
    breakpoints: {
      sm: "320px",
      md: `${SM_SCREEN_W_NUMBER}px`,
      lg: "960px",
      xl: "1200px",
    },
    tokens: {
      colors: {
        light: { value: "#fff" },
        dark: { value: "#161616" },
        darktrans: { value: "#202020cf" },
        d0: { value: "#8a8a8a0f" },
        d1: { value: "#8a8a8a15" },
        d2: { value: "#8a8a8a25" },
        d3: { value: "#8a8a8a35" },
        d4: { value: "#8a8a8a45" },
        dt: { value: "#858585ff" },
        placeholder: { value: "#96969691" },
        p: {
          50: { value: "#E6FAFC" },
          100: { value: "#C2F1F5" },
          200: { value: "#8DE6EC" },
          300: { value: "#57DBE3" },
          400: { value: "#2FD4DD" },
          500: { value: "#21D3E0" },
          "500a": { value: "#21D3E020" },
          600: { value: "#1AA8B2" },
          700: { value: "#137D85" },
          800: { value: "#0B5258" },
          900: { value: "#04272B" },
        },
        s: {
          50: { value: "#eff2f6" },
          100: { value: "#dde4eb" },
          200: { value: "#bcccd9" },
          300: { value: "#93acc2" },
          400: { value: "#6085a6" },
          500: { value: "#001f3f" },
          "500a": { value: "#001f3f20" },
          600: { value: "#001a36" },
          700: { value: "#00152b" },
          800: { value: "#001021" },
          900: { value: "#000a14" },
        },
        gray: {
          // 100: { value: "red !important" },
          200: { value: "#ebebec" },
          800: { value: "#222" },
          900: { value: "#202020" },
        },
        salmon: {
          50: { value: "#FFF5F0" },
          100: { value: "#FFE0DA" },
          200: { value: "#FFC1B3" },
          300: { value: "#FFA18D" },
          400: { value: "#FF8267" },
          500: { value: "#FF6242" },
          600: { value: "#E64F2A" },
          700: { value: "#B33F20" },
          800: { value: "#802F16" },
          900: { value: "#4D1F0D" },
        },
        pastelSalmon: {
          50: { value: "#FFF8F5" },
          100: { value: "#FFECE6" },
          200: { value: "#FFD4C1" },
          300: { value: "#FFBDA1" },
          400: { value: "#FFA581" },
          500: { value: "#FF8E62" },
          600: { value: "#E67C4F" },
          700: { value: "#B3623F" },
          800: { value: "#80482F" },
          900: { value: "#4D2E1F" },
        },
        yellow: {
          50: { value: "#fffdea" },
          100: { value: "#fff6b3" },
          200: { value: "#ffeb80" },
          300: { value: "#ffe14d" },
          400: { value: "#ffd633" },
          500: { value: "#ffcc00" },
          600: { value: "#e6b800" },
          700: { value: "#cc9f00" },
          800: { value: "#997700" },
          900: { value: "#665000" },
        },
        lime: {
          50: { value: "#F9FBE7" },
          100: { value: "#F0F4C3" },
          200: { value: "#E6EE9C" },
          300: { value: "#DCE775" },
          400: { value: "#D4E157" },
          500: { value: "#CDDC39" },
          600: { value: "#C0CA33" },
          700: { value: "#AFB42B" },
          800: { value: "#9E9D24" },
          900: { value: "#827717" },
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
          800: { value: "#506321" },
          900: { value: "#3D4F1C" },
        },
        jade: {
          50: { value: "#E8FAF1" },
          100: { value: "#C9F1DB" },
          200: { value: "#9DE9C2" },
          300: { value: "#6FDEA5" },
          400: { value: "#46D58D" },
          500: { value: "#2ECC71" },
          "500a": { value: "#2ECC7120" },
          600: { value: "#26A75C" },
          700: { value: "#1E8449" },
          800: { value: "#166037" },
          900: { value: "#0F3E23" },
          1000: { value: "#092214" },
          1100: { value: "#041009" },
        },
        tealBlue: {
          50: { value: "#E6FBFD" },
          100: { value: "#C2F3F8" },
          200: { value: "#96E8F1" },
          300: { value: "#63DAE8" },
          400: { value: "#21D3E0" },
          500: { value: "#1AB0BC" },
          600: { value: "#148E97" },
          700: { value: "#0F6E74" },
          800: { value: "#0A4F52" },
          900: { value: "#06383A" },
        },
        powderBlue: {
          50: { value: "#f0f8ff" },
          100: { value: "#dceefc" },
          200: { value: "#c1def7" },
          300: { value: "#9ecaf0" },
          400: { value: "#7fb4e6" },
          500: { value: "#649fd9" },
          600: { value: "#4f86bf" },
          700: { value: "#3f6ba1" },
          800: { value: "#325382" },
          900: { value: "#223758" },
        },
        sky: {
          50: { value: "#F0F9FF" },
          100: { value: "#E0F2FE" },
          200: { value: "#BAE6FD" },
          300: { value: "#7DD3FC" },
          400: { value: "#38BDF8" },
          500: { value: "#0EA5E9" },
          600: { value: "#0284C7" },
          700: { value: "#0369A1" },
          800: { value: "#075985" },
          900: { value: "#083654" },
        },
        indigo: {
          50: { value: "#E8EAF6" },
          100: { value: "#C5CAE9" },
          200: { value: "#9FA8DA" },
          300: { value: "#7986CB" },
          400: { value: "#5C6BC0" },
          500: { value: "#3F51B5" },
          600: { value: "#3949AB" },
          700: { value: "#303F9F" },
          800: { value: "#283593" },
          900: { value: "#141A63" },
        },
        discord: {
          50: { value: "#EDEFFD" },
          100: { value: "#D0D6FA" },
          200: { value: "#B3BCF7" },
          300: { value: "#96A3F4" },
          400: { value: "#7989F1" },
          500: { value: "#5865F2" },
          600: { value: "#4A55D2" },
          700: { value: "#3C46B2" },
          800: { value: "#2E3792" },
          900: { value: "#181C5D" },
        },
        lavender: {
          50: { value: "#F5F0FF" },
          100: { value: "#E6DAFF" },
          200: { value: "#CBB3FF" },
          300: { value: "#AF8DFF" },
          400: { value: "#9567FF" },
          500: { value: "#7A42FF" },
          600: { value: "#6720E6" },
          700: { value: "#5314B3" },
          800: { value: "#3F0F80" },
          900: { value: "#2A0A4D" },
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
          800: { value: "#4D4B84" },
          900: { value: "#2A2948" },
        },
        flamingoPink: {
          50: { value: "#FFEFF4" },
          100: { value: "#FFD6E3" },
          200: { value: "#FFB3CD" },
          300: { value: "#FF8FB7" },
          400: { value: "#FF6BA1" },
          500: { value: "#FF478B" },
          600: { value: "#E63E7D" },
          700: { value: "#B33063" },
          800: { value: "#80234A" },
          900: { value: "#4D162F" },
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
          800: { value: "#80235E" },
          900: { value: "#4D163A" },
        },
        brown: {
          50: { value: "#EFEBE9" },
          100: { value: "#D7CCC8" },
          200: { value: "#BCAAA4" },
          300: { value: "#A1887F" },
          400: { value: "#8D6E63" },
          500: { value: "#795548" },
          600: { value: "#6D4C41" },
          700: { value: "#5D4037" },
          800: { value: "#3E2723" },
          900: { value: "#2A1916" },
        },
        mocha: {
          50: { value: "#F5EDE9" },
          100: { value: "#EAD7CF" },
          200: { value: "#D7B8A9" },
          300: { value: "#C49A84" },
          400: { value: "#B27B5E" },
          500: { value: "#9F5D39" },
          600: { value: "#864C2F" },
          700: { value: "#6B3D25" },
          800: { value: "#512D1A" },
          900: { value: "#371E10" },
        },
        caramel: {
          50: { value: "#FBF3EA" },
          100: { value: "#F4E0C9" },
          200: { value: "#E8C7A0" },
          300: { value: "#DCAE78" },
          400: { value: "#D0944F" },
          500: { value: "#C47B27" },
          600: { value: "#A56520" },
          700: { value: "#834F19" },
          800: { value: "#623913" },
          900: { value: "#41240C" },
        },
        cream: {
          50: { value: "#FCF9F4" },
          100: { value: "#F7F1E4" },
          200: { value: "#EFE5CE" },
          300: { value: "#E7D9B8" },
          400: { value: "#DFCCA2" },
          500: { value: "#D7BF8C" },
          600: { value: "#B19D72" },
          700: { value: "#8A7A58" },
          800: { value: "#63573E" },
          900: { value: "#3D3424" },
        },
        maroon: {
          50: { value: "#FAEBEB" },
          100: { value: "#F2C8C8" },
          200: { value: "#E69E9E" },
          300: { value: "#D97373" },
          400: { value: "#C94C4C" },
          500: { value: "#A32626" },
          600: { value: "#7D1C1C" },
          700: { value: "#5A1313" },
          800: { value: "#3A0D0D" },
          900: { value: "#1A0000" },
        },
        sapphire: {
          50: { value: "#F3F7FF" },
          100: { value: "#D5E2FF" },
          200: { value: "#A6BEFF" },
          300: { value: "#7B9BFF" },
          400: { value: "#4E75FF" },
          500: { value: "#1939B7" },
          "500a": { value: "#1939B720" },
          600: { value: "#152F9B" },
          700: { value: "#10237B" },
          800: { value: "#0C1A5C" },
          900: { value: "#07103D" },
        },
      },
      fontSizes: {
        xs: { value: "0.625rem" }, // 10px
        sm: { value: "0.75rem" }, // 12px
        md: { value: "0.875rem" }, // 14px
        lg: { value: "1rem" }, // 16px
      },
    },
    semanticTokens: {
      colors: {
        text: { value: { base: "{colors.dark}", _dark: "#ddd" } },
        body: { value: { base: "{colors.light}", _dark: "{colors.dark}" } },
        bgContent: {
          value: { base: "#fafafa", _dark: "#141414" },
        },
        bodytrans: {
          value: { base: "{colors.light}aa", _dark: "{colors.dark}aa" },
        },
        ibody: { value: { base: "{colors.dark}", _dark: "{colors.light}" } },
        border: {
          subtle: {
            value: {
              base: "{colors.d1} !important",
              _dark: "{colors.d1} !important",
            },
          },
          muted: {
            value: {
              base: "#ebebec !important",
              _dark: "#222 !important",
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
        p: {
          solid: {
            value: {
              base: "{colors.p.500}",
              _dark: "{colors.p.500}",
            },
          },
          contrast: {
            value: { base: "{colors.p.800}", _dark: "{colors.p.800}" },
          },
          fg: {
            value: {
              base: "{colors.p.600}",
              _dark: "{colors.p.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.p.500}",
              _dark: "{colors.p.800} ",
            },
          },
          subtle: {
            value: {
              base: "{colors.p.100}",
              _dark: "{colors.p.900}",
            },
          },
          emphasized: { value: "{colors.p.400}" },
          focusRing: {
            value: {
              base: "{colors.p.500}",
              _dark: "{colors.p.700}",
            },
          },
        },
        ap: {
          solid: {
            value: {
              base: "{colors.ap.500}",
              _dark: "{colors.ap.500}",
            },
          },
          contrast: {
            value: { base: "{colors.ap.50}", _dark: "{colors.ap.900}" },
          },
          fg: {
            value: {
              base: "{colors.ap.500}",
              _dark: "{colors.ap.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.ap.200}",
              _dark: "{colors.ap.800}",
            },
          },
          subtle: {
            value: {
              base: "{colors.ap.100}",
              _dark: "{colors.ap.900}",
            },
          },
          emphasized: { value: "{colors.ap.400}" },
          focusRing: {
            value: {
              base: "{colors.ap.500}",
              _dark: "{colors.ap.700}",
            },
          },
        },
        s: {
          solid: {
            value: {
              base: "{colors.s.500}",
              _dark: "{colors.s.500}",
            },
          },
          contrast: {
            value: { base: "{colors.s.50}", _dark: "{colors.s.900}" },
          },
          fg: {
            value: {
              base: "{colors.s.500}",
              _dark: "{colors.s.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.s.200}",
              _dark: "{colors.s.800}",
            },
          },
          subtle: {
            value: {
              base: "{colors.s.100}",
              _dark: "{colors.s.900}",
            },
          },
          emphasized: { value: "{colors.s.400}" },
          focusRing: {
            value: {
              base: "{colors.s.500}",
              _dark: "{colors.s.700}",
            },
          },
        },
        aw: {
          solid: {
            value: {
              base: "{colors.aw.500}",
              _dark: "{colors.aw.500}",
            },
          },
          contrast: {
            value: { base: "{colors.aw.50}", _dark: "{colors.aw.900}" },
          },
          fg: {
            value: {
              base: "{colors.aw.500}",
              _dark: "{colors.aw.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.aw.200}",
              _dark: "{colors.aw.800}",
            },
          },
          subtle: {
            value: {
              base: "{colors.aw.100}",
              _dark: "{colors.aw.900}",
            },
          },
          emphasized: { value: "{colors.aw.400}" },
          focusRing: {
            value: {
              base: "{colors.aw.500}",
              _dark: "{colors.aw.700}",
            },
          },
        },
        gray: {
          // solid: {
          //   value: {
          //     base: "{colors.gray.500} !important",
          //     _dark: "{colors.gray.500} !important",
          //   },
          // },
          // contrast: {
          //   value: { base: "{colors.gray.50}", _dark: "{colors.gray.900}" },
          // },
          // fg: {
          //   value: {
          //     base: "{colors.gray.500}",
          //     _dark: "{colors.gray.200}",
          //   },
          // },
          // muted: {
          //   value: {
          //     base: "{colors.gray.200}",
          //     _dark: "{colors.gray.800}",
          //   },
          // },
          subtle: {
            value: {
              base: "{colors.d0} !important",
              _dark: "{colors.d0} !important",
            },
          },
          // emphasized: {
          //   value: {
          //     base: "{colors.gray.100}",
          //     _dark: "{colors.gray.900}",
          //   },
          // },
          // focusRing: {
          //   value: {
          //     base: "{colors.gray.500}",
          //     _dark: "{colors.gray.700}",
          //   },
          // },
        },
        brown: {
          solid: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.500}",
            },
          },
          contrast: {
            value: { base: "{colors.brown.50}", _dark: "{colors.brown.900}" },
          },
          fg: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.300}",
            },
          },
          muted: {
            value: {
              base: "{colors.brown.400} !important",
              _dark: "{colors.brown.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.brown.100}",
              _dark: "{colors.brown.900}",
            },
          },
          emphasized: { value: "{colors.brown.400}" },
          focusRing: {
            value: {
              base: "{colors.brown.500}",
              _dark: "{colors.brown.700}",
            },
          },
        },
        mocha: {
          solid: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.500}",
            },
          },
          contrast: {
            value: { base: "{colors.mocha.50}", _dark: "{colors.mocha.900}" },
          },
          fg: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.mocha.400}",
              _dark: "{colors.mocha.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.mocha.100}",
              _dark: "{colors.mocha.900}",
            },
          },
          emphasized: { value: "{colors.mocha.400}" },
          focusRing: {
            value: {
              base: "{colors.mocha.500}",
              _dark: "{colors.mocha.700}",
            },
          },
        },
        caramel: {
          solid: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.caramel.50}",
              _dark: "{colors.caramel.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.caramel.400}",
              _dark: "{colors.caramel.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.caramel.100}",
              _dark: "{colors.caramel.900}",
            },
          },
          emphasized: { value: "{colors.caramel.400}" },
          focusRing: {
            value: {
              base: "{colors.caramel.500}",
              _dark: "{colors.caramel.700}",
            },
          },
        },
        cream: {
          solid: {
            value: {
              base: "{colors.cream.500}",
              _dark: "{colors.cream.500}",
            },
          },
          contrast: {
            value: { base: "{colors.cream.50}", _dark: "{colors.cream.900}" },
          },
          fg: {
            value: {
              base: "{colors.cream.600}",
              _dark: "{colors.cream.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.cream.500}",
              _dark: "{colors.cream.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.cream.100}",
              _dark: "{colors.cream.900}",
            },
          },
          emphasized: { value: "{colors.cream.400}" },
          focusRing: {
            value: {
              base: "{colors.cream.500}",
              _dark: "{colors.cream.700}",
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
            value: { base: "{colors.maroon.50}", _dark: "{colors.maroon.100}" },
          },
          fg: {
            value: {
              base: "{colors.maroon.500}",
              _dark: "{colors.maroon.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.maroon.400}",
              _dark: "{colors.maroon.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.maroon.100}",
              _dark: "{colors.maroon.900}",
            },
          },
          emphasized: { value: "{colors.maroon.400}" },
          focusRing: {
            value: {
              base: "{colors.maroon.500}",
              _dark: "{colors.maroon.700}",
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
            value: { base: "{colors.red.50}", _dark: "{colors.red.100}" },
          },
          fg: {
            value: {
              base: "{colors.red.500} !important",
              _dark: "{colors.red.400} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.red.400} !important",
              _dark: "{colors.red.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.red.100}",
              _dark: "{colors.red.900}",
            },
          },
          emphasized: { value: "{colors.red.400}" },
          focusRing: {
            value: {
              base: "{colors.red.500}",
              _dark: "{colors.red.700}",
            },
          },
        },
        salmon: {
          solid: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.500}",
            },
          },
          contrast: {
            value: { base: "{colors.salmon.50}", _dark: "{colors.salmon.100}" },
          },
          fg: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.salmon.400}",
              _dark: "{colors.salmon.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.salmon.100}",
              _dark: "{colors.salmon.900}",
            },
          },
          emphasized: { value: "{colors.salmon.400}" },
          focusRing: {
            value: {
              base: "{colors.salmon.500}",
              _dark: "{colors.salmon.700}",
            },
          },
        },
        flamingoPink: {
          solid: {
            value: {
              base: "{colors.flamingoPink.500}",
              _dark: "{colors.flamingoPink.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.flamingoPink.50}",
              _dark: "{colors.flamingoPink.100}",
            },
          },
          fg: {
            value: {
              base: "{colors.flamingoPink.500}",
              _dark: "{colors.flamingoPink.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.flamingoPink.400}",
              _dark: "{colors.flamingoPink.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.flamingoPink.100}",
              _dark: "{colors.flamingoPink.900}",
            },
          },
          emphasized: { value: "{colors.flamingoPink.400}" },
          focusRing: {
            value: {
              base: "{colors.flamingoPink.500}",
              _dark: "{colors.flamingoPink.700}",
            },
          },
        },
        bubblegumPink: {
          solid: {
            value: {
              base: "{colors.bubblegumPink.500}",
              _dark: "{colors.bubblegumPink.500}",
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
              base: "{colors.bubblegumPink.400}",
              _dark: "{colors.bubblegumPink.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.bubblegumPink.100}",
              _dark: "{colors.bubblegumPink.900}",
            },
          },
          emphasized: { value: "{colors.bubblegumPink.400}" },
          focusRing: {
            value: {
              base: "{colors.bubblegumPink.500}",
              _dark: "{colors.bubblegumPink.700}",
            },
          },
        },
        pink: {
          solid: {
            value: {
              base: "{colors.pink.500}",
              _dark: "{colors.pink.500}",
            },
          },
          contrast: {
            value: { base: "{colors.pink.50}", _dark: "{colors.pink.900}" },
          },
          fg: {
            value: {
              base: "{colors.pink.500} !important",
              _dark: "{colors.pink.400} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.pink.400} !important",
              _dark: "{colors.pink.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.pink.100}",
              _dark: "{colors.pink.900}",
            },
          },
          emphasized: { value: "{colors.pink.400}" },
          focusRing: {
            value: {
              base: "{colors.pink.500}",
              _dark: "{colors.pink.700}",
            },
          },
        },
        orange: {
          solid: {
            value: {
              base: "{colors.orange.500}",
              _dark: "{colors.orange.500}",
            },
          },
          contrast: {
            value: { base: "{colors.orange.50}", _dark: "{colors.orange.900}" },
          },
          fg: {
            value: {
              base: "{colors.orange.500} !important",
              _dark: "{colors.orange.400} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.orange.400} !important",
              _dark: "{colors.orange.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.orange.100}",
              _dark: "{colors.orange.900}",
            },
          },
          emphasized: { value: "{colors.orange.400}" },
          focusRing: {
            value: {
              base: "{colors.orange.500}",
              _dark: "{colors.orange.700}",
            },
          },
        },
        pastelSalmon: {
          solid: {
            value: {
              base: "{colors.pastelSalmon.500}",
              _dark: "{colors.pastelSalmon.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.pastelSalmon.50}",
              _dark: "{colors.pastelSalmon.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.pastelSalmon.500}",
              _dark: "{colors.pastelSalmon.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.pastelSalmon.400}",
              _dark: "{colors.pastelSalmon.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.pastelSalmon.100}",
              _dark: "{colors.pastelSalmon.900}",
            },
          },
          emphasized: { value: "{colors.pastelSalmon.400}" },
          focusRing: {
            value: {
              base: "{colors.pastelSalmon.500}",
              _dark: "{colors.pastelSalmon.700}",
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
            value: { base: "{colors.yellow.50}", _dark: "{colors.yellow.900}" },
          },
          fg: {
            value: {
              base: "{colors.yellow.700} !important",
              _dark: "{colors.yellow.500} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.yellow.600} !important",
              _dark: "{colors.yellow.500} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.yellow.100}",
              _dark: "{colors.yellow.900}",
            },
          },
          emphasized: { value: "{colors.yellow.400}" },
          focusRing: {
            value: {
              base: "{colors.yellow.500}",
              _dark: "{colors.yellow.700}",
            },
          },
        },
        lime: {
          solid: {
            value: {
              base: "{colors.lime.500}",
              _dark: "{colors.lime.500}",
            },
          },
          contrast: {
            value: { base: "{colors.lime.900}", _dark: "{colors.dark}" },
          },
          fg: {
            value: {
              base: "{colors.lime.700}",
              _dark: "{colors.lime.500}",
            },
          },
          muted: {
            value: {
              base: "{colors.lime.600}",
              _dark: "{colors.lime.600}",
            },
          },
          subtle: {
            value: {
              base: "{colors.lime.100}",
              _dark: "{colors.lime.900}",
            },
          },
          emphasized: { value: "{colors.lime.400}" },
          focusRing: {
            value: {
              base: "{colors.lime.500}",
              _dark: "{colors.lime.700}",
            },
          },
        },
        olive: {
          solid: {
            value: {
              base: "{colors.olive.500}",
              _dark: "{colors.olive.500}",
            },
          },
          contrast: {
            value: { base: "{colors.olive.50}", _dark: "{colors.olive.900}" },
          },
          fg: {
            value: {
              base: "{colors.olive.500}",
              _dark: "{colors.olive.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.olive.200}",
              _dark: "{colors.olive.800}",
            },
          },
          subtle: {
            value: {
              base: "{colors.olive.100}",
              _dark: "{colors.olive.900}",
            },
          },
          emphasized: { value: "{colors.olive.400}" },
          focusRing: {
            value: {
              base: "{colors.olive.500}",
              _dark: "{colors.olive.700}",
            },
          },
        },
        green: {
          solid: {
            value: {
              base: "{colors.green.500}",
              _dark: "{colors.green.500}",
            },
          },
          contrast: {
            value: { base: "{colors.green.50}", _dark: "{colors.green.900}" },
          },
          fg: {
            value: {
              base: "{colors.green.600} !important",
              _dark: "{colors.green.500} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.green.500} !important",
              _dark: "{colors.green.500} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.green.100}",
              _dark: "{colors.green.900}",
            },
          },
          emphasized: { value: "{colors.green.400}" },
          focusRing: {
            value: {
              base: "{colors.green.500}",
              _dark: "{colors.green.700}",
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
            value: { base: "{colors.jade.50}", _dark: "{colors.jade.900}" },
          },
          fg: {
            value: {
              base: "{colors.jade.600}",
              _dark: "{colors.jade.500}",
            },
          },
          muted: {
            value: {
              base: "{colors.jade.400}",
              _dark: "{colors.jade.500}",
            },
          },
          subtle: {
            value: {
              base: "{colors.jade.100}",
              _dark: "{colors.jade.900}",
            },
          },
          emphasized: { value: "{colors.jade.400}" },
          focusRing: {
            value: {
              base: "{colors.jade.500}",
              _dark: "{colors.jade.700}",
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
            value: { base: "{colors.teal.50}", _dark: "{colors.teal.900}" },
          },
          fg: {
            value: {
              base: "{colors.teal.600} !important",
              _dark: "{colors.teal.400} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.teal.500} !important",
              _dark: "{colors.teal.500} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.teal.100}",
              _dark: "{colors.teal.900}",
            },
          },
          emphasized: { value: "{colors.teal.400}" },
          focusRing: {
            value: {
              base: "{colors.teal.500}",
              _dark: "{colors.teal.700}",
            },
          },
        },
        tealBlue: {
          solid: {
            value: {
              base: "{colors.tealBlue.500} !important",
              _dark: "{colors.tealBlue.500} !important",
            },
          },
          contrast: {
            value: {
              base: "{colors.tealBlue.50}",
              _dark: "{colors.tealBlue.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.tealBlue.600} !important",
              _dark: "{colors.tealBlue.400} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.tealBlue.500} !important",
              _dark: "{colors.tealBlue.500} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.tealBlue.100}",
              _dark: "{colors.tealBlue.900}",
            },
          },
          emphasized: { value: "{colors.tealBlue.400}" },
          focusRing: {
            value: {
              base: "{colors.tealBlue.500}",
              _dark: "{colors.tealBlue.700}",
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
              base: "{colors.powderBlue.200}",
              _dark: "{colors.powderBlue.800}",
            },
          },
          subtle: {
            value: {
              base: "{colors.powderBlue.100}",
              _dark: "{colors.powderBlue.900}",
            },
          },
          emphasized: { value: "{colors.powderBlue.400}" },
          focusRing: {
            value: {
              base: "{colors.powderBlue.500}",
              _dark: "{colors.powderBlue.700}",
            },
          },
        },
        cyan: {
          solid: {
            value: {
              base: "{colors.cyan.500} !important",
              _dark: "{colors.cyan.500}",
            },
          },
          contrast: {
            value: { base: "{colors.cyan.50}", _dark: "{colors.cyan.900}" },
          },
          fg: {
            value: {
              base: "{colors.cyan.600} !important",
              _dark: "{colors.cyan.500} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.cyan.500} !important",
              _dark: "{colors.cyan.800} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.cyan.100}",
              _dark: "{colors.cyan.900}",
            },
          },
          emphasized: { value: "{colors.cyan.400}" },
          focusRing: {
            value: {
              base: "{colors.cyan.500}",
              _dark: "{colors.cyan.700}",
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
              base: "{colors.sky.400}",
              _dark: "{colors.sky.500}",
            },
          },
          subtle: {
            value: {
              base: "{colors.sky.100}",
              _dark: "{colors.sky.900}",
            },
          },
          emphasized: { value: "{colors.sky.400}" },
          focusRing: {
            value: {
              base: "{colors.sky.500}",
              _dark: "{colors.sky.700}",
            },
          },
        },
        blue: {
          solid: {
            value: {
              base: "{colors.blue.500}",
              _dark: "{colors.blue.500}",
            },
          },
          contrast: {
            value: { base: "{colors.blue.50}", _dark: "{colors.blue.900}" },
          },
          fg: {
            value: {
              base: "{colors.blue.500} !important",
              _dark: "{colors.blue.400} !important",
            },
          },
          muted: {
            value: {
              base: "{colors.blue.400} !important",
              _dark: "{colors.blue.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.blue.100}",
              _dark: "{colors.blue.900}",
            },
          },
          emphasized: { value: "{colors.blue.400}" },
          focusRing: {
            value: {
              base: "{colors.blue.500}",
              _dark: "{colors.blue.700}",
            },
          },
        },
        sapphire: {
          solid: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.sapphire.50}",
              _dark: "{colors.sapphire.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.sapphire.400}",
              _dark: "{colors.sapphire.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.sapphire.100}",
              _dark: "{colors.sapphire.900}",
            },
          },
          emphasized: { value: "{colors.sapphire.400}" },
          focusRing: {
            value: {
              base: "{colors.sapphire.500}",
              _dark: "{colors.sapphire.700}",
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
              _dark: "{colors.discord.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.discord.500}",
              _dark: "{colors.discord.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.discord.400}",
              _dark: "{colors.discord.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.discord.100}",
              _dark: "{colors.discord.900}",
            },
          },
          emphasized: { value: "{colors.discord.400}" },
          focusRing: {
            value: {
              base: "{colors.discord.500}",
              _dark: "{colors.discord.700}",
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
              base: "{colors.indigo.400}",
              _dark: "{colors.indigo.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.indigo.100}",
              _dark: "{colors.indigo.900}",
            },
          },
          emphasized: { value: "{colors.indigo.400}" },
          focusRing: {
            value: {
              base: "{colors.indigo.500}",
              _dark: "{colors.indigo.700}",
            },
          },
        },
        lavender: {
          solid: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.500}",
            },
          },
          contrast: {
            value: {
              base: "{colors.lavender.50}",
              _dark: "{colors.lavender.900}",
            },
          },
          fg: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.lavender.400}",
              _dark: "{colors.lavender.400}",
            },
          },
          subtle: {
            value: {
              base: "{colors.lavender.100}",
              _dark: "{colors.lavender.900}",
            },
          },
          emphasized: { value: "{colors.lavender.400}" },
          focusRing: {
            value: {
              base: "{colors.lavender.500}",
              _dark: "{colors.lavender.700}",
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
              base: "{colors.powderLavender.500}",
              _dark: "{colors.powderLavender.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.powderLavender.200}",
              _dark: "{colors.powderLavender.800}",
            },
          },
          subtle: {
            value: {
              base: "{colors.powderLavender.100}",
              _dark: "{colors.powderLavender.900}",
            },
          },
          emphasized: { value: "{colors.powderLavender.400}" },
          focusRing: {
            value: {
              base: "{colors.powderLavender.500}",
              _dark: "{colors.powderLavender.700}",
            },
          },
        },
        purple: {
          solid: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.500}",
            },
          },
          contrast: {
            value: { base: "{colors.purple.50}", _dark: "{colors.purple.900}" },
          },
          fg: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.400}",
            },
          },
          muted: {
            value: {
              base: "{colors.purple.400} !important",
              _dark: "{colors.purple.400} !important",
            },
          },
          subtle: {
            value: {
              base: "{colors.purple.100}",
              _dark: "{colors.purple.900}",
            },
          },
          emphasized: { value: "{colors.purple.400}" },
          focusRing: {
            value: {
              base: "{colors.purple.500}",
              _dark: "{colors.purple.700}",
            },
          },
        },
      },
    },
  },
});

const chakraCustomSystem = createSystem(defaultConfig, customConfig);

export default chakraCustomSystem;
