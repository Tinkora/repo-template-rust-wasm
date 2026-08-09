use serde::ser::SerializeStruct;
use serde::{Serialize, Serializer};
use std::fmt;

pub const SCHEMA_VERSION: u32 = 1;

#[derive(Debug, Clone, PartialEq, Eq, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Response {
    pub schema_version: u32,
    pub output: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CoreError {
    EmptyInput,
}

impl CoreError {
    pub const fn code(self) -> &'static str {
        match self {
            Self::EmptyInput => "EMPTY_INPUT",
        }
    }

    pub const fn message(self) -> &'static str {
        match self {
            Self::EmptyInput => "Name must not be empty.",
        }
    }
}

impl fmt::Display for CoreError {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.message())
    }
}

impl std::error::Error for CoreError {}

impl Serialize for CoreError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        let mut error = serializer.serialize_struct("CoreError", 2)?;
        error.serialize_field("code", self.code())?;
        error.serialize_field("message", self.message())?;
        error.end()
    }
}

pub fn run(name: &str) -> Result<Response, CoreError> {
    if name.trim().is_empty() {
        return Err(CoreError::EmptyInput);
    }

    Ok(Response {
        schema_version: SCHEMA_VERSION,
        output: format!("Hello, {name}!"),
    })
}
