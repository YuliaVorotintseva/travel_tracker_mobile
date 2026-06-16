import { useState } from "react";
import { Image, Pressable, Text, TextInput, View } from "react-native";

import { useTheme } from "@/src/shared/lib";
import { Styles } from "@/src/shared/styles";
import { ActivityComment } from "@/src/shared/types";
import { Loader } from "@/src/shared/ui/loaders";
import { getFormatDateTime } from "@/src/shared/utils";
import { useActivityComments } from "../model";
import { getStyles } from "./styles";

interface ActivityCommentsSectionProps {
  activityId: string;
  currentUserId: string;
}

export const ActivityCommentsSection: React.FC<
  ActivityCommentsSectionProps
> = ({ activityId, currentUserId }) => {
  const { theme } = useTheme();
  const { comments, isLoading, addComment, deleteComment, isAdding } =
    useActivityComments(activityId, currentUserId);
  const [newComment, setNewComment] = useState("");
  const styles = getStyles(theme);

  const handleSend = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;
    try {
      await addComment(trimmed);
      setNewComment("");
    } catch (error: unknown) {
      console.error("Failed to send comment:", error);
    }
  };

  const renderComment = (item: ActivityComment) => (
    <View style={styles.commentItem} key={item.id}>
      <Image
        style={styles.avatar}
        source={
          item.profiles?.avatar_url
            ? { uri: item.profiles.avatar_url }
            : require("@/assets/images/account24.png")
        }
      />
      <View style={styles.commentBody}>
        <View style={styles.commentHeader}>
          <Text style={styles.author}>
            {item.profiles?.full_name || "User"}
          </Text>
          <Text style={styles.date}>
            {getFormatDateTime(new Date(Number(item.created_at)))}
          </Text>
        </View>
        <Text style={styles.content}>{item.content}</Text>
        {item.user_id === currentUserId && (
          <Pressable
            onPress={() => deleteComment(item.id)}
            style={styles.deleteBtn}
          >
            <Text style={styles.deleteText}>Delete</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments ({comments.length})</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          placeholderTextColor={Styles[theme].TextSecondary}
          value={newComment}
          onChangeText={setNewComment}
          multiline
          maxLength={1000}
        />
        <Pressable
          onPress={handleSend}
          disabled={isAdding || !newComment.trim()}
          style={[
            styles.sendBtn,
            (isAdding || !newComment.trim()) && styles.sendBtnDisabled,
          ]}
        >
          <Text style={styles.sendText}>{isAdding ? "..." : "Send"}</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <Loader />
      ) : (
        comments.length > 0 && (
          <View>{comments.map((item) => renderComment(item))}</View>
        )
      )}
    </View>
  );
};
