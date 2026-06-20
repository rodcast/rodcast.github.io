# auth.md

This service publishes agent registration discovery metadata for `https://rodrigocastilho.com/`.

- Resource server: `https://rodrigocastilho.com/`
- Authorization server: `https://rodrigocastilho.com/`
- Protected Resource Metadata: `https://rodrigocastilho.com/.well-known/oauth-protected-resource`
- Authorization Server Metadata: `https://rodrigocastilho.com/.well-known/oauth-authorization-server`

Passive scanners and discovery clients should read the two `.well-known` documents first. This site is statically hosted, so the published registration and revocation URIs are documentation-first contract surfaces. Do not probe them with side-effecting `POST` requests during passive discovery.

## Discover

1. Fetch `/.well-known/oauth-protected-resource` and read `resource`, `authorization_servers`, `scopes_supported`, and `bearer_methods_supported`.
2. Fetch `/.well-known/oauth-authorization-server` from the advertised authorization server.
3. Read the `agent_auth` block in full, including `skill`, `register_uri`, `identity_types_supported`, and the method-specific `claim_uri` and `revocation_uri` values.

## Supported Method

This site currently advertises one registration path:

- `service_auth` for email-based agent onboarding

Supported scopes:

- `profile:read` for public profile metadata
- `content:read` for public article and repository metadata

## Register

Use the `register_uri` from Authorization Server metadata:

- `https://rodrigocastilho.com/agent/identity`

Registration type:

```json
{
  "type": "service_auth",
  "login_hint": "user@example.com"
}
```

The canonical registration contract is documented at the register URI. On this static host, the URI serves documentation for the request and response shape rather than an active POST handler.

## Claim Ceremony

If the service advertises `claim_uri`, use it as the ceremony bootstrap URI:

- `https://rodrigocastilho.com/agent/identity/claim`

The user-claimed flow uses a service-owned confirmation step before any scoped credential is considered active.

## Credential Use

Credential type:

- `access_token`

Agents should exchange a service-issued assertion at the advertised token endpoint and present the resulting bearer token in the `Authorization` header.

## Revocation

Credential revocation is documented at:

- `https://rodrigocastilho.com/oauth/revoke`

Registration-level revocation and upstream agent identity events are documented at:

- `https://rodrigocastilho.com/agent/event/notify`

## Contact

Integration and provisioning questions: <mailto:security@rodrigocastilho.com>
