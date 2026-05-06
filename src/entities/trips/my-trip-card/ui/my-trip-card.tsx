import { FC } from "react";
import { View } from "react-native";
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
        <View style={{ transform: [{ translateX: -40 }] }}>
          <DeleteButton onPress={onDelete} />
        </View>
      </View>
    )}
    overshootRight={false}
    rightThreshold={40}
  >
    <TripCard post={trip} onPress={onPress} />
  </Swipeable>
);
