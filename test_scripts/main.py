#!/usr/bin/env python3

# pylint: disable=missing-timeout,line-too-long,missing-final-newline,missing-module-docstring,missing-function-docstring,missing-class-docstring,invalid-name

import unittest
import requests

BASE_URL = "http://localhost:3000/api"


class MainTest(unittest.TestCase):
    def test(self):
        with self.subTest("Create users"):
            resp = requests.post(
                BASE_URL + "/user/create",
                data={
                    "name": "user1",
                    "email": "user1@mail.com",
                    "password": "pass123",
                },
            ).json()
            self.assertEqual(resp, {"id": 1})

            resp = requests.post(
                BASE_URL + "/user/create",
                data={
                    "name": "user2",
                    "email": "user2@mail.com",
                    "password": "pass123",
                },
            ).json()
            self.assertEqual(resp, {"id": 2})

        with self.subTest("Get users"):
            resp = requests.get(BASE_URL + "/user/1").json()
            self.assertEqual(
                resp,
                {
                    "id": 1,
                    "name": "user1",
                    "email": "user1@mail.com",
                    "bio": "",
                    "picture": "",
                },
            )

            resp = requests.get(BASE_URL + "/user/2").json()
            self.assertEqual(
                resp,
                {
                    "id": 2,
                    "name": "user2",
                    "email": "user2@mail.com",
                    "bio": "",
                    "picture": "",
                },
            )

        with self.subTest("Log in"):
            resp = requests.post(
                BASE_URL + "/auth/login", data={"name": "user1", "password": "pass123"}
            ).json()
            self.assertTrue(list(resp.keys()) == ["access_token"])
            token1 = resp["access_token"]

            resp = requests.post(
                BASE_URL + "/auth/login", data={"name": "user2", "password": "pass123"}
            ).json()
            self.assertTrue(list(resp.keys()) == ["access_token"])
            token2 = resp["access_token"]

        with self.subTest("Set bio"):
            resp = requests.post(
                BASE_URL + "/user/setBio",
                headers={"Authorization": "Bearer " + token1},
                data={"bio": "This is the bio of user1."},
            ).content
            resp = requests.get(BASE_URL + "/user/1").json()
            self.assertEqual(
                resp,
                {
                    "id": 1,
                    "name": "user1",
                    "email": "user1@mail.com",
                    "bio": "This is the bio of user1.",
                    "picture": "",
                },
            )
            resp = requests.get(BASE_URL + "/user/2").json()
            self.assertEqual(
                resp,
                {
                    "id": 2,
                    "name": "user2",
                    "email": "user2@mail.com",
                    "bio": "",
                    "picture": "",
                },
            )

            resp = requests.post(
                BASE_URL + "/user/setBio",
                headers={"Authorization": "Bearer " + token1},
                data={"bio": ""},
            ).content
            resp = requests.get(BASE_URL + "/user/1").json()
            self.assertEqual(
                resp,
                {
                    "id": 1,
                    "name": "user1",
                    "email": "user1@mail.com",
                    "bio": "",
                    "picture": "",
                },
            )

        with self.subTest("Set profile picture"):
            resp = requests.post(
                BASE_URL + "/user/setBio",
                headers={"Authorization": "Bearer " + token1},
                data={"bio": "This is the bio of user1."},
            ).content
            resp = requests.get(BASE_URL + "/user/1").json()
            self.assertEqual(
                resp,
                {
                    "id": 1,
                    "name": "user1",
                    "email": "user1@mail.com",
                    "bio": "This is the bio of user1.",
                    "picture": "",
                },
            )
            resp = requests.get(BASE_URL + "/user/2").json()
            self.assertEqual(
                resp,
                {
                    "id": 2,
                    "name": "user2",
                    "email": "user2@mail.com",
                    "bio": "",
                    "picture": "",
                },
            )

        with self.subTest("Create advertisement"):
            resp = requests.post(
                BASE_URL + "/advert/create",
                headers={"Authorization": "Bearer " + token1},
                data={
                    "title": "Test advertisement",
                    "description": "This is the description of the test advertisement.",
                    "locationId": 1171,
                    "priceHuf": 15000,
                    "stateId": 4,
                    "manufacturerId": 3,
                    "modelId": 16,
                },
            ).json()
            self.assertEqual(resp, {"id": 1})

        with self.subTest("Get advertisement"):
            resp = requests.get(
                BASE_URL + "/advert/1",
            ).json()
            self.assertEqual(
                resp,
                {
                    "id": 1,
                    "isSold": 0,
                    "title": "Test advertisement",
                    "description": "This is the description of the test advertisement.",
                    "locationId": 1171,
                    "priceHuf": 15000,
                    "stateId": 4,
                    "manufacturerId": 3,
                    "modelId": 16,
                    "ownerId": 1,
                    "revision": "",
                    "viewCount": 0,
                },
            )

        with self.subTest("Modify advertisement"):
            resp = requests.patch(
                BASE_URL + "/advert/modify",
                headers={"Authorization": "Bearer " + token1},
                data={
                    "id": 1,
                    "description": "This is the NEW description.",
                    "priceHuf": 12345,
                    "ignoreThis": 123,
                    "ownerId": 6,  # Should be ignored
                },
            )

            resp = requests.get(
                BASE_URL + "/advert/1",
            ).json()
            self.assertEqual(
                resp,
                {
                    "id": 1,
                    "title": "Test advertisement",
                    "ownerId": 1,
                    "description": "This is the NEW description.",
                    "locationId": 1171,
                    "priceHuf": 12345,
                    "stateId": 4,
                    "manufacturerId": 3,
                    "modelId": 16,
                    "revision": "",
                    "viewCount": 0,
                    "isSold": 0,
                },
            )

        with self.subTest("Add picture to advertisement"):
            resp = requests.post(
                BASE_URL + "/advert/addPictureToAdvert",
                headers={"Authorization": "Bearer " + token1},
                data={
                    "advertId": 1,
                    "data": "dGVzdCBwaWN0dXJl",
                    "description": "This is the description of the picture.",
                },
            ).json()
            self.assertEqual(resp, {"id": 1})

        with self.subTest("Getting advert picture"):
            resp = requests.get(
                BASE_URL + "/advert/pictures/1",
            ).json()
            self.assertEqual(
                resp,
                {
                    "id": 1,
                    "advertId": 1,
                    "data": "dGVzdCBwaWN0dXJl",
                    "description": "This is the description of the picture.",
                    "isPriority": 0
                },
            )

if __name__ == "__main__":
    unittest.main()
