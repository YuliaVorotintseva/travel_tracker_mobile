import { FC, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

import { ShareIcon } from "@/src/shared/icons";
import { supabase, useTheme } from "@/src/shared/lib";
import { TripWithMembers } from "@/src/shared/types";
import { getFormatDate } from "@/src/shared/utils";
import { User } from "@supabase/supabase-js";
import { getStyles } from "./styles";

type TripCardProps = {
  post: TripWithMembers;
  onPress: () => void;
};

export const TripCard: FC<TripCardProps> = ({ post, onPress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [author, setAuthor] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setAuthor(session?.user ?? null);
      })
      .catch((error: unknown) => {
        console.error((error as { message: string }).message);
      });
  }, []);

  return (
    <TouchableOpacity onPress={onPress} style={styles.content}>
      <View style={styles.header}>
        <Text style={styles.text}>{post.title}</Text>
        <Text style={styles.text}>
          {getFormatDate(new Date(post.created_at!))}
        </Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.userInfo}>
          {!!author?.user_metadata["avatar_url"] && (
            <Image
              source={{ uri: author?.user_metadata["avatar_url"] }}
              style={styles.avatar}
            />
          )}
          <Text style={styles.text}>{author?.user_metadata["full_name"]}</Text>
        </View>
        <View style={styles.btns}>
          <ShareIcon />
        </View>
      </View>
    </TouchableOpacity>
  );
};
