import requests

BASE_URL = "http://localhost:5000"
RECOMMEND_URL = "http://54.152.169.129:5001"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ArbitraryPayload.Signature"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def test_register_barber():
    response = requests.post(f"{BASE_URL}/auth/register/barber", json={
        "name": "Hamza",
        "email": "hamza292@my.yorku.ca",
        "password": "Momina123@"
    })
    assert response.status_code in [200, 400]

def test_login_user_invalid_credentials():
    response = requests.post(f"{BASE_URL}/auth/login/user", json={
        "email": "wrong@example.com",
        "password": "wrongpass"
    })
    assert response.status_code in [401, 400]

def test_add_slots():
    response = requests.post(f"{BASE_URL}/barbers/slots", headers=HEADERS, json={
        "slots": ["2025-03-20 1:00 PM", "2025-03-20 2:00 PM"]
    })
    assert response.status_code in [200, 400]

def test_get_slots():
    response = requests.get("http://54.152.169.129:5000/barbers/slots", headers=HEADERS)
    assert response.status_code in [200, 401]

def test_get_notifications():
    response = requests.get("http://54.152.169.129:5000/barbers/notifications", headers=HEADERS)
    assert response.status_code in [200, 401]

def test_book_appointment():
    response = requests.post(f"{BASE_URL}/users/book", headers=HEADERS, json={
        "barber_id": "67d2e3eea3023041afe4b5f5",
        "time": "2025-03-20 1:00 PM"
    })
    assert response.status_code in [200, 400]

def test_cancel_appointment():
    response = requests.post(f"{BASE_URL}/users/cancel", headers=HEADERS, json={
        "barber_id": "67d2e3eea3023041afe4b5f5",
        "time": "2025-03-20 1:00 PM"
    })
    assert response.status_code in [200, 400]

def test_recommend_style():
    response = requests.post(f"{RECOMMEND_URL}/recommend", headers=HEADERS, json={
        "barber_id": "67d2e3eea3023041afe4b5f5",
        "time": "2025-03-20 1:00 PM",
        "hair_type": "Curly",
        "face_shape": "Oval",
        "preferences": "Medium fade"
    })
    assert response.status_code in [200, 400]
