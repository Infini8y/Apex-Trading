from pydantic import BaseModel
from typing import Dict, Optional

class WorkspaceCreate(BaseModel):
    name: str
    layout: Dict
    is_default: bool = False

class WorkspaceUpdate(BaseModel):
    name: Optional[str] = None
    layout: Optional[Dict] = None
    is_default: Optional[bool] = None

class WorkspaceResponse(BaseModel):
    id: int
    user_id: int
    name: str
    layout: Dict
    is_default: bool
    
    class Config:
        from_attributes = True
