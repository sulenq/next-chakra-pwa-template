"use client";

import { Avatar } from "@/components/ui/avatar";
import { CContainer } from "@/components/ui/c-container";
import { P } from "@/components/ui/p";
import { ImgViewer } from "@/components/widget/ImgViewer";
import { Interface__User } from "@/constants/interfaces";
import { SVGS_PATH } from "@/constants/paths";
import { imgUrl } from "@/utils/url";
import { HStack, StackProps } from "@chakra-ui/react";

interface Props extends StackProps {
  user: Interface__User;
}

export const MiniUser = (props: Props) => {
  // Props
  const { user, ...restProps } = props;

  return (
    <HStack gap={3} {...restProps}>
      <ImgViewer
        src={imgUrl(user?.photoProfile?.[0]?.filePath)}
        fallbackSrc={`${SVGS_PATH}/no-avatar.svg`}
        disabled={!imgUrl(user?.photoProfile?.[0]?.filePath)}
      >
        <Avatar
          src={imgUrl(user?.photoProfile?.[0]?.filePath)}
          name={user.name}
          size={"sm"}
        />
      </ImgViewer>

      <CContainer>
        <P lineHeight={1.2}>{user.name}</P>
        <P fontSize={"sm"} color={"fg.subtle"}>
          {user?.email}
        </P>
      </CContainer>
    </HStack>
  );
};
