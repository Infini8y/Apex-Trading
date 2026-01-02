from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import numpy as np
from scipy import stats
from backend.services.execution_engine import ExecutionEngine

class RiskEngine:
    def __init__(self):
        self.execution_engine = ExecutionEngine()
        self.risk_limits = {
            "max_position_size": 10000,
            "max_portfolio_risk": 0.02,
            "max_position_risk": 0.01,
            "max_daily_loss": 1000,
            "max_drawdown": 0.15
        }

    async def get_account_info(self, user_id: str) -> Dict[str, Any]:
        if self.execution_engine.alpaca:
            try:
                account = self.execution_engine.alpaca.get_account()
                return {
                    "account_number": account.account_number,
                    "status": account.status.value,
                    "currency": account.currency,
                    "buying_power": float(account.buying_power),
                    "cash": float(account.cash),
                    "portfolio_value": float(account.portfolio_value),
                    "equity": float(account.equity),
                    "last_equity": float(account.last_equity),
                    "multiplier": int(account.multiplier),
                    "initial_margin": float(account.initial_margin),
                    "maintenance_margin": float(account.maintenance_margin),
                    "daytrade_count": int(account.daytrade_count),
                    "daytrading_buying_power": float(account.daytrading_buying_power),
                    "regt_buying_power": float(account.regt_buying_power)
                }
            except Exception as e:
                print(f"Error fetching account: {e}")
        
        return {
            "account_number": "PAPER001",
            "status": "ACTIVE",
            "currency": "USD",
            "buying_power": 100000.0,
            "cash": 100000.0,
            "portfolio_value": 100000.0,
            "equity": 100000.0,
            "last_equity": 100000.0
        }

    async def get_portfolio_summary(self, user_id: str) -> Dict[str, Any]:
        account = await self.get_account_info(user_id)
        positions = await self.execution_engine.get_positions(user_id)
        
        total_pl = sum(pos.get("unrealized_pl", 0) for pos in positions)
        total_value = sum(pos.get("market_value", 0) for pos in positions)
        
        return {
            "account_value": account["portfolio_value"],
            "buying_power": account["buying_power"],
            "cash": account["cash"],
            "positions_value": total_value,
            "total_pl": total_pl,
            "total_pl_percent": (total_pl / account["last_equity"]) * 100 if account["last_equity"] > 0 else 0,
            "day_pl": total_pl,
            "positions_count": len(positions),
            "margin_used": account.get("initial_margin", 0),
            "margin_available": account["buying_power"]
        }

    async def get_portfolio_analytics(self, user_id: str) -> Dict[str, Any]:
        positions = await self.execution_engine.get_positions(user_id)
        
        by_sector = {}
        by_asset_type = {"stocks": 0, "options": 0, "futures": 0, "crypto": 0}
        
        for pos in positions:
            sector = self._get_sector(pos["symbol"])
            by_sector[sector] = by_sector.get(sector, 0) + pos.get("market_value", 0)
            by_asset_type["stocks"] += pos.get("market_value", 0)
        
        return {
            "exposure_by_sector": by_sector,
            "exposure_by_asset_type": by_asset_type,
            "concentration_risk": self._calculate_concentration(positions),
            "beta": 1.0,
            "sharpe_ratio": 1.5,
            "sortino_ratio": 2.0
        }

    async def calculate_risk_metrics(self, user_id: str) -> Dict[str, Any]:
        account = await self.get_account_info(user_id)
        positions = await self.execution_engine.get_positions(user_id)
        
        portfolio_value = account["portfolio_value"]
        var_95 = self._calculate_var(positions, 0.95)
        var_99 = self._calculate_var(positions, 0.99)
        
        return {
            "portfolio_value": portfolio_value,
            "cash_percent": (account["cash"] / portfolio_value) * 100 if portfolio_value > 0 else 100,
            "leverage": (portfolio_value - account["cash"]) / portfolio_value if portfolio_value > 0 else 0,
            "var_95": var_95,
            "var_99": var_99,
            "expected_shortfall": var_99 * 1.2,
            "max_drawdown": 0.05,
            "volatility": 0.15,
            "beta": 1.0
        }

    async def calculate_portfolio_greeks(self, user_id: str) -> Dict[str, Any]:
        positions = await self.execution_engine.get_positions(user_id)
        
        total_delta = 0
        total_gamma = 0
        total_theta = 0
        total_vega = 0
        
        for pos in positions:
            if "option" in pos.get("symbol", "").lower():
                total_delta += pos.get("qty", 0) * 0.5
                total_gamma += pos.get("qty", 0) * 0.05
                total_theta += pos.get("qty", 0) * -0.02
                total_vega += pos.get("qty", 0) * 0.1
        
        return {
            "delta": total_delta,
            "gamma": total_gamma,
            "theta": total_theta,
            "vega": total_vega,
            "rho": 0.0
        }

    def _calculate_var(self, positions: List[Dict], confidence: float) -> float:
        if not positions:
            return 0.0
        
        returns = [pos.get("unrealized_plpc", 0) for pos in positions]
        if not returns:
            return 0.0
        
        return abs(np.percentile(returns, (1 - confidence) * 100)) * 100

    def _calculate_concentration(self, positions: List[Dict]) -> float:
        if not positions:
            return 0.0
        
        total_value = sum(pos.get("market_value", 0) for pos in positions)
        if total_value == 0:
            return 0.0
        
        max_position = max(pos.get("market_value", 0) for pos in positions)
        return (max_position / total_value) * 100

    def _get_sector(self, symbol: str) -> str:
        sector_map = {
            "AAPL": "Technology",
            "MSFT": "Technology",
            "GOOGL": "Technology",
            "TSLA": "Automotive",
            "JPM": "Finance",
            "BAC": "Finance"
        }
        return sector_map.get(symbol, "Other")

    async def check_risk_limits(self, user_id: str, order: Dict) -> Dict[str, Any]:
        account = await self.get_account_info(user_id)
        positions = await self.execution_engine.get_positions(user_id)
        
        violations = []
        
        order_value = order["qty"] * order.get("limit_price", 100)
        if order_value > self.risk_limits["max_position_size"]:
            violations.append(f"Order exceeds max position size: {order_value} > {self.risk_limits['max_position_size']}")
        
        total_exposure = sum(pos.get("market_value", 0) for pos in positions) + order_value
        portfolio_risk = total_exposure / account["portfolio_value"]
        if portfolio_risk > self.risk_limits["max_portfolio_risk"]:
            violations.append(f"Portfolio risk exceeded: {portfolio_risk:.2%}")
        
        return {
            "approved": len(violations) == 0,
            "violations": violations,
            "risk_score": portfolio_risk
        }
