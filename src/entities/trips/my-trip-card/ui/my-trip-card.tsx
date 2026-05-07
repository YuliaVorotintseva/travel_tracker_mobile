import { FC } from "react";
import { Pressable, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import { TripWithMembers } from "@/src/shared/types";
import { DeleteButton } from "@/src/shared/ui";
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
        <DeleteButton onPress={onDelete} />
      </View>
    )}
    overshootRight={false}
  >
    <Pressable onPress={onPress}>
      <TripCard trip={trip} />
    </Pressable>
  </Swipeable>
);
