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
            "bio": "",
            "picture": "",
            "regDate": getIsoDate(),
        }
        assert resp.status_code == 200

        resp = requests.get(BASE_URL + "/user/2")
        assert resp.json() == {
            "id": 2,
            "name": "user2",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate(),
        }
        assert resp.status_code == 200

        resp = requests.get(BASE_URL + "/user/3")
        assert resp.json() == {
            "id": 3,
            "name": "user3",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate(),
        }
        assert resp.status_code == 200

    @pytest.mark.dependency(depends=["TestUserBasic::test_create"])
    def test_log_in(self):
        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user1", "password": "pass123"}
        )
        assert resp.json() == {"access_token": ANY}
        assert resp.status_code == 201
        self.token1 = resp.json()["access_token"]

        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user2", "password": "pass123"}
        )
        assert resp.json() == {"access_token": ANY}
        assert resp.status_code == 201
        self.token2 = resp.json()["access_token"]

        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user3", "password": "pass123"}
        )
        assert resp.json() == {"access_token": ANY}
        assert resp.status_code == 201
        self.token3 = resp.json()["access_token"]


class LoggedInTestBase:
    def setup_method(self, method):
        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user1", "password": "pass123"}
        )
        assert resp.json() == {"access_token": ANY}
        assert resp.status_code == 201
        self.token1 = resp.json()["access_token"]

        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user2", "password": "pass123"}
        )
        assert resp.json() == {"access_token": ANY}
        assert resp.status_code == 201
        self.token2 = resp.json()["access_token"]

        resp = requests.post(
            BASE_URL + "/auth/login", data={"name": "user3", "password": "pass123"}
        )
        assert resp.json() == {"access_token": ANY}
        assert resp.status_code == 201
        self.token3 = resp.json()["access_token"]


