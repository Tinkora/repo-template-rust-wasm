use template_core::{Response, run};

#[test]
fn returns_versioned_response() {
    let response: Response = run("Tinkora").expect("valid input should succeed");

    assert_eq!(response.schema_version, 1);
    assert_eq!(response.output, "Hello, Tinkora!");
}

#[test]
fn rejects_empty_input() {
    let error = run("").expect_err("empty input should fail");

    assert_eq!(error.code(), "EMPTY_INPUT");
    assert_eq!(error.message(), "Name must not be empty.");
}

#[test]
fn rejects_whitespace_only_input() {
    let error = run(" \t\n").expect_err("whitespace-only input should fail");

    assert_eq!(error.code(), "EMPTY_INPUT");
    assert_eq!(error.message(), "Name must not be empty.");
}

#[test]
fn serializes_response_with_stable_field_names() {
    let response = run("Tinkora").expect("valid input should succeed");

    assert_eq!(
        serde_json::to_value(response).expect("response should serialize"),
        serde_json::json!({
            "schemaVersion": 1,
            "output": "Hello, Tinkora!"
        })
    );
}

#[test]
fn serializes_error_with_stable_code_and_message() {
    let error = run(" ").expect_err("whitespace-only input should fail");

    assert_eq!(
        serde_json::to_value(error).expect("error should serialize"),
        serde_json::json!({
            "code": "EMPTY_INPUT",
            "message": "Name must not be empty."
        })
    );
}
