import os
from enum import Enum

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    development = "development"
    staging = "staging"
    production = "production"
    local = "local"
    test = "test"


env = Environment(os.getenv("DSKRM_ENV", Environment.local))
env_file = ".env.local" if env == Environment.local else ".env"


class Settings(BaseSettings):
    ENV: Environment = env

    # supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""

    # newrelic
    # NOTE: NEW_RELIC_ prefix is required for newrelic agent
    NEW_RELIC_LOG: str = Field("stdout", alias="NEW_RELIC_LOG")
    NEW_RELIC_LICENSE_KEY: str = Field("", alias="NEW_RELIC_LICENSE_KEY")
    NEW_RELIC_APP_NAME: str = Field("deskroom", alias="NEW_RELIC_APP_NAME")

    # openai
    OPENAI_API_KEY: str = Field("", alias="OPENAI_API_KEY")
    AZURE_OPENAI_API_KEY: str = Field("", alias="AZURE_OPENAI_API_KEY")
    AZURE_OPENAI_ENDPOINT: str = Field("", alias="AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_API_VERSION: str = Field("", alias="AZURE_OPENAI_API_VERSION")

    # azure
    AZURE_PROMPT_TOKEN: str = Field("", alias="AZURE_PROMPT_TOKEN")
    AZURE_PROMPT_PATH: str = Field("", alias="AZURE_PROMPT_PATH")
    AZURE_ACCOUNT_URL: str = Field("", alias="AZURE_ACCOUNT_URL")
    AZURE_ACCOUNT_CREDENTIAL: str = Field("", alias="AZURE_ACCOUNT_CREDENTIAL")

    # redis
    REDIS_URL: str = Field("redis://localhost:6379/0", alias="REDIS_URL")

    # linear
    LINEAR_API_KEY: str = ""

    model_config = SettingsConfigDict(
        env_prefix="dskrm_",
        env_file_encoding="utf-8",
        case_sensitive=False,
        env_file=env_file,
        extra="allow",
    )

    def is_environment(self, environment: Environment) -> bool:
        return self.ENV == environment

    def is_development(self) -> bool:
        return self.is_environment(Environment.development)

    def is_test(self) -> bool:
        return self.is_environment(Environment.test)

    def is_local(self) -> bool:
        return self.is_environment(Environment.local)

    def is_staging(self) -> bool:
        return self.is_environment(Environment.staging)

    def is_production(self) -> bool:
        return self.is_environment(Environment.production)


settings = Settings()
