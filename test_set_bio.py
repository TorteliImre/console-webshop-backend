import requests

BASE_URL = "http://localhost:3000"

token = requests.post(BASE_URL+"/auth/login", data={"name": "user1", "password": "pass123"}).json()["access_token"]
print(token)

resp = requests.post(BASE_URL+"/user/setBio", headers={"Authorization": "Bearer "+token}, data={"id": 3, "bio": "aaaaaaaaa"}).content
print(resp)
