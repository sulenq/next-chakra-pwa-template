"use client";

import { Avatar } from "@/components/ui/avatar";
import { StackH, StackV } from "@/components/ui/stack";
import { ClampText } from "@/components/ui/clamp-text";
import { ImgViewer } from "@/components/media/img-viewer";
import { User } from "@/types/global.types";
import { imgUrl } from "@/utils/url";
import { StackProps } from "@chakra-ui/react";

// -----------------------------------------------------------------

interface MiniUserProps extends StackProps {
  user: User;
  withEmail?: boolean;
}

export const MiniUser = (props: MiniUserProps) => {
  // Props
  const { user, withEmail, ...restProps } = props;

  return (
    <StackH align={"center"} gap={3} minW={"200px"} {...restProps}>
      <ImgViewer id={`avatar-${user.id}`} src={imgUrl(user?.avatar?.[0]?.path)}>
        <Avatar
          src={imgUrl(user?.avatar?.[0]?.path)}
          name={user.name}
          size={withEmail ? "xs" : "2xs"}
          fontSize={"sm"}
        />
      </ImgViewer>

      <StackV>
        <ClampText>{user.name}</ClampText>

        {withEmail && (
          <ClampText fontSize={"sm"} color={"fg.subtle"}>
            {user?.email}
          </ClampText>
        )}
      </StackV>
    </StackH>
  );
};
