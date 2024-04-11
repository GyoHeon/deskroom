from fastapi.testclient import TestClient
from pytest import fixture


@fixture
def client() -> TestClient:
    import os

    from deskroom.app import app

    os.environ["DSKRM_ENV"] = "test"

    return TestClient(app)


def test_get_all_users(client: TestClient) -> None:
    response = client.get("/users")

    assert response.status_code == 404  # NOTE: This is a temporary test
