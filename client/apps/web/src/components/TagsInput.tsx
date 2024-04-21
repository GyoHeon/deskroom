"use client";
import { KnowledgeTag, PartialKnowledgeTag } from "@/lib/supabase.types";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Box, Flex, IconButton } from "@radix-ui/themes";
import React, { useEffect, useState } from "react";

interface TagsInputProps {
  tags?: string[] | undefined;
  onTagsChange: (tags: string[] | PartialKnowledgeTag[]) => void;
  existingTags: PartialKnowledgeTag[];
}

const TagsInput: React.FC<TagsInputProps> = ({
  tags,
  onTagsChange,
  existingTags,
}) => {
  const [newTags, setNewTags] = useState<PartialKnowledgeTag[]>(
    existingTags.length > 0 ? existingTags : []
  );
  const [inputValue, setInputValue] = useState("");
  const [similarTags, setSimilarTags] = useState<string[]>([]);

  useEffect(() => {
    // TODO: find similar tags from tags props based on inputValue
    const similarTagsCandidate =
      tags?.filter((tag) => tag.includes(inputValue)) ?? [];
    setSimilarTags(similarTagsCandidate);
  }, [inputValue]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return; // NOTE: https://github.com/vuejs/vue/issues/10277

    if (event.key === "Enter" && inputValue.trim() !== "") {
      event.preventDefault();
      setNewTags((t) => [...t, { name: inputValue.trim() }]);
      setInputValue("");
    }
  };

  const handleTagRemove = (tag: PartialKnowledgeTag) => {
    setNewTags((t) => t.filter((t_) => t_ !== tag.name));
  };

  useEffect(() => {
    onTagsChange(newTags);
  }, [newTags]);

  return (
    <Box className="bg-gray-100 min-h-16 h-fit rounded border border-gray-300">
      <Flex className="p-2 flex-wrap">
        {newTags.map((tag, tagIdx) => (
          <Flex
            key={tagIdx}
            className="tag m-1 bg-primary-300 rounded-lg py-1 px-2 items-center w-fit"
          >
            <span className="px-2 text-sm">{tag.name}</span>
            <IconButton className="mx-1" onClick={() => handleTagRemove(tag)}>
              <Cross1Icon />
            </IconButton>
          </Flex>
        ))}
        <Flex direction={`column`}>
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
          {inputValue.trim() !== "" && (
            <Flex gap={"2"} className="min-w-16">
              {similarTags.map((tag, tagIdx) => (
                <Box
                  key={tagIdx}
                  className="p-2 bg-white absolute w-fit rounded shadow-md border border-gray-300 text-sm"
                  onClick={() => setInputValue(tag)}
                >
                  {tag}
                </Box>
              ))}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default TagsInput;
