import base64
import hashlib
import hmac
import json
from datetime import datetime, timedelta, timezone
from typing import Any

from ..core.config import settings


class TokenUtil:
    @staticmethod
    def generate_token(subject: str, extra_claims: dict[str, Any] | None = None) -> str:
        expire_at = datetime.now(timezone.utc) + timedelta(minutes=settings.JWT_EXPIRE_MINUTES)
        payload = {
            "sub": subject,
            "exp": int(expire_at.timestamp()),
        }
        if extra_claims:
            payload.update(extra_claims)
        header = {
            "alg": settings.JWT_ALGORITHM,
            "typ": "JWT",
        }
        encoded_header = TokenUtil._base64url_encode(header)
        encoded_payload = TokenUtil._base64url_encode(payload)
        signing_input = f"{encoded_header}.{encoded_payload}"
        signature = TokenUtil._sign(signing_input)
        return f"{signing_input}.{signature}"

    @staticmethod
    def decode_token(token: str) -> dict[str, Any]:
        parts = token.split(".")
        if len(parts) != 3:
            raise ValueError("invalid token format")

        encoded_header, encoded_payload, signature = parts
        signing_input = f"{encoded_header}.{encoded_payload}"
        expected_signature = TokenUtil._sign(signing_input)
        if not hmac.compare_digest(signature, expected_signature):
            raise ValueError("invalid token signature")

        header = TokenUtil._base64url_decode(encoded_header)
        if header.get("alg") != settings.JWT_ALGORITHM:
            raise ValueError("invalid token algorithm")

        payload = TokenUtil._base64url_decode(encoded_payload)
        exp = payload.get("exp")
        if exp is not None and datetime.now(timezone.utc).timestamp() > exp:
            raise ValueError("token has expired")
        return payload

    @staticmethod
    def _base64url_encode(data: dict[str, Any]) -> str:
        raw = json.dumps(data, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
        return base64.urlsafe_b64encode(raw).rstrip(b"=").decode("utf-8")

    @staticmethod
    def _base64url_decode(data: str) -> dict[str, Any]:
        padding = "=" * (-len(data) % 4)
        raw = base64.urlsafe_b64decode((data + padding).encode("utf-8"))
        return json.loads(raw.decode("utf-8"))

    @staticmethod
    def _sign(signing_input: str) -> str:
        if settings.JWT_ALGORITHM != "HS256":
            raise ValueError("only HS256 is supported by the current token utility")
        digest = hmac.new(
            settings.JWT_SECRET_KEY.encode("utf-8"),
            signing_input.encode("utf-8"),
            hashlib.sha256,
        ).digest()
        return base64.urlsafe_b64encode(digest).rstrip(b"=").decode("utf-8")
