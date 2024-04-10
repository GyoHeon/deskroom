FROM --platform=$BUILDPLATFORM docker.io/python:3.10.0-bullseye
LABEL org.opencontainers.image.source=https://github.com/CloserLabs/deskroom
LABEL org.opencontainers.image.description="Deskroom Server"
LABEL org.opencontainers.image.licenses=Apache-2.0

RUN pip install "poetry==1.4.2"

WORKDIR /app/server

ADD poetry.lock .
ADD pyproject.toml .

RUN poetry config virtualenvs.in-project true && \
    poetry install --without test,docs --no-root

ADD deskroom deskroom


CMD ["poetry", "run", "uvicorn", "deskroom.app:app", "--host", "0.0.0.0", "--port", "8000"]
