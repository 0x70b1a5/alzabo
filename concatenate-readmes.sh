#!/bin/bash

OUTPUT_FILE="concatenated.md"
IFS="," read -ra DIRECTORIES <<< "$1"

# Initialize the output file
echo -n "" > "$OUTPUT_FILE"

for directory in "${DIRECTORIES[@]}"; do
  while IFS= read -r -d '' file; do
    if [[ $file == *.md && $file != *"/$OUTPUT_FILE" && $file != *"/node_modules/"* ]]; then
      echo "Appending $file to $OUTPUT_FILE"
      cat "$file" >> "$OUTPUT_FILE"
      echo -e "\n" >> "$OUTPUT_FILE"
    fi
  done < <(find "$directory" -type f -print0)
done

echo "Concatenated contents of Markdown files into $OUTPUT_FILE"

# curl https://api.openai.com/v1/embeddings \
#   -H "Content-Type: application/json" \
#   -H "Authorization: Bearer $OPENAI_API_KEY" \
#   -d "{
#     \"input\": \"${DERP}\",
#     \"model\": \"text-embedding-ada-002\"
#   }"
