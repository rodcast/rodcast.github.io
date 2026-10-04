# Agent Registration (auth.md)

You are an agent. This service documents **agentic registration** at `https://rodrigocastilho.com`.

- Resource server: `https://rodrigocastilho.com/`
- Authorization server: `https://rodrigocastilho.com`

Read the Protected Resource Metadata and Authorization Server metadata first. This GitHub Pages deployment serves static files only: it does not process registration, token, revocation, or event `POST` requests, and ships no user-facing login or claim UI. The flows below — including `service_auth` — are protocol examples for a deployment that implements the required backend; do not run them against this site during passive discovery.

## Step 1 — Discover

### 1a. Fetch the Protected Resource Metadata

```http
GET /.well-known/oauth-protected-resource
```

Response shape:

```json
{
  "resource": "https://rodrigocastilho.com/",
  "resource_name": "Rodrigo Castilho Public Site",
  "resource_logo_uri": "https://rodrigocastilho.com/favicon.ico",
  "authorization_servers": ["https://rodrigocastilho.com"],
  "scopes_supported": ["profile:read", "content:read"],
  "bearer_methods_supported": ["header"]
}
```

### 1b. Fetch the Authorization Server Metadata

```http
GET /.well-known/oauth-authorization-server
```

Response shape (read the `agent_auth` block in full):

```json
{
  "issuer": "https://rodrigocastilho.com",
  "token_endpoint": "https://rodrigocastilho.com/oauth/token",
  "revocation_endpoint": "https://rodrigocastilho.com/oauth/revoke",
  "jwks_uri": "https://rodrigocastilho.com/.well-known/jwks.json",
  "grant_types_supported": [
    "urn:ietf:params:oauth:grant-type:jwt-bearer",
    "urn:workos:agent-auth:grant-type:claim"
  ],
  "scopes_supported": ["profile:read", "content:read"],
  "agent_auth": {
    "skill": "https://rodrigocastilho.com/auth.md",
    "identity_endpoint": "https://rodrigocastilho.com/agent/identity/register",
    "register_uri": "https://rodrigocastilho.com/agent/identity/register",
    "claim_endpoint": "https://rodrigocastilho.com/agent/identity/claim",
    "events_endpoint": "https://rodrigocastilho.com/agent/event/notify",
    "identity_types_supported": ["anonymous", "service_auth"],
    "anonymous": {
      "credential_types_supported": ["access_token"],
      "claim_uri": "https://rodrigocastilho.com/agent/identity/claim"
    },
    "service_auth": {
      "credential_types_supported": ["access_token"],
      "claim_uri": "https://rodrigocastilho.com/agent/identity/claim",
      "revocation_uri": "https://rodrigocastilho.com/oauth/revoke"
    },
    "events_supported": [
      "https://schemas.workos.com/events/agent/auth/identity/assertion/revoked"
    ]
  }
}
```

## Step 2 — Pick a method

The documented protocol defines these registration methods for a deployment that implements it:

- **`anonymous`** — low-friction registration for read-only flows that returns an `access_token` for allowed scopes.

- **`service_auth`** — you have the user's email. A claim ceremony is required before credentials are issued.

## Step 3 — Register

In a deployment that implements this protocol, surface the service's `resource_name` ("Rodrigo Castilho Public Site") and the scopes you'll act under, and confirm with the user before sending the request.

```http
POST /agent/identity/register
Content-Type: application/json
{
  "type": "service_auth",
  "login_hint": "user@example.com"
}
```

Response (200):

```json
{
  "registration_id": "reg_...",
  "registration_type": "service_auth",
  "claim_url": "https://rodrigocastilho.com/agent/identity/claim",
  "claim_token": "clm_...",
  "claim_token_expires": "...",
  "post_claim_scopes": ["profile:read", "content:read"],
  "claim": {
    "user_code": "123456",
    "expires_in": 600,
    "verification_uri": "https://rodrigocastilho.com/login?return_to=/claim?claim_attempt_token=...",
    "interval": 5
  }
}
```

No `identity_assertion` yet. In a deployment with the required user-facing UI, surface `claim.verification_uri` and `claim.user_code` to the user (Step 4b), then poll for completion (Step 4c). This repository's static site does not currently implement that `/login` route.

## Step 4 — Claim ceremony

### 4a. Get the ceremony materials

For `service_auth`, the `claim` block is already in the Step 3 response. Skip to 4b.

### 4b. Hand off to the user

Surface `verification_uri` and `user_code` in a single message. Suggested copy:

> Open the deployment-provided verification link, sign in (or sign up), and enter this 6-digit code: **123456**

In a deployment implementing the protocol, the user signs in through its verification UI and enters the `user_code` on the claim page.

### 4c. Poll for completion

```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=urn:workos:agent-auth:grant-type:claim
&claim_token=<clm_...>
```

Response while waiting:

```json
{ "error": "authorization_pending", "error_description": "..." }
```

Response on success:

```json
{
  "access_token": "<token>",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "profile:read content:read",
  "identity_assertion": "<service-signed JWT>",
  "assertion_expires": "..."
}
```

Cache `identity_assertion` for the refresh path (Step 5).

## Step 5 — Exchange the assertion

```http
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer
&assertion=<identity_assertion>
&resource=https://rodrigocastilho.com/
```

Response (200):

```json
{
  "access_token": "<token>",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "profile:read content:read"
}
```

## Step 6 — Use the access_token

```http
GET /api/health
Authorization: Bearer <access_token>
```

**Refresh:** re-exchange the same `identity_assertion` at Step 5 when the access_token expires. When the assertion itself expires or `/oauth/token` returns `invalid_grant`, restart at Step 3. There is no OAuth `refresh_token`.

## Errors

| Code                       | Endpoint                   | Action                                                      |
| -------------------------- | -------------------------- | ----------------------------------------------------------- |
| `service_auth_not_enabled` | `/agent/identity/register` | Service doesn't accept this method.                         |
| `invalid_request`          | `/agent/identity/register` | Missing or malformed body. Fix the input.                   |
| `invalid_claim_token`      | `/agent/identity/claim`    | Token wrong or expired. Restart at Step 3.                  |
| `claim_expired`            | `/agent/identity/claim`    | Registration expired. Restart at Step 3.                    |
| `invalid_grant`            | `/oauth/token`             | Assertion expired or revoked. Restart at Step 3.            |
| `unsupported_grant_type`   | `/oauth/token`             | Use `jwt-bearer` or `claim` grant only.                     |
| `authorization_pending`    | `/oauth/token` (claim)     | User hasn't completed ceremony. Honor `interval`.           |
| `expired_token`            | `/oauth/token` (claim)     | `user_code` window closed. Re-call `/agent/identity/claim`. |
| `slow_down`                | `/oauth/token` (claim)     | Add ≥5s to `interval` and retry.                            |

## Revocation

Two independent layers:

- **Credential layer (RFC 7009):** `POST /oauth/revoke` with `token=<access_token>`. The `identity_assertion` survives; re-exchange at Step 5.
- **Registration layer (RFC 8935 SET delivery):** Provider-driven. A `secevent+jwt` POSTed to `https://rodrigocastilho.com/agent/event/notify` invalidates the assertion. Discovered as `invalid_grant` on next exchange; restart at Step 3.

## Contact

Integration questions: open an issue at <https://github.com/rodcast/rodcast.github.io/issues>
