export const FONT_FAMILIES = [
  {
    key: 'MODERN_SANS',
    segment: 'Modern sans',
    value: '"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif',
  },
  {
    key: 'BOOK_SANS',
    segment: 'Book sans',
    value: 'Optima, Candara, "Noto Sans", source-sans-pro, sans-serif',
  },
  {
    key: 'ORGANIC_SANS',
    segment: 'Organic sans',
    value:
      'Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif',
  },
  {
    key: 'GEOMETRIC_SANS',
    segment: 'Geometric sans',
    value:
      'Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif',
  },
  {
    key: 'HEAVY_SANS',
    segment: 'Heavy sans',
    value:
      'Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif',
  },
  {
    key: 'ROUNDED_SANS',
    segment: 'Rounded sans',
    value:
      'ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif',
  },
  {
    key: 'MODERN_SERIF',
    segment: 'Modern serif',
    value: 'Charter, "Bitstream Charter", "Sitka Text", Cambria, serif',
  },
  {
    key: 'BOOK_SERIF',
    segment: 'Book serif',
    value:
      '"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif',
  },
  {
    key: 'MONOSPACE',
    segment: 'Monospace',
    value: '"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace',
  },
];

export const FONT_FAMILY_NAMES = [
  'MODERN_SANS',
  'BOOK_SANS',
  'ORGANIC_SANS',
  'GEOMETRIC_SANS',
  'HEAVY_SANS',
  'ROUNDED_SANS',
  'MODERN_SERIF',
  'BOOK_SERIF',
  'MONOSPACE',
] as const;
