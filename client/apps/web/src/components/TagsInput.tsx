"use client";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import React, { useState } from "react";

interface TagsInputProps {
  tags?: string[] | undefined;
  onTagsChange: (tags: string[]) => void;
}

const TagsInput: React.FC<TagsInputProps> = ({ tags, onTagsChange }) => {
  const [newTags, setNewTags] = useState<string[]>(tags ?? []);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229)  return;  // NOTE: https://github.com/vuejs/vue/issues/10277

    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      setNewTags((t) => [...t, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleTagRemove = (tag: string) => {
    setNewTags((t) => t.filter((t_) => t_ !== tag));
  };

  return (
    <Box className="bg-gray-100 min-h-16 h-fit rounded border border-gray-300">
      <Flex className="p-2 flex-wrap" >
        {newTags.map((tag, tagIdx) => (
          <Flex
            key={tagIdx}
            className="tag m-1 bg-primary-300 rounded-lg py-1 px-2 items-center w-fit"
          >
            <span className="px-2 text-sm">{tag}</span>
            <IconButton className="mx-1" onClick={() => handleTagRemove(tag)}>
              <Cross1Icon />
            </IconButton>
          </Flex>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
          className="bg-transparent p-2"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        />
      </Flex>
    </Box>
  );
};

export default TagsInput;
