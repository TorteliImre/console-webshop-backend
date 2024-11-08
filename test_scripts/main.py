# pylint: disable=missing-timeout,line-too-long,missing-final-newline,missing-module-docstring,missing-function-docstring,missing-class-docstring,invalid-name

import pytest
import requests

BASE_URL = "http://localhost:3000/api"


class TestUserBasic:
    @pytest.mark.dependency()
    def test_create(self):
        resp = requests.post(
            BASE_URL + "/user/create",
            data={
                "name": "user1",
                "email": "user1@mail.com",
                "password": "pass123",
            },
        ).json()
        assert resp == {"id": 1}

        resp = requests.post(
            BASE_URL + "/user/create",
            data={
                "name": "user2",
                "email": "user2@mail.com",
                "password": "pass123",
            },
        ).json()
        assert resp == {"id": 2}

        resp = requests.post(
            BASE_URL + "/user/create",
            data={
                "name": "user3",
                "email": "user3@mail.com",
                "password": "pass123",
            },
        ).json()
        assert resp == {"id": 3}

    @pytest.mark.dependency(depends=["TestUserBasic::test_create"])
    def test_get(self):
        resp = requests.get(BASE_URL + "/user/1").json()
        assert resp == {
            "id": 1,
            "name": "user1",
            "email": "user1@mail.com",
            "bio": "",
            "picture": "",
        }

        resp = requests.get(BASE_URL + "/user/2").json()
        assert resp == {
            "id": 2,
            "name": "user2",
            "email": "user2@mail.com",
            "bio": "",
            "picture": "",
        }

        resp = requests.get(BASE_URL + "/user/3").json()
        assert resp == {
            "id": 3,
            "name": "user3",
            "email": "user3@mail.com",
            "bio": "",
            "picture": "",
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
        }
        resp = requests.get(BASE_URL + "/user/2").json()
        assert resp == {
            "id": 2,
            "name": "user2",
            "email": "user2@mail.com",
            "bio": "",
            "picture": "",
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
            data={"picture": open("data/picture.txt", "r").read()},
        ).content
        resp = requests.get(BASE_URL + "/user/1").json()
        assert resp == {
            "id": 1,
            "name": "user1",
            "email": "user1@mail.com",
            "bio": "",
            "picture": open("data/picture-resized.txt", "r").read(),
        }
        resp = requests.get(BASE_URL + "/user/2").json()
        assert resp == {
            "id": 2,
            "name": "user2",
            "email": "user2@mail.com",
            "bio": "",
            "picture": "",
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
            "viewCount": 0,
        }

    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_log_in",
            "TestAdvert::test_create",
        ]
    )
    def test_modify(self):
        resp = requests.patch(
            BASE_URL + "/adverts",
            headers={"Authorization": "Bearer " + self.token1},
            data={
                "id": 1,
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
            "viewCount": 0,
            "isSold": 0,
        }

    @pytest.mark.dependency(
        depends=[
            "TestUserBasic::test_log_in",
            "TestAdvert::test_create",
        ]
    )
    def test_add_picture(self):
        resp = requests.post(
            BASE_URL + "/adverts/pictures",
            headers={"Authorization": "Bearer " + self.token1},
            data={
                "advertId": 1,
                "data": open("data/picture.txt", "r").read(),
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
                "data": open("data/picture-resized-advert.txt", "r").read(),
                "description": "This is the description of the picture.",
                "advertId": 1,
                "isPriority": 0,
            }
        ]
