import requests, json

API_URL = r"http://localhost:8000/ruas"
dataset = []

with open("./dataset.json", "r") as datasetFile:
    dataset = json.load(datasetFile)

    print("Importing dataset...")
    total = 0
    successfull = 0
    for entry in dataset:
        resp = requests.post(API_URL, json=entry)

        if resp.status_code != 201:
            json_object = json.loads(resp.text)
            print(json.dumps(json_object, indent=2))
        else:
            successfull += 1

        total += 1
    print(f"Tried to import {total} documents. {successfull} where successfully imported") 
