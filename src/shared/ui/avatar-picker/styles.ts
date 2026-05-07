import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    position: "relative",
  },
  avatar: { width: "100%", height: "100%" },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#2563EB",
    borderRadius: 12,
    padding: 4,
  },
  editText: { color: "#fff", fontSize: 12 },
  error: { color: "#EF4444", marginTop: 8, textAlign: "center", fontSize: 12 },

  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 24,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
    color: "#0F172A",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    marginBottom: 8,
  },
  fallbackOption: {
    backgroundColor: "#EFF6FF",
    borderLeftWidth: 3,
    borderLeftColor: "#2563EB",
  },
  optionIcon: { fontSize: 24, marginRight: 12 },
  optionText: { fontSize: 16, color: "#334155" },

  cancelBtn: { marginTop: 12, padding: 14, alignItems: "center" },
  cancelText: { fontSize: 16, color: "#64748B", fontWeight: "500" },
});
