import requests

ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzg2NjM5Nzc3LCJpYXQiOjE3ODY1NTMzNzcsImp0aSI6IjgxMjRhZjQ5OGUyODQxNDE5NzUzOGI4NWNiMzNiZWZiIiwidXNlcl9pZCI6ImExMzU2NDlkLThlMGYtNGYyNC05ODE5LWVhNDUwOGI2MzlkZiJ9.qtynGUEVVVsjDUazgfsk4F7MM79VvkvfEmGP7h2F0jI"
PRESCRIPTION_ID = "d9dc8e66-dec9-48b2-819b-4d15af4a5b8e"

url = f"http://127.0.0.1:8000/api/dietplan/generate/{PRESCRIPTION_ID}/?force=true"

headers = {
    "Authorization": f"Bearer {ACCESS_TOKEN}"
}

response = requests.post(url, headers=headers)

print(response.status_code)
print(response.json())