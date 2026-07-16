FROM python:3.12-slim

WORKDIR /app
COPY . /app

# Hugging Face Spaces 路由到 7860
ENV PORT=7860
ENV HOST=0.0.0.0

EXPOSE 7860

CMD ["python", "app.py"]
