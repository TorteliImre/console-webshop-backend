# pylint: disable=missing-timeout,line-too-long,missing-final-newline,missing-module-docstring,missing-function-docstring,invalid-name

import unittest
import requests
import json

BASE_URL = "http://localhost:3000"

class MainTest(unittest.TestCase):
    """Main test"""

    def test(self):
        with self.subTest("Create users"):
            resp = requests.post(BASE_URL+"/user/create", data={"name": "user1", "email": "user1@mail.com", "password": "pass123"}).json()
            self.assertEqual(resp, {"id": 1})

            resp = requests.post(BASE_URL+"/user/create", data={"name": "user2", "email": "user2@mail.com", "password": "pass123"}).json()
            self.assertEqual(resp, {"id": 2})

        with self.subTest("Get users"):
            resp = requests.get(BASE_URL+"/user/1").json()
            self.assertEqual(resp, {'id': 1, 'name': 'user1', 'email': 'user1@mail.com', 'bio': None, 'picture': None})

            resp = requests.get(BASE_URL+"/user/2").json()
            self.assertEqual(resp, {'id': 2, 'name': 'user2', 'email': 'user2@mail.com', 'bio': None, 'picture': None})

        with self.subTest("Log in"):
            resp = requests.post(BASE_URL+"/auth/login", data={"name": "user1", "password": "pass123"}).json()
            self.assertTrue(list(resp.keys()) == ["access_token"])
            token1 = resp["access_token"]

            resp = requests.post(BASE_URL+"/auth/login", data={"name": "user2", "password": "pass123"}).json()
            self.assertTrue(list(resp.keys()) == ["access_token"])
            token2 = resp["access_token"]

        with self.subTest("Set bio"):
            resp = requests.post(BASE_URL+"/user/setBio", headers={"Authorization": "Bearer "+token1}, data={"bio": "This is the bio of user1."}).content
            resp = requests.get(BASE_URL+"/user/1").json()
            self.assertEqual(resp, {'id': 1, 'name': 'user1', 'email': 'user1@mail.com', 'bio': "This is the bio of user1.", 'picture': None})
            resp = requests.get(BASE_URL+"/user/2").json()
            self.assertEqual(resp, {'id': 2, 'name': 'user2', 'email': 'user2@mail.com', 'bio': None, 'picture': None})

            resp = requests.post(BASE_URL+"/user/setBio", headers={"Authorization": "Bearer "+token1}, data={"bio": None}).content
            print(resp)
            resp = requests.get(BASE_URL+"/user/1").json()
            print(resp)
            self.assertEqual(resp, {'id': 1, 'name': 'user1', 'email': 'user1@mail.com', 'bio': None, 'picture': None})

        with self.subTest("Set profile picture"):
            #resp = requests.post(BASE_URL+"/user/setBio", headers={"Authorization": "Bearer "+token1}, data={"bio": "This is the bio of user1."}).content
            #resp = requests.get(BASE_URL+"/user/1").json()
            #self.assertEqual(resp, {'id': 1, 'name': 'user1', 'email': 'user1@mail.com', 'bio': "This is the bio of user1.", 'picture': None})
            #resp = requests.get(BASE_URL+"/user/2").json()
            #self.assertEqual(resp, {'id': 2, 'name': 'user1', 'email': 'user1@mail.com', 'bio': None, 'picture': None})
            pass


if __name__ == '__main__':
    unittest.main()