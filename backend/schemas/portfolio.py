from pydantic import BaseModel
from typing import Dict

class AccountInfo(BaseModel):
    account_number: str
    status: str
    currency: str
    buying_power: float
    cash: float
    portfolio_value: float
    equity: float
    last_equity: float

class Portfolio(BaseModel):
    account_value: float
    buying_power: float
    cash: float
    positions_value: float
    total_pl: float
    total_pl_percent: float
    day_pl: float
    positions_count: int
    margin_used: float
    margin_available: float

class PortfolioAnalytics(BaseModel):
    exposure_by_sector: Dict[str, float]
    exposure_by_asset_type: Dict[str, float]
    concentration_risk: float
    beta: float
    sharpe_ratio: float
    sortino_ratio: float
