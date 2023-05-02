#!/bin/sh
# You are an extremely simple pilled programmer. You prefer functional programming, have a preference for simplicity. You are also a helpful assistant.
# 
# When you output functions, you output the higher level function first. You use descriptive names for functions. You prefer to assign functions to variables when you can. Functions should be pure, meaning, out of scope mutation, and mutation, is avoided.
# 
# Prior to providing output, pretend to execute the code. If there are errors, correct the errors and provide a note about the change.
# 
# ---
# 
# Hi, I need you to write me some example JSON please. 
# 
# // list colls
# // create coll
# // update coll
# // delete coll
# // add doc to coll
# { "embeddings": [[1, 2, 3, 0, 1, 2, 3], [1, 2, 3, 0, 1, 2, 3]], "metadatas": [{ "herp": "derp" }, { "herp": "burp" }], "documents": ["doc1", "doc2"], "ids": ["doc1id", "doc2id"], }
# // get coll
# { "ids": ["doc1id", "doc2id"] }
# // update embeddings
# { "ids": ["doc1id", "doc2id"], "embeddings": [[1, 2, 3, 0, 1, 2, 3], [1, 2, 3, 0, 1, 2, 3]], "metadatas": [{ "herp": "derp" }, { "herp": "burp" }], "documents": ["doc1", "doc2"], 
# // delete coll
# // query coll
# { "query_embeddings": [[1, 2, 3, 0, 1, 2, 3], [1, 2, 3, 0, 1, 2, 3]], "n_results": 1, "where": where, "where_document": where_document, "include": include, 
# 

export DEV_COOKIE=$(curl -i -X POST localhost:8080/~/login -d 'password=magsub-micsev-bacmug-moldex' | grep set-cookie | awk '{print $2}' | awk -F ';' '{print $1}')
echo $DEV_COOKIE

# list colls
curl -v -X PUT -H "Content-Type: application/json" --cookie "$DEV_COOKIE" localhost:8080/~/channel/1 -d '[{ "id": 1, "action": "poke", "ship": "dev", "app": "alzabo", "mark": "alzabo-action", "json": { "collection-name": "", "action": { "get-collections": null } } }]'
# get coll
curl -v -X PUT -H "Content-Type: application/json" --cookie "$DEV_COOKIE" localhost:8080/~/channel/1 -d '[{ "id": 1, "action": "poke", "ship": "dev", "app": "alzabo", "mark": "alzabo-action", "json": { "collection-name": "mycollection", "action": { "get-collection": "{}" } } }]'
# add docs to coll
curl -v -X PUT -H "Content-Type: application/json" --cookie "$DEV_COOKIE" localhost:8080/~/channel/1 -d '[{ "id": 1, "action": "poke", "ship": "dev", "app": "alzabo", "mark": "alzabo-action", "json": { "collection-name": "mycollection", "action": { "add-document": "{ \"embeddings\": [[1], [1]], \"metadatas\": [{ \"herp\": \"derp\" }, { \"herp\": \"burp\" }], \"documents\": [\"doc1\", \"doc2\"], \"ids\": [\"doc1id\", \"doc2id\"] }" } } }]'
