from pydantic import BaseModel
from typing import Dict, Optional

class Signal(BaseModel):
    symbol: str
    type: str
    confidence: float
    price_target: float
    stop_loss: float
    timestamp: str
    indicators: Dict[str, float]

class SignalCreate(BaseModel):
    symbol: str
    type: str
    confidence: float

class SignalConfig(BaseModel):
    enabled: bool
    min_confidence: float
    symbols: list[str]
    notification_channels: list[str]
