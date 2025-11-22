"use client";

import { NavLink } from "@/components/ui/nav-link";
import { P } from "@/components/ui/p";
import { HStack, Icon, StackProps } from "@chakra-ui/react";
import { IconChevronRight } from "@tabler/icons-react";
import { Fragment } from "react";

interface Props extends StackProps {
  links: { label: string; path: string }[];
}

export const Breadcrumbs = (props: Props) => {
  // Props
  const { links, ...restProps } = props;

  return (
    <HStack w={"fit"} {...restProps}>
      {links.map((link, idx) => {
        const last = idx === links.length - 1;

        return (
          <Fragment key={idx}>
            <NavLink key={link.path} to={!last ? link.path : ""} w={"fit"}>
              <P lineClamp={1} opacity={last ? 0.6 : 1} maxW={"240px"}>
                {link.label}
              </P>
            </NavLink>

            {!last && (
              <Icon boxSize={5}>
                <IconChevronRight stroke={1.5} />
              </Icon>
            )}
          </Fragment>
        );
      })}
    </HStack>
  );
};
