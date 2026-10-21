# Certificate security details & export quality (v84)
Visual-inspection features only; not cryptographic proof of authenticity.
Code: certificate.js (certSecuritySpec, certSecSvg, certSecDrawPdf). One deterministic spec drives screen/PNG (SVG) and PDF (vector).
Coordinates are in the 1123x794 certificate space (A4 landscape).
- A. Inner-border microtext: top y=46 (x228-452, 672-896); bottom y=748 (x272-432, 672-822); left x=61 (y200-312, 492-604); right x=1062 (mirrored).
- B. Bottom security line: y=715, x291-832, centred, below the footer.
- C. Background pattern: "ABA * ACCOUNTANCY BY ABHINASH *" tiles, 3.4px, ~13% opacity, skipped near ornaments.
- D. ID detail: ABA micro-run + rule + 22 ledger ticks seeded from the certificate ID, 11px above the ID text.
- E. Corner marks: ledger square + "ABA" micro-run at (150,128) (973,128) (150,666) (973,666).
- Hidden motif: ABA monogram in a ledger box at bottom-left border (214,741) with 8 ID-seeded cells; balanced-line mark at (833,745).
Export: PNG 3509x2481 (300 DPI A4), PDF = 300 DPI JPEG(0.97) base + true vector microtext. Share = 2x.
Limit: background JPEG is 2200px wide (~188 DPI at A4); body text is raster in PDF.
