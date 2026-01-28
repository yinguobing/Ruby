# Copilot Instructions for Ruby Theme

## Project Overview

Ruby is a **Ghost theme** (v5.0+) featuring a multi-column card layout for organizing publications. This is a theme distribution package, not a Ghost app—it compiles assets and is packaged as a zip for upload to Ghost's design panel.

### Key Architecture

- **Templates**: Handlebars files (*.hbs) define Ghost theme structure using Ghost's data context
- **Styles**: PostCSS-based CSS organized by concerns (blog/, site/, general/, misc/)
- **Assets**: Compiled output in `assets/built/` generated from `assets/css/screen.css`
- **Build**: Gulp pipeline handles CSS/JS compilation, linting, and packaging
- **Distribution**: `yarn zip` creates `dist/ruby.zip` for upload to Ghost

## Critical Developer Workflows

### Development Setup
```bash
yarn          # Install dependencies
yarn dev      # Start Gulp watch + livereload (compiles CSS/JS on file changes)
yarn test     # Run gscan (Ghost theme validator)
yarn zip      # Package theme into dist/ruby.zip
```

### Common Tasks
- **Edit styles**: Modify files in `assets/css/` → auto-compiles to `assets/built/screen.css`
- **Edit templates**: Modify *.hbs files → livereload triggers in browser
- **Update icons**: Add SVG partials to `partials/icons/` (search icon is pre-wired)
- **Test before shipping**: `yarn test` must pass (gscan validates Ghost compatibility)

## Template & Data Pattern Conventions

### Ghost Context Variables
- `@site` - Global site object (`.url`, `.title`, `.logo`, `.locale`)
- `@member` - Current member object (if members enabled)
- `@custom` - Theme customizations from `package.json` config
- `posts` - Foreach loop context in index/tag/author
- `post` - Single post context in post.hbs

### Common Template Patterns

**Conditional Custom Settings** (from `package.json`):
```handlebars
{{#match @custom.navigation_layout "Logo on the left"}}
  <!-- Logo left variant -->
{{else match @custom.navigation_layout "Logo in the middle"}}
  <!-- Logo middle variant -->
{{else}}
  <!-- Stacked variant -->
{{/match}}
```

**Responsive Images** (use Ghost's img_url helper with size):
```handlebars
<img
  srcset="{{img_url feature_image size="s"}} 400w,
          {{img_url feature_image size="m"}} 750w"
  sizes="600px"
  src="{{img_url feature_image size="l"}}"
  loading="lazy"
/>
```

**Partial Inclusion** (Handlebars partials):
```handlebars
{{> "post-image"}}      <!-- partials/post-image.hbs -->
{{> "icons/search"}}    <!-- partials/icons/search.hbs -->
```

**Template Inheritance**: All page templates begin with `{{!< default}}` to extend `default.hbs`

## CSS Architecture & Customization

### CSS Organization
- **screen.css**: Central import file (no direct edits)
- **general/**: Typography, basics, shared foundations
- **blog/**: Post card grids, article styling, author/comment/related posts
- **site/**: Header, layout, term pages
- **misc/**: Utilities and one-offs

### CSS Variables (Inherited from shared-theme-assets)
Common CSS vars: `--white-color`, `--ghost-accent-color`, `--tag-color` (set via primary_tag.accent_color)

### Grid Layout
Post feed uses CSS Grid:
```css
.post-feed {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 3-column layout */
  gap: 32px;
}
```

## Theme Configuration (package.json)

The `config.custom` object defines customizable settings visible in Ghost's design panel:

- **navigation_layout**: "Logo on the left" | "Logo in the middle" | "Stacked"
- **title_font** & **body_font**: "Modern sans-serif" | "Elegant serif"
- **show_related_posts**: Boolean toggle for post.hbs related posts section
- **image_sizes**: Responsive breakpoints (xs: 150px → xxl: 2000px)

Access in templates: `@custom.setting_name`

## Build & Asset Pipeline

### Gulp Tasks (gulpfile.js)
- **css()**: Compiles `assets/css/screen.css` with PostCSS (easy-import, autoprefixer, cssnano)
- **js()**: Concatenates shared libs + `assets/js/main.js`, minifies to `main.min.js`
- **hbs()**: Watches template files for livereload
- **zip()**: Packages theme into `dist/ruby.zip`

### Key Dependencies
- `@tryghost/shared-theme-assets`: Provides base CSS/JS libs and utilities
- `postcss-easy-import`: Flattens @import statements
- `cssnano`: CSS minification
- `gulp-livereload`: Browser refresh on changes
- `gscan`: Ghost theme validator (via `yarn test`)

### Important: Build Output
Always commit source files (`assets/css/`, `assets/js/`), never manually edit compiled files in `assets/built/`.

## Testing & Validation

Run `yarn test` (gscan) before submitting changes:
- Validates Handlebars syntax
- Checks Ghost compatibility (v5.0+)
- Ensures required templates exist (post.hbs, index.hbs, default.hbs)

Common failures: Undefined helpers, missing required fields, incompatible Ghost features.

## Repository Context

- **Synced with**: TryGhost/Themes monorepo (official themes developed there)
- **Contribution path**: Submit issues/PRs to TryGhost/Themes repository
- **Distribution**: Downloaded as ZIP and uploaded to Ghost admin panel
