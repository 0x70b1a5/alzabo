# cats all Markdown files in a dir (recursive) into concatenated.md
import re
from typing import List
import sys
from pathlib import Path
import tiktoken

def num_tokens_from_string(string: str, encoding_name: str) -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens


def split_into_chunks(text: str, max_tokens: int, model: str) -> List[str]:
    tokens = re.findall(r'\S+|\n', text)  # Break text into tokens
    chunks = []
    current_chunk = []

    token_count = 0
    for token in tokens:
        token_count += num_tokens_from_string(token, model)

        if token_count > max_tokens:
            chunks.append(" ".join(current_chunk))
            current_chunk = []
            token_count = num_tokens_from_string(token, model)

        current_chunk.append(token)

    chunks.append(" ".join(current_chunk))
    return chunks


def concatenate_markdown_files(directories, max_tokens_per_file=8191, model="cl100k_base"):
    index = 0
    output_file = f"concatenated-{index}.md"

    with open(output_file, 'w') as output:  # Create an empty output file
        pass

    for directory in directories:
        print(f"Starting {directory}")
        
        for input_file in directory.rglob("*.md"):
            if output_file in input_file.name or "node_modules" in input_file.parts:
                continue

            with open(input_file, 'r') as md_file:
                input_content = md_file.read()

            content_chunks = split_into_chunks(input_content, max_tokens_per_file, model)

            for chunk in content_chunks:
                with open(output_file, 'r') as output:
                    old_content = output.read()
                    current_tokens = num_tokens_from_string(old_content, model)

                tokens_to_add = num_tokens_from_string(chunk, model)
                total_tokens = current_tokens + tokens_to_add

                # Respect embedding API limit.
                if total_tokens > max_tokens_per_file:
                    index += 1
                    output_file = f"concatenated-{index}.md"

                with open(output_file, 'a') as output:
                    output.write(chunk)
                    output.write("\n")


def main():
    input_directories = sys.argv[1].split(",")
    directories = [Path(directory) for directory in input_directories]
    print(f"For directories: {directories}")
    concatenate_markdown_files(directories, 8191)


if __name__ == "__main__":
    main()
