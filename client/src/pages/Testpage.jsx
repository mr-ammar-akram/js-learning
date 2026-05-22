import { useState } from "react";

const issues = [
  {
    category: "Navigation & UX",
    severity: "critical",
    icon: "🧭",
    items: [
      {
        id: "nav-1",
        title: "Triplicated Navigation HTML",
        severity: "critical",
        description: "The nav menu is rendered THREE times in the DOM — two in the header, one in the mobile drawer. This inflates page weight, confuses screen readers, and creates maintenance debt.",
        fix: `<!-- BAD: Three nav blocks in source -->
<!-- Remove duplicate navs; use ONE semantic <nav> -->

<!-- GOOD: Single nav with CSS-driven mobile toggle -->
<nav id="main-nav" role="navigation" aria-label="Main menu">
  <ul>
    <li><a href="/">Home</a></li>
    <li class="has-dropdown">
      <a href="/musical-entertainers/">Musical Entertainers</a>
      <ul class="dropdown">
        <li><a href="/about-us/">About us</a></li>
        <li><a href="/singer-guitar/">Singer Guitar</a></li>
        <li><a href="/function-and-party-brand/">Function & Party Brand</a></li>
      </ul>
    </li>
    <!-- ... remaining items -->
  </ul>
  <button class="hamburger" aria-controls="main-nav" aria-expanded="false">
    <span class="sr-only">Open menu</span>
  </button>
</nav>

/* CSS */
@media (max-width: 768px) {
  #main-nav ul { display: none; }
  #main-nav[data-open="true"] ul { display: flex; flex-direction: column; }
}`,
      },
      {
        id: "nav-2",
        title: "Broken Internal Link (Typo in href)",
        severity: "critical",
        description: 'Mobile drawer contains href="/funcation-and-party-brand/" — a typo ("funcation" instead of "function"). This 404s silently.',
        fix: `<!-- BAD -->
<a href="/funcation-and-party-brand/">Function & Party Brand</a>

<!-- GOOD -->
<a href="/function-and-party-brand/">Function & Party Brand</a>`,
      },
      {
        id: "nav-3",
        title: "Category Cards All Link to Same Page",
        severity: "high",
        description: 'All 12 talent category cards (Live Bands, Tribute Bands, DJs, etc.) link to the same generic /book-talent/ page. Users expect to land on a filtered view for each category.',
        fix: `<!-- BAD: All identical hrefs -->
<a href="/book-talent/"><img ...><h3>Live Bands</h3></a>
<a href="/book-talent/"><img ...><h3>DJs</h3></a>

<!-- GOOD: Category-specific URLs -->
<a href="/book-talent/?category=live-bands">
  <img src="..." alt="Live band performing on stage">
  <h3>Live Bands</h3>
</a>
<a href="/book-talent/?category=djs">
  <img src="..." alt="DJ at turntables">
  <h3>DJs</h3>
</a>

/* WordPress/PHP: read ?category param and pre-filter the artist loop */
$category = sanitize_text_field($_GET['category'] ?? '');
$args = [
  'post_type' => 'artist',
  'meta_query' => $category ? [[
    'key' => 'artist_category',
    'value' => $category,
    'compare' => '='
  ]] : []
];`,
      },
    ],
  },
  {
    category: "SEO",
    severity: "high",
    icon: "🔍",
    items: [
      {
        id: "seo-1",
        title: "Blog Article Links Point to /about-us/ (Wrong Target)",
        severity: "high",
        description: 'All 6 blog/inspiration articles ("Wedding Planning", "Complete Guide to Booking a Singer", etc.) link to /about-us/ instead of actual blog post URLs. This burns link equity and creates a terrible user experience.',
        fix: `<!-- BAD -->
<a href="/about-us/">Read More → Wedding Planning Guide</a>

<!-- GOOD: Each article needs its own slug -->
<a href="/blog/wedding-entertainment-guide/">Read More</a>
<a href="/blog/complete-guide-booking-singer/">Read More</a>
<a href="/blog/hiring-wedding-entertainment-tips/">Read More</a>

/* WordPress: register a 'blog' or 'guide' post type */
add_action('init', function() {
  register_post_type('guide', [
    'public'      => true,
    'label'       => 'Guides',
    'has_archive' => true,
    'rewrite'     => ['slug' => 'blog'],
    'supports'    => ['title','editor','thumbnail','excerpt'],
  ]);
});`,
      },
      {
        id: "seo-2",
        title: "All Expertise Guide Cards Link to /sign-up/",
        severity: "high",
        description: 'Four "Expert Entertainment Planning" cards (Wedding Guide, Kids Party Guide, etc.) link to /sign-up/ instead of the guides themselves. This is both an SEO and conversion issue.',
        fix: `<!-- BAD -->
<a href="/sign-up/"><img alt="Wedding">Wedding Entertainment Guide</a>

<!-- GOOD -->
<a href="/blog/wedding-entertainment-guide/">
  <img src="..." alt="Wedding couple with live band">
  <span>Wedding Entertainment Guide</span>
</a>`,
      },
      {
        id: "seo-3",
        title: "Missing Meta Description & Structured Data",
        severity: "high",
        description: 'No JSON-LD structured data for the business or artist listings. Missing Schema.org markup means Google cannot create rich snippets for this entertainment agency.',
        fix: `<!-- Add to <head> of homepage -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "EntertainmentBusiness",
  "name": "Stars Entertainment",
  "url": "https://starsentertainment.org",
  "logo": "https://starsentertainment.org/wp-content/uploads/2026/03/stars-ent-logo-new.png",
  "description": "Hire professional artists and entertainers worldwide. Direct booking, no middleman.",
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "GB"
  },
  "sameAs": [
    "https://www.facebook.com/starsentertainment",
    "https://twitter.com/starsentertain"
  ]
}
</script>

<!-- Add to each artist profile page -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "PerformingGroup",
  "name": "Rob G",
  "description": "Solo Singer Guitarist based in Oxford, UK",
  "location": { "@type": "Place", "name": "Oxford, UK" },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5.0",
    "reviewCount": "185"
  }
}
</script>`,
      },
      {
        id: "seo-4",
        title: "Missing alt Text on Logo & Decorative Images",
        severity: "medium",
        description: 'Several images use empty src paths or missing/generic alt attributes. The original header logo uses an empty alt="". Artist profile images use the artist name in alt which is good, but category images lack descriptive alt text.',
        fix: `<!-- BAD -->
<img src="/wp-content/uploads/2026/01/LogoLS2-2048x1003.png" alt="">
<img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7">

<!-- GOOD -->
<img 
  src="/wp-content/uploads/2026/03/stars-ent-logo-new.png" 
  alt="Stars Entertainment – Hire Professional Artists Worldwide"
  width="240" height="60"
>
<img 
  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&auto=format" 
  alt="Live band performing on stage at a corporate event"
  loading="lazy"
  width="600" height="450"
>`,
      },
    ],
  },
  {
    category: "Performance",
    severity: "high",
    icon: "⚡",
    items: [
      {
        id: "perf-1",
        title: "External Images from Facebook CDN (Hotlinking)",
        severity: "critical",
        description: 'Several "Latest Members" artist images are loaded directly from Facebook\'s CDN (scontent.flyp1-1.fna.fbcdn.net) with expiring token URLs. These will break when tokens expire and have no size/format optimisation.',
        fix: `// WordPress: on artist registration, download & store image locally
add_action('save_post_artist', function($post_id) {
  $fb_url = get_post_meta($post_id, 'facebook_image_url', true);
  if (!$fb_url) return;

  // Download to media library
  require_once(ABSPATH . 'wp-admin/includes/media.php');
  require_once(ABSPATH . 'wp-admin/includes/file.php');
  require_once(ABSPATH . 'wp-admin/includes/image.php');

  $attachment_id = media_sideload_image($fb_url, $post_id, null, 'id');
  if (!is_wp_error($attachment_id)) {
    update_post_meta($post_id, 'artist_photo_id', $attachment_id);
    delete_post_meta($post_id, 'facebook_image_url'); // clean up
  }
});

// Then serve with proper srcset
$img_id = get_post_meta($post_id, 'artist_photo_id', true);
echo wp_get_attachment_image($img_id, 'medium', false, [
  'loading' => 'lazy',
  'alt'     => get_the_title($post_id) . ' - performer profile photo',
]);`,
      },
      {
        id: "perf-2",
        title: "No Image lazy Loading or srcset",
        severity: "high",
        description: 'Images throughout the page lack loading="lazy" and srcset attributes. The homepage is image-heavy (30+ images). Without lazy loading, all images are fetched on initial load, worsening LCP and TTI.',
        fix: `<!-- BAD -->
<img src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7">

<!-- GOOD: Responsive with lazy load -->
<img
  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&q=75"
  srcset="
    https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&auto=format&q=75 400w,
    https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&q=75 800w,
    https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1200&auto=format&q=75 1200w
  "
  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
  loading="lazy"
  decoding="async"
  width="400"
  height="300"
  alt="Live band performing on stage"
>

/* WordPress functions.php: enable native lazy loading globally */
add_filter('wp_lazy_loading_enabled', '__return_true');
add_filter('the_content', function($content) {
  return str_replace('<img ', '<img loading="lazy" decoding="async" ', $content);
});`,
      },
      {
        id: "perf-3",
        title: "No CDN for Static Assets",
        severity: "medium",
        description: 'All WordPress uploads (/wp-content/uploads/) are served directly from the origin server with no CDN. Images from third-party sites like sparkfiredance.com, kinshira.com, and sidijk.com are hotlinked without caching.',
        fix: `// Option 1: Use Cloudflare (free tier) as CDN
// - Point DNS to Cloudflare
// - Enable "Cache Everything" page rule for /wp-content/uploads/*
// - Set browser cache TTL to 1 year for static assets

// Option 2: WordPress CDN plugin (e.g. WP Offload Media)
// uploads go to S3/R2 → served via CloudFront

// Option 3: Manual .htaccess cache headers
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/webp  "access plus 1 year"
  ExpiresByType image/jpeg  "access plus 1 year"
  ExpiresByType image/png   "access plus 1 year"
  ExpiresByType image/svg+xml "access plus 1 year"
  ExpiresByType text/css    "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>`,
      },
    ],
  },
  {
    category: "Trust & Credibility",
    severity: "high",
    icon: "🛡️",
    items: [
      {
        id: "trust-1",
        title: "Mismatched Brand Names in Footer",
        severity: "high",
        description: 'The footer uses three different legal names: "Starnet Entertainers ORG™ Ltd", "StarEntertainers™ Ltd", and the header brand "Stars Entertainment". Inconsistent naming undermines legal trust and confuses users.',
        fix: `<!-- Standardize to one legal entity name across ALL pages -->

<!-- Footer: Choose ONE name and stick to it -->
<footer>
  <p>© 2026 <a href="/">Stars Entertainment Ltd</a> — All Rights Reserved.</p>
  <!-- Remove duplicate footer (there are TWO footers in the source) -->
</footer>

/* WordPress: use a single ACF/options field for legal name
   so it auto-updates everywhere */
// functions.php
function get_legal_name() {
  return get_option('site_legal_name', 'Stars Entertainment Ltd');
}
// In template:
echo '© ' . date('Y') . ' ' . get_legal_name() . ' — All Rights Reserved.';`,
      },
      {
        id: "trust-2",
        title: "Placeholder / Demo Artist Profiles",
        severity: "high",
        description: 'Featured artists (Elena Voss, Aiko Tanaka, Carlos Rivera, Magic Mike, etc.) use stock photos from Shutterstock, iStock, and random blogs — not genuine artist photos. The artist "Top of The Pops" uses a Getty Images photo of the actual TV show.',
        fix: `/* Audit and replace all stock-photo artist cards.
   Flag placeholder entries with a post_status of 'demo'
   and exclude them from public queries */

// In artist query:
$args = [
  'post_type'   => 'artist',
  'post_status' => 'publish',  // excludes 'demo' status
  'meta_query'  => [[
    'key'     => 'profile_verified',
    'value'   => '1',
    'compare' => '='
  ]]
];

// Add admin notice for unverified artists
add_action('admin_notices', function() {
  $unverified = new WP_Query([
    'post_type'      => 'artist',
    'meta_key'       => 'profile_verified',
    'meta_value'     => '0',
    'posts_per_page' => -1,
    'fields'         => 'ids'
  ]);
  if ($unverified->found_posts > 0) {
    echo '<div class="notice notice-warning"><p>' .
      $unverified->found_posts . ' artist profiles need real photos.</p></div>';
  }
});`,
      },
      {
        id: "trust-3",
        title: "Stats Appear Hardcoded & Unverified",
        severity: "medium",
        description: '"500+ Verified Acts", "1k+ Happy Clients", "24/7 Expert Support" — these appear to be static hardcoded text with no backend data behind them. If the actual numbers are lower, this is misleading.',
        fix: `// WordPress: store stats as options and update via cron
add_action('wp_ajax_update_site_stats', 'update_site_stats');
function update_site_stats() {
  $artist_count = wp_count_posts('artist')->publish;
  update_option('stat_verified_acts', $artist_count);

  // Or pull from booking system API:
  $response = wp_remote_get('https://api.yourbookingsystem.com/stats', [
    'headers' => ['Authorization' => 'Bearer ' . BOOKING_API_KEY]
  ]);
  if (!is_wp_error($response)) {
    $data = json_decode(wp_remote_retrieve_body($response), true);
    update_option('stat_happy_clients', $data['total_bookings'] ?? 0);
  }
}

// Schedule to run daily
if (!wp_next_scheduled('daily_stats_update')) {
  wp_schedule_event(time(), 'daily', 'daily_stats_update');
}
add_action('daily_stats_update', 'update_site_stats');

// In template:
$acts = number_format(get_option('stat_verified_acts', 0));
echo "<span>{$acts}+ Verified Acts</span>";`,
      },
    ],
  },
  {
    category: "Accessibility",
    severity: "medium",
    icon: "♿",
    items: [
      {
        id: "a11y-1",
        title: "Sign In / Sign Up Links Lack Differentiation for Screen Readers",
        severity: "medium",
        description: 'The header renders "Sign In" and "Sign Up" as adjacent plain links with no aria-label distinction. Screen reader users hear them as indistinguishable adjacent links.',
        fix: `<!-- BAD -->
<a href="/sign-in/">Sign In</a>
<a href="/sign-up/">Sign Up</a>

<!-- GOOD -->
<a href="/sign-in/" aria-label="Sign in to your Stars Entertainment account">
  Sign In
</a>
<a href="/sign-up/" aria-label="Create a new Stars Entertainment account" class="btn-primary">
  Sign Up
</a>`,
      },
      {
        id: "a11y-2",
        title: "No Skip Navigation Link",
        severity: "medium",
        description: 'Keyboard users must tab through the entire 3x-duplicated navigation on every page load. A "Skip to content" link at the top of the DOM resolves this.',
        fix: `<!-- Add as FIRST element inside <body> -->
<a 
  href="#content" 
  class="skip-nav"
  aria-label="Skip to main content"
>
  Skip to main content
</a>

<!-- CSS: visible on focus only -->
<style>
.skip-nav {
  position: absolute;
  top: -100%;
  left: 1rem;
  background: #000;
  color: #fff;
  padding: 0.5rem 1rem;
  z-index: 9999;
  border-radius: 0 0 4px 4px;
  transition: top 0.15s;
}
.skip-nav:focus {
  top: 0;
}
</style>

<!-- Main content area needs the matching ID -->
<main id="content" tabindex="-1">
  <!-- page content -->
</main>`,
      },
      {
        id: "a11y-3",
        title: "Color Contrast on CTA Buttons",
        severity: "medium",
        description: 'Several "Free Quote" and "Learn More" buttons appear with low-contrast text against button backgrounds. WCAG AA requires a minimum 4.5:1 ratio for normal text.',
        fix: `/* Audit all button styles for contrast.
   Example fix for common CTA button variants: */

/* Primary button — white text on dark bg ✓ */
.btn-primary {
  background-color: #1a1a2e;  /* dark navy */
  color: #ffffff;              /* contrast ratio: 17.5:1 ✓ */
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
}

/* Secondary button — dark text on light bg ✓ */
.btn-secondary {
  background-color: #f0f0f0;
  color: #1a1a2e;              /* contrast ratio: 14.2:1 ✓ */
  border: 2px solid #1a1a2e;
}

/* "Free Quote" accent button */
.btn-accent {
  background-color: #c9a84c;  /* gold */
  color: #1a1a2e;              /* contrast ratio: 6.1:1 ✓ */
}

/* Use a contrast checker: https://webaim.org/resources/contrastchecker/ */`,
      },
    ],
  },
  {
    category: "Security",
    severity: "medium",
    icon: "🔒",
    items: [
      {
        id: "sec-1",
        title: "No Content Security Policy Header",
        severity: "medium",
        description: 'The site loads images from dozens of external origins (unsplash.com, fbcdn.net, istock, sparkfiredance.com, etc.) with no CSP header. This increases XSS attack surface.',
        fix: `# WordPress: add to .htaccess or via a security plugin
<IfModule mod_headers.c>
  Header set Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https://images.unsplash.com https://i0.wp.com https://secure.gravatar.com;
    connect-src 'self';
    frame-ancestors 'none';
  "
  Header set X-Frame-Options "SAMEORIGIN"
  Header set X-Content-Type-Options "nosniff"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
  Header set Permissions-Policy "camera=(), microphone=(), geolocation=()"
</IfModule>`,
      },
      {
        id: "sec-2",
        title: "WordPress Version Fingerprinting",
        severity: "low",
        description: 'WordPress typically exposes its version in the <meta generator> tag and /readme.html. This helps attackers target known CVEs.',
        fix: `// functions.php — remove version fingerprinting
remove_action('wp_head', 'wp_generator');

add_filter('the_generator', '__return_empty_string');

// Block readme.html, license.txt, wp-config-sample.php via .htaccess
<FilesMatch "^(readme|license|wp-config-sample)\.(html?|txt|php)$">
  Order Allow,Deny
  Deny from all
</FilesMatch>

// Also remove version from script/style src ?ver= params
add_filter('style_loader_src', function($src) {
  return remove_query_arg('ver', $src);
});
add_filter('script_loader_src', function($src) {
  return remove_query_arg('ver', $src);
});`,
      },
    ],
  },
];

