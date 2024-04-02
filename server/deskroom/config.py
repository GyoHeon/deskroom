import os
from enum import Enum

from pydantic_settings import BaseSettings, SettingsConfigDict


class Environment(str, Enum):
    development = "development"
    staging = "staging"
    production = "production"
    local = "local"


env = Environment(os.getenv("DSKRM_ENV", Environment.local))
env_file = ".env.local" if env == Environment.local else ".env"


class Settings(BaseSettings):
    ENV: Environment = env

    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""

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

    def is_local(self) -> bool:
        return self.is_environment(Environment.local)

    def is_staging(self) -> bool:
        return self.is_environment(Environment.staging)

    def is_production(self) -> bool:
        return self.is_environment(Environment.production)


settings = Settings()
