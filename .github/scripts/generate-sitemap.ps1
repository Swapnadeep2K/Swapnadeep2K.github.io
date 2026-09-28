$ErrorActionPreference = 'Stop'

$siteUrl = 'https://swapnadeep2k.github.io'
$root = Resolve-Path (Join-Path $PSScriptRoot '../..')
$pages = @(
  @{ Path = 'index.html'; Url = '/' }
  @{ Path = 'projects.html'; Url = '/projects.html' }
  @{ Path = 'about.html'; Url = '/about.html' }
  @{ Path = 'experience.html'; Url = '/experience.html' }
  @{ Path = 'writing.html'; Url = '/writing.html' }
  @{ Path = 'now.html'; Url = '/now.html' }
  @{ Path = 'contact.html'; Url = '/contact.html' }
)

$entries = foreach ($page in $pages) {
  $relativePath = $page.Path.Replace('/', [IO.Path]::DirectorySeparatorChar)
  $date = (git -C $root.Path log -1 --format='%ad' --date=short -- $relativePath).Trim()

  if (-not $date) {
    throw "No commit date found for $($page.Path)."
  }

  "  <url><loc>$siteUrl$($page.Url)</loc><lastmod>$date</lastmod></url>"
}

$xml = @(
  '<?xml version="1.0" encoding="UTF-8"?>'
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
  $entries
  '</urlset>'
) -join [Environment]::NewLine

Set-Content -Path (Join-Path $root.Path 'sitemap.xml') -Value $xml -Encoding utf8