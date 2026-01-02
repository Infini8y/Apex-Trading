from contextlib import asynccontextmanager
from typing import AsyncGenerator
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
import uvicorn

from backend.core.config import settings
from backend.core.database import init_db, close_db
from backend.core.events import websocket_manager
from backend.api import auth, market_data, orders, positions, portfolio, signals, strategies, scanners, workspaces

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator:
    await init_db()
    await websocket_manager.start()
    yield
    await websocket_manager.stop()
    await close_db()

app = FastAPI(
    title="Apex Trading Platform API",
    description="The most advanced professional trading platform API",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(GZipMiddleware, minimum_size=1000)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(market_data.router, prefix="/api/v1/market-data", tags=["Market Data"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])
app.include_router(positions.router, prefix="/api/v1/positions", tags=["Positions"])
app.include_router(portfolio.router, prefix="/api/v1/portfolio", tags=["Portfolio"])
app.include_router(signals.router, prefix="/api/v1/signals", tags=["AI Signals"])
app.include_router(strategies.router, prefix="/api/v1/strategies", tags=["Strategies"])
app.include_router(scanners.router, prefix="/api/v1/scanners", tags=["Scanners"])
app.include_router(workspaces.router, prefix="/api/v1/workspaces", tags=["Workspaces"])

@app.get("/")
async def root():
    return {
        "name": "Apex Trading Platform",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "1.0.0"}

@app.websocket("/ws/market-data")
async def websocket_market_data(websocket: WebSocket):
    await websocket_manager.connect(websocket, "market_data")
    try:
        while True:
            data = await websocket.receive_json()
            await websocket_manager.handle_message(websocket, data, "market_data")
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket, "market_data")

@app.websocket("/ws/orders")
async def websocket_orders(websocket: WebSocket):
    await websocket_manager.connect(websocket, "orders")
    try:
        while True:
            data = await websocket.receive_json()
            await websocket_manager.handle_message(websocket, data, "orders")
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket, "orders")

@app.websocket("/ws/signals")
async def websocket_signals(websocket: WebSocket):
    await websocket_manager.connect(websocket, "signals")
    try:
        while True:
            data = await websocket.receive_json()
            await websocket_manager.handle_message(websocket, data, "signals")
    except WebSocketDisconnect:
        await websocket_manager.disconnect(websocket, "signals")

if __name__ == "__main__":
    uvicorn.run(
        "backend.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
        workers=4 if not settings.DEBUG else 1
    )
