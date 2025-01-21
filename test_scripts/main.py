# pylint: disable=missing-timeout,line-too-long,missing-final-newline,missing-module-docstring,missing-function-docstring,missing-class-docstring,invalid-name

import datetime
import pytest
import requests
import base64
from unittest.mock import ANY

BASE_URL = "http://localhost:3000/api"

def getIsoDate() -> str:
    return datetime.datetime.now().strftime("%Y-%m-%d")

def loadImageB64(path: str) -> str:
    with open(path, "rb") as f:
        result = base64.b64encode(f.read()).decode()
    return result

IMAGE_DATA = loadImageB64("data/picture.jpg")
IMAGE_PFP_DATA = loadImageB64("data/picture-pfp.jpg")
IMAGE_AD_DATA = loadImageB64("data/picture-ad.jpg")

class TestUserBasic:
    @pytest.mark.dependency()
    def test_create(self):
        resp = requests.post(
            BASE_URL + "/user",
            data={
                "name": "user1",
                "email": "user1@mail.com",
                "password": "pass123",
            },
        )
        assert resp.json() == {"id": 1}
        assert resp.status_code == 201

        resp = requests.post(
            BASE_URL + "/user",
            data={
                "name": "user2",
                "email": "user2@mail.com",
                "password": "pass123",
            },
        )
        assert resp.json() == {"id": 2}
        assert resp.status_code == 201

        resp = requests.post(
            BASE_URL + "/user",
            data={
                "name": "user3",
                "email": "user3@mail.com",
                "password": "pass123",
            },
        )
        assert resp.json() == {"id": 3}
        assert resp.status_code == 201

    @pytest.mark.dependency(depends=["TestUserBasic::test_create"])
    def test_get(self):
        resp = requests.get(BASE_URL + "/user/1")
        assert resp.json() == {
            "id": 1,
            "name": "user1",
            "email": "user1@mail.com",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate()
        }

        resp = requests.get(BASE_URL + "/user/2")
        assert resp.json() == {
            "id": 2,
            "name": "user2",
            "email": "user2@mail.com",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate()
        }

        resp = requests.get(BASE_URL + "/user/3")
        assert resp.json() == {
            "id": 3,
            "name": "user3",
            "email": "user3@mail.com",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate()
        }

    @pytest.mark.dependency(depends=["TestUserBasic::test_create"])
    def test_log_in(self):
        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user1", "password": "pass123"}
        ).json()
        assert list(resp.keys()) == ["access_token"]
        self.token1 = resp["access_token"]

        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user2", "password": "pass123"}
        ).json()
        assert list(resp.keys()) == ["access_token"]
        self.token2 = resp["access_token"]

        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user3", "password": "pass123"}
        ).json()
        assert list(resp.keys()) == ["access_token"]
        self.token3 = resp["access_token"]


class LoggedInTestBase:
    def setup_method(self, method):
        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user1", "password": "pass123"}
        ).json()
        assert list(resp.keys()) == ["access_token"]
        self.token1 = resp["access_token"]

        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user2", "password": "pass123"}
        ).json()
        assert list(resp.keys()) == ["access_token"]
        self.token2 = resp["access_token"]

        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user3", "password": "pass123"}
        ).json()
        assert list(resp.keys()) == ["access_token"]
        self.token3 = resp["access_token"]


class TestUser(LoggedInTestBase):
    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_create",
            "TestUserBasic::test_log_in",
            "TestUserBasic::test_get",
        ]
    )
    def test_set_bio(self):
        resp = requests.post(
            BASE_URL + "/user/setBio",
            headers={"Authorization": "Bearer " + self.token1},
            data={"bio": "This is the bio of user1."},
        ).content
        resp = requests.get(BASE_URL + "/user/1").json()
        assert resp == {
            "id": 1,
            "name": "user1",
            "email": "user1@mail.com",
            "bio": "This is the bio of user1.",
            "picture": "",
            "regDate": getIsoDate()
        }
        resp = requests.get(BASE_URL + "/user/2").json()
        assert resp == {
            "id": 2,
            "name": "user2",
            "email": "user2@mail.com",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate()
        }

        resp = requests.post(
            BASE_URL + "/user/setBio",
            headers={"Authorization": "Bearer " + self.token1},
            data={"bio": ""},
        ).content
        resp = requests.get(BASE_URL + "/user/1").json()
        assert resp == {
            "id": 1,
            "name": "user1",
            "email": "user1@mail.com",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate()
        }

    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_create",
            "TestUserBasic::test_log_in",
            "TestUserBasic::test_get",
        ]
    )
    def test_set_picture(self):
        resp = requests.post(
            BASE_URL + "/user/setPicture",
            headers={"Authorization": "Bearer " + self.token1},
            data={"picture": IMAGE_DATA},
        ).content
        resp = requests.get(BASE_URL + "/user/1").json()
        assert resp == {
            "id": 1,
            "name": "user1",
            "email": "user1@mail.com",
            "bio": "",
            "picture": IMAGE_PFP_DATA,
            "regDate": getIsoDate()
        }
        resp = requests.get(BASE_URL + "/user/2").json()
        assert resp == {
            "id": 2,
            "name": "user2",
            "email": "user2@mail.com",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate()
        }


