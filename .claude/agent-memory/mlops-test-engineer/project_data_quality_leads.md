---
name: leads_capture data quality audit — March 25, 2026
description: Fan lead data quality findings from first 14 real QR scan registrations
type: project
---

14 real fan registrations captured at Casa del Libro Total show, March 24, 2026.

**Duplicate emails:** 2 duplicates detected
- `manuel@gsd500bpo.com` — 2 records (test submissions by Ariel, names "test" and "Test Night")
- `info@homevalleysolutions.com` — 2 records (fan_seq=1 and fan_seq=2, same person scanned twice)

**Data quality scores:**
- Completeness: 9/10 (all emails present, phones present on all 14)
- Accuracy: 7/10 (2 test records pollute real fan data; fan_id is same for everyone)
- Consistency: 6/10 (fan_id = "AML-TN-ARC-001" is NOT unique per fan — it's the artist/QR campaign ID. master_id is the true unique fan identifier e.g. APEX-MN52UHHC-00001)
- Uniqueness: 8/10 (2 duplicates by email out of 14 records = 85.7% unique)
- Geo capture: 5 out of 14 fans provided GPS location (36% geo capture rate)

**fan_seq issue:** fan_seq=1 for 12 of 14 records. It tracks how many times the SAME fan scanned, not the global fan count. The homevalleysolutions record has fan_seq=2 (scanned twice). This field is not a global sequence number.

**Test record pollution:** Records from msuarez@datosmaestros.com and manuel@gsd500bpo.com appear to be internal test scans (phone numbers match Ariel's number). Should be filtered from analytics.

**Arcoiris band member in data:** ssulayperez@gmail.com (Sulay Perez) and alisinesorbe@gmail.com (Alisson Trigos) are actual band members in the fan list — should be tagged/excluded from fan campaigns.
