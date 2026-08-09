use serde::Serialize;
use template_core::{CoreError, Response};
use wasm_bindgen::prelude::*;

#[derive(Debug, Serialize)]
#[serde(untagged)]
enum BoundaryResponse {
    Success { ok: bool, data: Response },
    Failure { ok: bool, error: CoreError },
}

fn boundary_response(name: &str) -> BoundaryResponse {
    match template_core::run(name) {
        Ok(data) => BoundaryResponse::Success { ok: true, data },
        Err(error) => BoundaryResponse::Failure { ok: false, error },
    }
}

#[wasm_bindgen(js_name = run)]
pub fn run_js(name: &str) -> JsValue {
    serde_wasm_bindgen::to_value(&boundary_response(name))
        .expect("the fixed boundary response must serialize")
}

#[cfg(test)]
mod tests {
    use super::boundary_response;

    #[test]
    fn serializes_success_for_javascript() {
        assert_eq!(
            serde_json::to_value(boundary_response("Tinkora"))
                .expect("boundary response should serialize"),
            serde_json::json!({
                "ok": true,
                "data": {
                    "schemaVersion": 1,
                    "output": "Hello, Tinkora!"
                }
            })
        );
    }

    #[test]
    fn serializes_error_for_javascript() {
        assert_eq!(
            serde_json::to_value(boundary_response(" ")).expect("boundary error should serialize"),
            serde_json::json!({
                "ok": false,
                "error": {
                    "code": "EMPTY_INPUT",
                    "message": "Name must not be empty."
                }
            })
        );
    }
}
