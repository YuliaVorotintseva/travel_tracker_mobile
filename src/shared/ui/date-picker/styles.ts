import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  title: { fontSize: 17, fontWeight: "600", color: "#0f172a" },
  cancelText: { fontSize: 16, color: "#ef4444" },
  confirmText: { fontSize: 16, color: "#2563eb", fontWeight: "600" },
  picker: { height: 180, width: "100%" },
  btn: { padding: 4 },
});
