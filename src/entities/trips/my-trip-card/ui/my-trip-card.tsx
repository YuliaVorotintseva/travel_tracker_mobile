import { FC } from "react";
import { Pressable, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { TrashIcon } from "@/src/shared/icons";
import { TripWithMembers } from "@/src/shared/types";
import { TripCard } from "../../trip-card/ui/trip-card";

type MyTripCardProps = {
  trip: TripWithMembers;
  onPress: () => void;
  onDelete: () => void;
};

export const MyTripCard: FC<MyTripCardProps> = ({
  trip,
  onPress,
  onDelete,
}) => (
  <Swipeable
    renderRightActions={() => (
      <View style={{ width: 80 }}>
        <Pressable
          style={{
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
          onPress={onDelete}
        >
          <TrashIcon />
        </Pressable>
      </View>
    )}
    overshootRight={false}
  >
    <Pressable onPress={onPress}>
      <TripCard trip={trip} />
    </Pressable>
  </Swipeable>
);
