# Day 21 Story: Email Import Inbox v1

## Beginning: The Problem

Federal employees and job seekers often receive important emails with documents attached (pay stubs, PCS orders, FEHB info, job announcements). The original Day 21 implementation focused on .eml file uploads, which requires users to:

1. Know what a .eml file is
2. Know how to save emails as .eml from their email client
3. Find and upload that file

This created unnecessary friction for everyday users who just want to save email content for reference.

## Middle: The Changes

### 1. User-Friendly Import Paths

We redesigned the import flow to prioritize simplicity:

**Section 1: Paste an email (recommended)**
- Most users can copy/paste email content directly
- No special file knowledge required
- Works with any email client

**Section 2: Upload attachments**
- Direct upload of PDF, DOCX, TXT files
- Multi-file support with preview chips
- Remove individual files before import

**Section 3: Advanced .eml option (collapsible)**
- Still available for power users
- Tucked away to avoid confusing beginners

### 2. Data Model Updates

Added `sourceType` field to track how emails were imported:
- `'pasted'` - Email content was copy/pasted
- `'attachments'` - Files were uploaded directly
- `'eml'` - Saved email file was uploaded

Added `importFromAttachments` store action that:
- Accepts array of File objects
- Extracts filename and content type
- Classifies based on filenames when no email text exists
- Creates an import record with attachment metadata

### 3. UI Copy Changes

All user-facing text now uses "Import" instead of "Ingest":
- Page title: "Email Import Inbox (v1)"
- Sidebar section: "IMPORT" (was "INGEST")
- Nav item: "Email Import" (was "Email Inbox")
- List title: "Imported Emails" (was "Ingested Emails")
- Buttons: "Import Email Content", "Import Attachments"

### 4. Source Type Badges

Each email item now shows two badges:
- Classification badge (Pay Stub, FEHB, etc.)
- Source type badge (Pasted Email, Attachments, Saved Email)

### 5. Classification Enhancement

The classification system now works with attachments-only imports:
- Uses filenames for keyword matching when no email text exists
- Same deterministic heuristics, no AI calls

## End: The Result

### What Users See

1. **Friendly welcome callout** explaining the feature purpose
2. **Three clear import options** with "Paste" as the recommended default
3. **Source type badges** showing how each item was imported
4. **Collapsible advanced section** keeping .eml option available but not prominent

### How to Test

**Test 1: Paste Email Content**
1. Navigate to `/ingest/email`
2. Paste email text: `From: test@agency.gov\nSubject: Your Pay Statement\n\nYour pay stub is attached.`
3. Click "Import Email Content"
4. Verify: Email appears in list with "Pasted Email" badge
5. Refresh page
6. Verify: Email persists

**Test 2: Upload Attachments**
1. Click "Upload attachments" area or drop files
2. Select a PDF file (e.g., `payslip.pdf`)
3. Verify: File chip appears with remove button
4. Click "Import Attachments"
5. Verify: Item appears with "Attachments" badge
6. Refresh page
7. Verify: Item persists

**Test 3: Delete**
1. Click "Delete" on any item
2. Refresh page
3. Verify: Item is gone

**Test 4: localStorage Verification**
```javascript
// In browser console:
localStorage.getItem('pathos.emailIngestion.v1')
// Should show JSON array with imported items
```

### Files Changed

| File | Change |
|------|--------|
| `app/ingest/email/page.tsx` | Complete UI redesign with 3 sections |
| `store/emailIngestionStore.ts` | Added sourceType, importFromAttachments |
| `components/path-os-sidebar.tsx` | Changed INGEST to IMPORT |
| `docs/change-briefs/day-21.md` | Updated documentation |
| `store/index.ts` | Export EmailSourceType |

### Technical Notes

- Backwards compatible: Old items without `sourceType` default to `'pasted'`
- No external API calls - all local
- Storage key unchanged: `pathos.emailIngestion.v1`
- Classification works with filenames for attachment-only imports


