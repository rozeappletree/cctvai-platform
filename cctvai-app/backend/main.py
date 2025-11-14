from fastapi import Depends, FastAPI, HTTPException, status, UploadFile, File
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from pydantic import BaseModel
from typing import Optional
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import xml.etree.ElementTree as ET  # Import for XML parsing

load_dotenv()

# --- Configuration ---
SECRET_KEY = os.getenv("SECRET_KEY")
USERNAME = os.getenv("USERNAME")
PASSWORD = os.getenv("PASSWORD")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


# --- Models ---
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    username: Optional[str] = None


class User(BaseModel):
    username: str
    email: Optional[str] = None
    full_name: Optional[str] = None
    disabled: Optional[bool] = None


# --- Security ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# --- Database (in-memory) ---
fake_user = User(
    username=USERNAME,
    full_name="Test User",
    email="testuser@example.com",
    disabled=False,
)


# --- Helper Functions ---
def get_user(username: str):
    if username == fake_user.username:
        return fake_user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user


# --- FastAPI App ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allows frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if not (form_data.username == USERNAME and form_data.password == PASSWORD):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": USERNAME}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/dashboard/")
async def read_dashboard(current_user: User = Depends(get_current_active_user)):
    return {"message": f"Welcome to your dashboard, {current_user.full_name}!"}


EXPECTED_CONFIG_FILE = """<cameras><camera id="CAM-A1X" ip="10.12.34.5" rtsp="rtsp://u1:p1@10.12.34.5/"/><camera id="CAM-B7Q" ip="10.88.22.14" rtsp="rtsp://u2:p2@10.88.22.14/"/><camera id="CAM-C9M" ip="192.168.42.77" rtsp="rtsp://u3:p3@192.168.42.77/"/><camera id="CAM-D4Z" ip="172.16.8.201" rtsp="rtsp://u4:p4@172.16.8.201/"/><meta version="1.0" generated="TS-001"/></cameras>"""


@app.post("/validate-config")
async def validate_config(
    config_file: UploadFile = File(...),
    current_user: User = Depends(get_current_active_user),
):
    """
    Validates an uploaded XML configuration file.
    """
    if not config_file.filename.endswith(".xml"):

        return {"valid": False, "message": "Only XML files are allowed."}

    try:
        content = await config_file.read()
        ET.fromstring(content.decode("utf-8"))
        # Add more specific validation logic here if needed
        data = content.decode("utf-8").strip()
        expected = EXPECTED_CONFIG_FILE.strip()
        if data != expected:
            print(data, len(data))
            print(expected, len(expected))
            return {
                "valid": False,
                "message": "Invalid config file, please check your file.",
            }
        return {"valid": True, "message": "Configuration file is valid XML."}
    except ET.ParseError:
        return {"valid": False, "message": "Invalid XML format."}
    except Exception as e:
        return {"valid": False, "message": f"An error occurred during validation: {e}"}