const severityConfig = {
  critical: { color: "#ef4444", bg: "#fef2f2", border: "#fecaca", label: "Critical", order: 1 },
  high: { color: "#f97316", bg: "#fff7ed", border: "#fed7aa", label: "High", order: 2 },
  medium: { color: "#eab308", bg: "#fefce8", border: "#fde68a", label: "Medium", order: 3 },
  low: { color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", label: "Low", order: 4 },
};

const totalIssues = issues.reduce((sum, cat) => sum + cat.items.length, 0);
const criticalCount = issues.reduce((sum, cat) => sum + cat.items.filter(i => i.severity === "critical").length, 0);
const highCount = issues.reduce((sum, cat) => sum + cat.items.filter(i => i.severity === "high").length, 0);
const mediumCount = issues.reduce((sum, cat) => sum + cat.items.filter(i => i.severity === "medium").length, 0);

export default function AuditReport() {
  const [openItems, setOpenItems] = useState({});
  const [activeCategory, setActiveCategory] = useState("all");

  const toggle = (id) => setOpenItems(prev => ({ ...prev, [id]: !prev[id] }));

  const filteredIssues = activeCategory === "all"
    ? issues
    : issues.filter(cat => cat.category === activeCategory);

  return (
    <div style={{
      fontFamily: "'Georgia', 'Times New Roman', serif",
      background: "#0f0f13",
      minHeight: "100vh",
      color: "#e8e8e8",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0f0f13 0%, #1a1a2e 50%, #16213e 100%)",
        borderBottom: "1px solid #2a2a3e",
        padding: "2.5rem 2rem 2rem",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "1.1rem", opacity: 0.5, fontFamily: "monospace", letterSpacing: 2 }}>AUDIT REPORT</span>
          </div>
          <h1 style={{
            fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
            fontWeight: 700,
            margin: "0 0 0.25rem",
            letterSpacing: "-0.02em",
            color: "#fff",
          }}>starsentertainment.org</h1>
          <p style={{ opacity: 0.5, margin: "0 0 2rem", fontFamily: "monospace", fontSize: "0.85rem" }}>
            Comprehensive Website Audit · April 2026
          </p>

          {/* Score cards */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            {[
              { label: "Total Issues", value: totalIssues, color: "#94a3b8" },
              { label: "Critical", value: criticalCount, color: "#ef4444" },
              { label: "High", value: highCount, color: "#f97316" },
              { label: "Medium", value: mediumCount, color: "#eab308" },
            ].map(({ label, value, color }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.05)",
                border: `1px solid rgba(255,255,255,0.08)`,
                borderRadius: 8,
                padding: "0.75rem 1.25rem",
                minWidth: 100,
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: "0.75rem", opacity: 0.5, marginTop: 4, fontFamily: "monospace" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category filter */}
      <div style={{
        background: "#13131a",
        borderBottom: "1px solid #2a2a3e",
        padding: "0.75rem 2rem",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {["all", ...issues.map(i => i.category)].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                background: activeCategory === cat ? "#c9a84c" : "transparent",
                color: activeCategory === cat ? "#000" : "#888",
                border: `1px solid ${activeCategory === cat ? "#c9a84c" : "#2a2a3e"}`,
                borderRadius: 20,
                padding: "0.3rem 0.9rem",
                fontSize: "0.78rem",
                cursor: "pointer",
                fontFamily: "monospace",
                fontWeight: activeCategory === cat ? 700 : 400,
                transition: "all 0.15s",
                letterSpacing: 0.5,
              }}
            >
              {cat === "all" ? "ALL CATEGORIES" : cat.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Issues */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem" }}>
        {filteredIssues.map(category => (
          <div key={category.category} style={{ marginBottom: "2.5rem" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              marginBottom: "1rem",
              paddingBottom: "0.75rem",
              borderBottom: "1px solid #2a2a3e",
            }}>
              <span style={{ fontSize: "1.4rem" }}>{category.icon}</span>
              <h2 style={{
                fontSize: "1rem",
                fontWeight: 700,
                margin: 0,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#c9a84c",
                fontFamily: "monospace",
              }}>{category.category}</h2>
              <span style={{
                marginLeft: "auto",
                fontSize: "0.75rem",
                fontFamily: "monospace",
                color: "#555",
              }}>{category.items.length} issue{category.items.length !== 1 ? "s" : ""}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {category.items.map(item => {
                const sev = severityConfig[item.severity];
                const isOpen = openItems[item.id];
                return (
                  <div key={item.id} style={{
                    background: "#1a1a24",
                    border: "1px solid #2a2a3e",
                    borderLeft: `3px solid ${sev.color}`,
                    borderRadius: 8,
                    overflow: "hidden",
                  }}>
                    <button
                      onClick={() => toggle(item.id)}
                      style={{
                        width: "100%",
                        background: "none",
                        border: "none",
                        padding: "1rem 1.25rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "0.75rem",
                        textAlign: "left",
                        color: "inherit",
                      }}
                    >
                      <span style={{
                        background: sev.color,
                        color: "#fff",
                        fontSize: "0.65rem",
                        fontWeight: 700,
                        padding: "0.2rem 0.5rem",
                        borderRadius: 3,
                        fontFamily: "monospace",
                        letterSpacing: 1,
                        whiteSpace: "nowrap",
                        marginTop: 2,
                        flexShrink: 0,
                      }}>{sev.label.toUpperCase()}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "#f0f0f0", marginBottom: "0.25rem" }}>
                          {item.title}
                        </div>
                        <div style={{ fontSize: "0.82rem", color: "#888", lineHeight: 1.5, fontFamily: "sans-serif" }}>
                          {item.description}
                        </div>
                      </div>
                      <span style={{
                        color: "#555",
                        fontSize: "0.9rem",
                        flexShrink: 0,
                        marginTop: 2,
                        transition: "transform 0.2s",
                        display: "inline-block",
                        transform: isOpen ? "rotate(180deg)" : "none",
                      }}>▼</span>
                    </button>

                    {isOpen && (
                      <div style={{
                        borderTop: "1px solid #2a2a3e",
                        padding: "1rem 1.25rem",
                        background: "#13131a",
                      }}>
                        <div style={{
                          fontSize: "0.72rem",
                          fontFamily: "monospace",
                          color: "#c9a84c",
                          letterSpacing: 2,
                          marginBottom: "0.75rem",
                        }}>SOLUTION & CODE FIX</div>
                        <pre style={{
                          background: "#0a0a0f",
                          border: "1px solid #2a2a3e",
                          borderRadius: 6,
                          padding: "1rem",
                          fontSize: "0.78rem",
                          fontFamily: "'Courier New', monospace",
                          overflowX: "auto",
                          margin: 0,
                          color: "#b8f4b8",
                          lineHeight: 1.6,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}>{item.fix}</pre>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Summary */}
        <div style={{
          background: "#1a1a24",
          border: "1px solid #2a2a3e",
          borderRadius: 8,
          padding: "1.5rem",
          marginTop: "1rem",
        }}>
          <h3 style={{
            fontFamily: "monospace",
            fontSize: "0.75rem",
            letterSpacing: 2,
            color: "#c9a84c",
            margin: "0 0 1rem",
            textTransform: "uppercase",
          }}>Recommended Priority Order</h3>
          <ol style={{ margin: 0, paddingLeft: "1.25rem", fontFamily: "sans-serif", fontSize: "0.85rem", lineHeight: 2, color: "#aaa" }}>
            <li><strong style={{ color: "#ef4444" }}>Fix broken link typo</strong> — /funcation-and-party-brand/ → immediate 404 fix</li>
            <li><strong style={{ color: "#ef4444" }}>Remove duplicate navs</strong> — consolidate to single semantic &lt;nav&gt;</li>
            <li><strong style={{ color: "#ef4444" }}>Replace hotlinked Facebook images</strong> — tokens will expire</li>
            <li><strong style={{ color: "#f97316" }}>Fix all blog/guide links</strong> — pointing to /about-us/ kills SEO</li>
            <li><strong style={{ color: "#f97316" }}>Category card deep links</strong> — add ?category= filtering</li>
            <li><strong style={{ color: "#f97316" }}>Add JSON-LD structured data</strong> — easy SEO win</li>
            <li><strong style={{ color: "#f97316" }}>Standardize legal entity name</strong> — trust/brand consistency</li>
            <li><strong style={{ color: "#eab308" }}>Add lazy loading + srcset</strong> — performance uplift</li>
            <li><strong style={{ color: "#eab308" }}>Add CSP & security headers</strong> — .htaccess one-liner</li>
            <li><strong style={{ color: "#eab308" }}>Accessibility: skip nav + aria labels</strong> — WCAG compliance</li>
          </ol>
        </div>

        <p style={{ textAlign: "center", opacity: 0.3, fontSize: "0.75rem", fontFamily: "monospace", marginTop: "2rem" }}>
          Stars Entertainment Audit · Generated April 2026
        </p>
      </div>
    </div>
  );
}
