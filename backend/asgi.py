from app import create_app
from asgiref.wsgi import WsgiToAsgi

app = create_app()
asgi_app = WsgiToAsgi(app)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("asgi:asgi_app", host="127.0.0.1", port=5000, reload=True)
