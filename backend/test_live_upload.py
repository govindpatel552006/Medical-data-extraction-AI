import requests

# Log in first to get a fresh token
LOGIN_URL = "https://medical-data-extraction-ai-1.onrender.com/api/accounts/login/"
UPLOAD_URL = "https://medical-data-extraction-ai-1.onrender.com/api/prescriptions/upload/"

login_data = {
    "email": "govindpatel2510734@gmail.com",
    "password": "123456"
}

print("Logging in...")
login_response = requests.post(LOGIN_URL, json=login_data)
print(login_response.status_code, login_response.text)

if login_response.status_code != 200:
    print("Login failed, stopping.")
    exit()

access_token = login_response.json()["access"]

file_path = r"D:\downloads\rahul_records.jpg"

headers = {"Authorization": f"Bearer {access_token}"}

print("Uploading...")
with open(file_path, "rb") as f:
    files = {"file": f}
    upload_response = requests.post(UPLOAD_URL, headers=headers, files=files)

print(upload_response.status_code)

# Save full HTML response to a file for easy searching
with open("error_output.html", "w", encoding="utf-8") as out:
    out.write(upload_response.text)

print("Full error saved to error_output.html")