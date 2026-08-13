import requests

# Replace with your actual access token
ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg2NjM5Nzc3LCJpYXQiOjE3ODY1NTMzNzcsImp0aSI6IjgxMjRhZjQ5OGUyODQxNDE5NzUzOGI4NWNiMzNiZWZiIiwidXNlcl9pZCI6ImExMzU2NDlkLThlMGYtNGYyNC05ODE5LWVhNDUwOGI2MzlkZiJ9.qtynGUEVVVsjDUazgfsk4F7MM79VvkvfEmGP7h2F0jI"

url = "http://127.0.0.1:8000/api/prescriptions/upload/"

headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}"
}

# Replace with the actual path to an image on your computer
file_path = r"D:\saadi.com\assets\images (1).jpg"

with open(file_path, "rb") as f:
    files = {"file": f}
    response = requests.post(url, headers=headers, files=files)

print(response.status_code)
print(response.json())