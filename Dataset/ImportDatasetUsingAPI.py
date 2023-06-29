import requests, json

API_URL = r"http://localhost:8000/ruas"
dataset = []

with open("./dataset.json", "r") as datasetFile:
    dataset = json.load(datasetFile)

    for entry in dataset:
        resp = requests.post(API_URL, json=entry)

        print(resp.text)
