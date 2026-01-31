# DMI Tools Arcade - Architecture Decisions

## Decision Log

### D001: Hybrid Single-File Architecture
**Date**: 2026-01-30
**Status**: Accepted

**Context**: Need developer ergonomics (TypeScript, hot reload) while preserving single-file deployment for easy sharing.

**Decision**: Use TypeScript + Vite for development, compile to single self-contained HTML for production.

**Consequences**:
- Build step required
- Dev experience matches modern standards
- Deployed games remain easily shareable
- No runtime dependencies except CDN assets

---

### D002: Factory-to-Game Communication via Supabase
**Date**: 2026-01-30
**Status**: Accepted

**Context**: Games need to receive product/promo updates without redeploy.

**Decision**: Games fetch loadouts from Supabase at runtime with embedded fallback config.

**Consequences**:
- Small latency on game start (mitigated by fetching during title screen)
- Games work offline with fallback
- Marketing can update promos instantly
- Requires Supabase project setup

---

### D003: Factory MVP is JSON-First
**Date**: 2026-01-30
**Status**: Accepted

**Context**: Need Factory working quickly to unblock game testing.

**Decision**: Start with JSON editor + validation. Visual UI added after games complete.

**Consequences**:
- Faster initial development
- Power users can edit directly
- Visual polish comes later
- May need JSON schema docs for early users

---

### D004: Sequential Game Development with 90% Gate
**Date**: 2026-01-30
**Status**: Accepted

**Context**: Need quality bar for each game before moving on.

**Decision**: Complete each game to 90% quality gate (vs reference frames) before starting next.

**Consequences**:
- Prevents half-finished games
- Explicit quality checklist per game
- May slow overall timeline
- First game validates entire pipeline

---

### D005: Chrome MCP for Reference Capture
**Date**: 2026-01-30
**Status**: Accepted

**Context**: Need to gather visual references efficiently.

**Decision**: Use Chrome MCP to search for and capture gameplay screenshots from reference games.

**Consequences**:
- Automated reference gathering
- Consistent capture format
- Fallback to manual if blocked
- Creates Clone Pack for each game

---

### D006: Brand Colors Update
**Date**: 2026-01-30
**Status**: Accepted

**Context**: Original CLAUDE.md had outdated brand colors.

**Decision**: Use official DMI brand colors:
- Primary: Red #a61c00, Black #000000, White #ffffff, Blue #0033A0
- Secondary: Light Gray #efefef, Middle Gray #b7b7b7, Dark Gray #666666

**Consequences**:
- All games use consistent branding
- Remove old #A62022 / #FFD700 colors
- Update existing assets if any

---

## Template for Future Decisions

```markdown
### DXXX: [Title]
**Date**: YYYY-MM-DD
**Status**: [Proposed / Accepted / Deprecated / Superseded]

**Context**: [Why is this decision needed?]

**Decision**: [What was decided?]

**Consequences**:
- [Positive and negative impacts]
```
