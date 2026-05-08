import { Image, Text, View } from "react-native";

import { BackIcon, UserIcon } from "@/src/shared/icons";
import { supabase, useTheme } from "@/src/shared/lib";
import { Profiles } from "@/src/shared/types/api/generated";
import { IconBackButton } from "@/src/shared/ui";
import { getFormatDate } from "@/src/shared/utils";
import { FC, useEffect, useState } from "react";
import { getStyles } from "./styles";

export const Profile: FC<{ userId: string }> = ({ userId }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
  const [user, setUser] = useState<Profiles | null>(null);

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();

      if (!!error) {
        console.error(error);
      }

      setUser(data);
    };
    init();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconBackButton icon={<BackIcon />} />
        <Text style={styles.title}>Profile</Text>
      </View>
      <View style={styles.content}>
        {!!user?.avatar_url ? (
          <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
        ) : (
          <UserIcon width={92} theme={theme} />
        )}
        <View>
          <Text style={styles.text}>{user?.full_name}</Text>
          <Text style={styles.text}>{user?.email}</Text>
          <Text style={styles.text}>
            {getFormatDate(new Date(user?.created_at!))}
          </Text>
        </View>
      </View>
    </View>
  );
};
