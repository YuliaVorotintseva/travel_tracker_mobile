import { FC, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useMyProfile } from "@/src/shared/hooks";
import { CloseIcon } from "@/src/shared/icons";
import { TRIP_MEMBER_ROLE, TripMemberWithProfile } from "@/src/shared/types";
import { Profiles } from "@/src/shared/types/api/generated";
import { SelectPicker } from "@/src/shared/ui";
import { ConfirmDeleteModal } from "@/src/shared/ui/confirm_delete_modal";
import { getFormatDateTime } from "@/src/shared/utils";
import { useGetStyles } from "./styles";

type TripMembersListModalProps = {
  members: TripMemberWithProfile[];
  userRole: TripMemberWithProfile["role"];
  onClose: () => void;
  onMember: () => void;
  onSelectRole: (
    user_id: string,
    role: TripMemberWithProfile["role"],
  ) => Promise<any>;
  onDelete: (user_id: string) => void;
};

export const TripMembersListModal: FC<TripMembersListModalProps> = ({
  members,
  userRole,
  onClose,
  onMember,
  onSelectRole,
  onDelete,
}) => {
  const styles = useGetStyles();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] =
    useState<TripMemberWithProfile | null>(null);
  const { profile } = useMyProfile();

  return (
    <View style={styles.modalOverlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      <View style={styles.modalContent}>
        <Pressable onPress={onClose}>
          <CloseIcon />
        </Pressable>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          {members.length > 0 ? (
            <View style={{ flex: 1 }}>
              <ScrollView contentContainerStyle={{ height: "100%" }}>
                {members.map((item) => (
                  <Pressable
                    onPress={onMember}
                    style={styles.member}
                    key={item.user_id}
                  >
                    <View style={styles.userInfo}>
                      <View style={styles.header}>
                        <Image
                          style={styles.avatar}
                          source={
                            !!item.profiles?.avatar_url
                              ? { uri: item.profiles.avatar_url }
                              : require("../../../../assets/images/account24.png")
                          }
                          onError={(e) =>
                            console.log("Image error:", e.nativeEvent.error)
                          }
                        />
                        <Text style={styles.name}>
                          {!!item.profiles && !!item.profiles?.full_name
                            ? item.profiles.full_name
                            : "unknown"}
                        </Text>
                      </View>

                      {userRole === "owner" &&
                        item.user_id !== (profile as Profiles).id && (
                          <View style={styles.constrols}>
                            <SelectPicker
                              value={item.role}
                              onChange={(value) =>
                                onSelectRole(item.user_id, value)
                              }
                              options={TRIP_MEMBER_ROLE}
                              searchable={false}
                            />

                            <Pressable
                              onPress={() => {
                                setSelectedMember(item);
                                setIsDeleteModalOpen(true);
                              }}
                              style={styles.deleteBtn}
                            >
                              <Text style={styles.deleteBtnText}>
                                Delete member
                              </Text>
                            </Pressable>
                          </View>
                        )}

                      <View>
                        <Text
                          style={styles.info}
                        >{`Invited: ${getFormatDateTime(new Date(item.joined_at))}`}</Text>
                        <Text style={styles.info}>{`Role: ${item.role}`}</Text>
                      </View>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : (
            <Text>There is no any member yet</Text>
          )}
        </View>
      </View>

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          text={`Do you really want to remove ${selectedMember?.profiles?.full_name ?? "this member"} from trip?`}
          onClose={() => setIsDeleteModalOpen(false)}
          onDelete={() => onDelete(selectedMember?.user_id ?? "")}
        />
      )}
    </View>
  );
};
