# creates vector embeddings for the text in concatenated readme files.
# api only accepts 8191 tokens at a time so we gota split inputs like this.

import json
import os
import re
import requests
from datetime import datetime
from pathlib import Path

def get_embeddings(text):
    contents_escaped = json.dumps(text)
    text_clean = ' '.join(contents_escaped.split())

    payload = {
        "input": text_clean,
        "model": "text-embedding-ada-002"
    }

    with open("payload.txt", 'w') as f:
        f.write(json.dumps(payload))

    openai_api_key = os.environ['OPENAI_API_KEY']
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {openai_api_key}"
    }
    response = requests.post("https://api.openai.com/v1/embeddings", headers=headers, json=payload)
    return response.text

def main():
    pattern = re.compile(r"concatenated-\d+\.md")

    for file_path in Path(".").iterdir():
        if not file_path.is_file() or not pattern.match(file_path.name):
            continue

        output_file = f"embeddings-{datetime.now().strftime('%Y-%m-%d-%H:%M')}.txt"

        with open(output_file, 'w') as output:  # Create an empty output file
            pass

        with open(file_path, 'r') as f:
            contents = f.read()

        embeddings = get_embeddings(contents)

        with open(output_file, 'a') as f:
            f.write(embeddings)

if __name__ == '__main__':
    main()
