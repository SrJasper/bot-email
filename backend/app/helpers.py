import re

def clean_response(raw: str) -> str:
    """
    Remove blocos de markdown como ```json ... ``` e espaços extras.
    """
    return re.sub(r"^```(json)?|```$", "", raw.strip(), flags=re.MULTILINE).strip()