class TestUser(LoggedInTestBase):
    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_create",
            "TestUserBasic::test_log_in",
            "TestUserBasic::test_get",
        ]
    )
    def test_set_bio(self):
        resp = requests.patch(
            BASE_URL + "/user",
            headers={"Authorization": "Bearer " + self.token1},
            data={"bio": "This is the bio of user1."},
        )
        assert resp.content == b""
        assert resp.status_code == 200

        resp = requests.get(BASE_URL + "/user/1")
        assert resp.json() == {
            "id": 1,
            "name": "user1",
            "bio": "This is the bio of user1.",
            "picture": "",
            "regDate": getIsoDate(),
        }
        assert resp.status_code == 200

        resp = requests.get(BASE_URL + "/user/2")
        assert resp.json() == {
            "id": 2,
            "name": "user2",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate(),
        }
        assert resp.status_code == 200

        resp = requests.patch(
            BASE_URL + "/user",
            headers={"Authorization": "Bearer " + self.token2},
            data={"bio": ""},
        )
        assert resp.content == b""
        assert resp.status_code == 200

        resp = requests.get(BASE_URL + "/user/2")
        assert resp.json() == {
            "id": 2,
            "name": "user2",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate(),
        }
        assert resp.status_code == 200

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
        )
        assert resp.content == b""
        assert resp.status_code == 201

        resp = requests.get(BASE_URL + "/user/1")
        assert resp.json() == {
            "id": 1,
            "name": "user1",
            "bio": "This is the bio of user1.",
            "picture": IMAGE_PFP_DATA,
            "regDate": getIsoDate(),
        }
        assert resp.status_code == 200

        resp = requests.get(BASE_URL + "/user/2")
        assert resp.json() == {
            "id": 2,
            "name": "user2",
            "bio": "",
            "picture": "",
            "regDate": getIsoDate(),
        }
        assert resp.status_code == 200

    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_create",
            "TestUserBasic::test_log_in",
            "TestUserBasic::test_get",
        ]
    )
    def test_set_email(self):
        resp = requests.patch(
            BASE_URL + "/user",
            headers={"Authorization": "Bearer " + self.token2},
            data={"email": "new@mail.com"},
        )
        assert resp.content == b""
        assert resp.status_code == 200

        resp = requests.get(BASE_URL + "/user",
            headers={"Authorization": "Bearer " + self.token2},
        )
        assert resp.json() == {
            "id": 2,
            "name": "user2",
            "bio": ANY,
            "picture": "",
            "regDate": getIsoDate(),
            "email": "new@mail.com",
        }
        assert resp.status_code == 200

    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_create",
        ]
    )
    def test_find_users(self):
        resp = requests.get(
            BASE_URL + "/user/find",
            params={
                "name": "user",
                "count": 2,
            },
        )
        print(f"Got: {resp.json()}")
        assert resp.json() == {
            "items": [
                {
                    "id": 1,
                    "name": "user1",
                    "bio": "This is the bio of user1.",
                    "picture": IMAGE_PFP_DATA,
                    "regDate": getIsoDate(),
                },
                {
                    "id": 2,
                    "name": "user2",
                    "bio": "",
                    "picture": "",
                    "regDate": getIsoDate(),
                },
            ],
            "resultCount": 3,
        }
        assert resp.status_code == 200


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
        )
        assert resp.json() == {"id": 1}
        assert resp.status_code == 201

        resp = requests.post(
            BASE_URL + "/adverts",
            headers={"Authorization": "Bearer " + self.token2},
            data={
                "title": "Eladó PS3",
                "description": "Jó állapotú Sony PlayStation 3",
                "locationId": 1492,
                "priceHuf": 20000,
                "stateId": 3,
                "modelId": 11,
            },
        )
        assert resp.json() == {"id": 2}
        assert resp.status_code == 201

    @pytest.mark.dependency(
        [
            "TestAdvert::test_create",
        ]
    )
    def test_get(self):
        resp = requests.get(
            BASE_URL + "/adverts/1",
        )
        assert resp.json() == {
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
        assert resp.status_code == 200

    @pytest.mark.dependency(
        depends=[
            "TestAdvert::test_create",
        ]
    )
    def test_find(self):
        resp = requests.get(
            BASE_URL + "/adverts",
            params={
                "skip": 0,
                "count": 50,
                "priceHufMin": 10000,
                "priceHufMax": 30000,
                "sortBy": "priceHuf",
                "sortOrder": "DESC",
            },
        )
        assert resp.json() == {
            "items": [
                {
                    "id": 2,
                    "createdTime": ANY,
                    "title": "Eladó PS3",
                    "ownerId": 2,
                    "description": "Jó állapotú Sony PlayStation 3",
                    "locationId": 1492,
                    "priceHuf": 20000,
                    "stateId": 3,
                    "modelId": 11,
                    "revision": "",
                    "viewCount": 0,
                    "isSold": 0,
                },
                {
                    "id": 1,
                    "createdTime": ANY,
                    "title": "Test advertisement",
                    "ownerId": 1,
                    "description": "This is the description of the test advertisement.",
                    "locationId": 1171,
                    "priceHuf": 15000,
                    "stateId": 4,
                    "modelId": 16,
                    "revision": "",
                    "viewCount": 1,
                    "isSold": 0,
                },
            ],
            "resultCount": 2,
        }
        assert resp.status_code == 200

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
        assert resp.content == b""
        assert resp.status_code == 200

        resp = requests.get(
            BASE_URL + "/adverts/1",
        )
        assert resp.json() == {
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
        assert resp.status_code == 200

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
        )
        assert resp.json() == {"id": 1}
        assert resp.status_code == 201

    @pytest.mark.dependency(
        depends=[
            "TestAdvert::test_add_picture",
        ]
    )
    def test_get_pictures(self):
        resp = requests.get(
            BASE_URL + "/adverts/1/pictures",
        )
        assert resp.json() == [
            {
                "id": 1,
                "data": IMAGE_AD_DATA,
                "description": "This is the description of the picture.",
                "advertId": 1,
                "isPriority": 0,
            }
        ]
        assert resp.status_code == 200

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
        assert resp.content == b""
        assert resp.status_code == 200

        resp = requests.get(
            BASE_URL + "/adverts/1/pictures",
        )
        assert resp.json() == [
            {
                "id": 1,
                "data": IMAGE_AD_DATA,
                "description": "This is the NEW description of the picture.",
                "advertId": 1,
                "isPriority": 0,
            }
        ]
        assert resp.status_code == 200
