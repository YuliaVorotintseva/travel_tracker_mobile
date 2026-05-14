import React, { useMemo, useState } from "react";
import {
  FlatList,
  Keyboard,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useGetStyles } from "./styles";

export interface SelectOption<T = string> {
  label: string;
  value: T;
  icon?: string;
}

interface SelectPickerProps<T> {
  options: SelectOption<T>[];
  value?: T;
  onChange: (value: T) => void;
  placeholder?: string;
  searchable?: boolean;
  title?: string;
  disabled?: boolean;
}

export const SelectPicker = <T extends string | number>({
  options,
  value,
  onChange,
  placeholder = "Выберите из списка",
  searchable = false,
  title,
  disabled = false,
}: SelectPickerProps<T>) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState("");
  const styles = useGetStyles();

  const selectedOption = options.find((opt) => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const filteredOptions = useMemo(() => {
    if (!searchable || !search.trim()) return options;
    const query = search.toLowerCase();
    return options.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, search, searchable]);

  const handleSelect = (item: SelectOption<T>) => {
    onChange(item.value);
    setSearch("");
    setModalVisible(false);
    Keyboard.dismiss();
  };

  const handleClose = () => {
    setSearch("");
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity
        style={[styles.trigger, disabled && styles.triggerDisabled]}
        onPress={() => !disabled && setModalVisible(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Выбрать ${title || "значение"}`}
      >
        <Text
          style={[styles.triggerText, !selectedOption && styles.placeholder]}
        >
          {displayText}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <TouchableOpacity
            style={styles.backdrop}
            activeOpacity={1}
            onPress={handleClose}
          />

          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            {title && <Text style={styles.sheetTitle}>{title}</Text>}

            {searchable && (
              <TextInput
                style={styles.searchInput}
                placeholder="🔍 Поиск..."
                value={search}
                onChangeText={setSearch}
                autoFocus
                returnKeyType="done"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit
              />
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => String(item.value)}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <View style={styles.optionContent}>
                      {item.icon && (
                        <Text style={styles.optionIcon}>{item.icon}</Text>
                      )}
                      <Text
                        style={[
                          styles.optionText,
                          isSelected && styles.optionTextSelected,
                        ]}
                      >
                        {item.label}
                      </Text>
                    </View>
                    {isSelected && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                );
              }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Ничего не найдено</Text>
              }
              style={styles.list}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};
