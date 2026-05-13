import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 32,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4, color: "#0F172A" },
  coordText: { fontSize: 13, color: "#64748B", marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#F8FAFC",
    marginBottom: 12,
  },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 6 },
  dateBtn: {
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 14,
    backgroundColor: "#F8FAFC",
    marginBottom: 12,
  },
  dateText: { fontSize: 16, color: "#334155" },
  submitBtn: {
    backgroundColor: "#2563EB",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
