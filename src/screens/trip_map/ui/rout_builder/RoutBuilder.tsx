import { supabase } from "@/src/shared/lib";
import { Activity } from "@/src/shared/types";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";

import { useActivityStore } from "../../model";
import { useGetStyle } from "./styles";

interface Props {
  tripId: string;
  userRole: "owner" | "editor" | "viewer" | null;
  onClose: () => void;
}

export const RouteBuilder = ({ tripId, userRole, onClose }: Props) => {
  const { activities, updateActivity } = useActivityStore();
  const [route, setRoute] = useState<Activity[]>([]);
  const [saving, setSaving] = useState(false);
  const styles = useGetStyle();

  useEffect(() => {
    const sorted = [...activities].sort(
      (a, b) => (a.route_order || 999) - (b.route_order || 999),
    );
    setRoute(sorted);
  }, [activities]);

  if (!["owner", "editor"].includes(userRole || "")) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>📍 Построение маршрута</Text>
        <Text style={styles.error}>
          Только создатель или редактор может менять порядок
        </Text>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.btnText}>Закрыть</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const onDragEnd = ({ data }: { data: Activity[] }) => {
    setRoute(data);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates = route.map((act, index) => ({
        id: act.id,
        trip_id: tripId,
        route_order: index + 1,
      }));

      const { error } = await supabase
        .from("activities")
        .upsert(updates, { onConflict: "id" });

      if (error) throw error;

      updates.forEach(({ id, route_order }) =>
        updateActivity(id, { route_order }),
      );

      onClose();
    } catch (error: unknown) {
      console.error((error as { message: string }).message);
    } finally {
      setSaving(false);
    }
  };

  const renderItem = ({ item, drag, isActive }: RenderItemParams<Activity>) => {
    return (
      <ScaleDecorator>
        <TouchableOpacity
          activeOpacity={0.8}
          onLongPress={drag}
          disabled={!["owner", "editor"].includes(userRole || "")}
          style={[styles.item, isActive && styles.itemActive]}
        >
          <MaterialIcons name="drag-indicator" size={20} color="#94A3B8" />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.itemTitle}>{item.title || "Без названия"}</Text>
            <Text style={styles.itemMeta}>
              {item.type} •{" "}
              {item.start_time
                ? new Date(item.start_time).toLocaleTimeString("ru-RU", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "—"}
            </Text>
          </View>
          <Text style={styles.orderBadge}>#{item.route_order || "-"}</Text>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🗺️ Порядок маршрута</Text>
      <Text style={styles.subtitle}>Перетащи точки в нужном порядке</Text>

      <View style={{ flex: 1, marginVertical: 12 }}>
        <DraggableFlatList
          data={route}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          onDragEnd={onDragEnd}
          ListEmptyComponent={
            <Text style={styles.empty}>Нет точек для маршрута</Text>
          }
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={onClose}
          disabled={saving}
        >
          <Text style={styles.cancelText}>Отмена</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={styles.btnText}>
            {saving ? "Сохранение..." : "Сохранить маршрут"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
