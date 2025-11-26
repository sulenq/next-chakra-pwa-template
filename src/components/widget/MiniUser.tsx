"use client";

import { Avatar } from "@/components/ui/avatar";
import { CContainer } from "@/components/ui/c-container";
import { ClampText } from "@/components/widget/ClampText";
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
        id={`avatar-${user.id}`}
        src={imgUrl(user?.avatar?.[0]?.filePath)}
        fallbackSrc={`${SVGS_PATH}/no-avatar.svg`}
      >
        <Avatar
          src={imgUrl(user?.avatar?.[0]?.filePath)}
          name={user.name}
          size={"sm"}
        />
      </ImgViewer>

      <CContainer>
        <ClampText lineHeight={1.2}>{user.name}</ClampText>
        <ClampText fontSize={"sm"} color={"fg.subtle"}>
          {user?.email}
        </ClampText>
      </CContainer>
    </HStack>
  );
};
