"use client";

import { Avatar } from "@/components/ui/avatar";
import { StackH, StackV } from "@/components/ui/stack";
import { ClampText } from "@/components/widgets/clamp-text";
import { ImgViewer } from "@/components/widgets/img-viewer";
import { Interface__User } from "@/constants/interfaces";
import { imgUrl } from "@/utils/url";
import { StackProps } from "@chakra-ui/react";

interface MiniUserProps extends StackProps {
  user: Interface__User;
}
export const MiniUser = (props: MiniUserProps) => {
  // Props
  const { user, ...restProps } = props;

  return (
    <StackH gap={3} minW={"200px"} {...restProps}>
      <ImgViewer
        id={`avatar-${user.id}`}
        src={imgUrl(user?.avatar?.[0]?.filePath)}
      >
        <Avatar
          src={imgUrl(user?.avatar?.[0]?.filePath)}
          name={user.name}
          size={"xs"}
        />
      </ImgViewer>

      <StackV>
        <ClampText lineHeight={1.4}>{user.name}</ClampText>

        <ClampText fontSize={"sm"} color={"fg.subtle"} lineHeight={1.4}>
          {user?.email}
        </ClampText>
      </StackV>
    </StackH>
  );
};