class TestAdvert(LoggedInTestBase):
    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_log_in",
        ]
    )
    def test_create(self):
        resp = requests.post(
            BASE_URL + "/adverts",
            headers={"Authorization": "Bearer " + self.token1},
            data={
                "title": "Test advertisement",
                "description": "This is the description of the test advertisement.",
                "locationId": 1171,
                "priceHuf": 15000,
                "stateId": 4,
                "modelId": 16,
            },
        ).json()
        assert resp == {"id": 1}

    @pytest.mark.dependency(
        [
            "TestAdvert::test_create",
        ]
    )
    def test_get(self):
        resp = requests.get(
            BASE_URL + "/adverts/1",
        ).json()
        assert resp == {
            "id": 1,
            "isSold": 0,
            "title": "Test advertisement",
            "description": "This is the description of the test advertisement.",
            "locationId": 1171,
            "priceHuf": 15000,
            "stateId": 4,
            "modelId": 16,
            "ownerId": 1,
            "revision": "",
            "viewCount": 1,
            "createdTime": ANY,
        }

    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_log_in",
            "TestAdvert::test_create",
        ]
    )
    def test_modify(self):
        resp = requests.patch(
            BASE_URL + "/adverts/1",
            headers={"Authorization": "Bearer " + self.token1},
            data={
                "description": "This is the NEW description.",
                "priceHuf": 12345,
                "ignoreThis": 123,
                "ownerId": 6,  # Should be ignored
            },
        )

        resp = requests.get(
            BASE_URL + "/adverts/1",
        ).json()
        assert resp == {
            "id": 1,
            "title": "Test advertisement",
            "ownerId": 1,
            "description": "This is the NEW description.",
            "locationId": 1171,
            "priceHuf": 12345,
            "stateId": 4,
            "modelId": 16,
            "revision": "",
            "viewCount": 2,
            "isSold": 0,
            "createdTime": ANY,
        }

    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_log_in",
            "TestAdvert::test_create",
        ]
    )
    def test_add_picture(self):
        resp = requests.post(
            BASE_URL + "/adverts/1/pictures",
            headers={"Authorization": "Bearer " + self.token1},
            data={
                "data": IMAGE_DATA,
                "description": "This is the description of the picture.",
            },
        ).json()
        assert resp == {"id": 1}

    @pytest.mark.dependency(
        depends=[
            "TestAdvert::test_add_picture",
        ]
    )
    def test_get_pictures(self):
        resp = requests.get(
            BASE_URL + "/adverts/1/pictures",
        ).json()
        assert resp == [
            {
                "id": 1,
                "data": IMAGE_AD_DATA,
                "description": "This is the description of the picture.",
                "advertId": 1,
                "isPriority": 0,
            }
        ]
    
    @pytest.mark.dependency(
        depends=[
            "TestAdvert::test_add_picture",
            "TestAdvert::test_get_pictures",
        ]
    )
    def test_modify_picture_description(self):
        resp = requests.patch(
            BASE_URL + "/adverts/1/pictures",
            headers={"Authorization": "Bearer " + self.token1},
            data={
                "id": 1,
                "description": "This is the NEW description of the picture.",
            },
        )
        assert resp.content == b''
        assert resp.status_code == 200

        resp = requests.get(
            BASE_URL + "/adverts/1/pictures",
        ).json()
        assert resp == [
            {
                "id": 1,
                "data": IMAGE_AD_DATA,
                "description": "This is the NEW description of the picture.",
                "advertId": 1,
                "isPriority": 0,
            }
        ]
