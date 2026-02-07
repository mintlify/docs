# Spotify Web API Documentation

This is a comprehensive Mintlify documentation site for the Spotify Web API, generated from the official Spotify Developer documentation.

## Overview

This documentation includes:

- **Getting Started**: Learn the basics of the Spotify Web API
- **Concepts**: Core concepts like authentication, rate limits, and scopes
- **Tutorials**: Step-by-step guides for implementing authentication flows
- **API Reference**: Complete endpoint documentation for all 100+ endpoints

## Structure

```
workspace/
├── mint.json                 # Mintlify configuration
├── index.mdx                 # Homepage
├── getting-started/          # Getting started guides
│   ├── overview.mdx
│   ├── authentication-flows.mdx
│   └── making-api-calls.mdx
├── concepts/                 # Core concepts
│   ├── access-tokens.mdx
│   ├── authorization.mdx
│   ├── apps.mdx
│   ├── api-calls.mdx
│   ├── rate-limits.mdx
│   ├── scopes.mdx
│   ├── spotify-uris.mdx
│   ├── quota-modes.mdx
│   ├── track-relinking.mdx
│   ├── playlists.mdx
│   └── redirect-uris.mdx
├── tutorials/                # Step-by-step tutorials
│   ├── getting-started.mdx
│   ├── authorization-code-flow.mdx
│   ├── authorization-code-pkce.mdx
│   ├── client-credentials-flow.mdx
│   ├── implicit-grant-flow.mdx
│   ├── refreshing-tokens.mdx
│   └── web-playback-sdk.mdx
└── api-reference/            # API endpoint documentation
    ├── overview.mdx
    ├── albums/               # 8 endpoints
    ├── artists/              # 5 endpoints
    ├── audiobooks/           # 7 endpoints
    ├── categories/           # 2 endpoints
    ├── chapters/             # 2 endpoints
    ├── episodes/             # 6 endpoints
    ├── genres/               # 1 endpoint
    ├── markets/              # 1 endpoint
    ├── player/               # 15 endpoints
    ├── playlists/            # 13 endpoints
    ├── search/               # 1 endpoint
    ├── shows/                # 7 endpoints
    ├── tracks/               # 10 endpoints
    └── users/                # 10 endpoints
```

## Features

✅ **111 MDX files** covering all aspects of the Spotify Web API
✅ **Spotify branding** with green color scheme (#1DB954)
✅ **Organized navigation** with tabs for API Reference and Tutorials
✅ **Rich content** with code examples, accordions, cards, and more
✅ **Best practices** throughout the documentation
✅ **Cross-referenced** pages for easy navigation

## Setup

### Prerequisites

- Node.js 18+ or higher
- npm or yarn

### Installation

1. Install Mintlify CLI:

```bash
npm install -g mintlify
```

2. Navigate to the workspace directory:

```bash
cd /home/daytona/workspace
```

3. Start the development server:

```bash
mintlify dev
```

The documentation will be available at `http://localhost:3000`.

## Customization

### Add logos

Add your logo files to the `logo/` directory:
- `logo/light.svg` - Light mode logo
- `logo/dark.svg` - Dark mode logo
- `favicon.png` - Browser favicon

You can use the official Spotify logo from: https://developer-assets.spotifycdn.com/images/logo.svg

### Colors

The documentation uses Spotify's brand colors:
- Primary: `#1DB954` (Spotify Green)
- Light: `#1ED760`
- Dark: `#1DB954`

You can customize colors in `mint.json`.

## Deployment

### Deploy to Mintlify

1. Create a Mintlify account at https://mintlify.com
2. Connect your GitHub repository
3. Mintlify will automatically deploy your documentation

### Deploy to Vercel/Netlify

Mintlify sites can also be deployed to Vercel, Netlify, or other hosting platforms. Follow the [Mintlify deployment guide](https://mintlify.com/docs/deployment) for more information.

## Content

All content is written in MDX format and includes:

- **YAML frontmatter** with title and description
- **Mintlify components**: Cards, Accordions, Tabs, Code blocks, etc.
- **Code examples** in multiple languages
- **Best practices** and tips
- **Cross-references** between pages

## API Reference Structure

Each API endpoint page includes:

- Endpoint URL and HTTP method
- Description and use case
- Authentication requirements
- Required scopes (if applicable)
- Example requests and responses
- Related endpoints

## Contributing

To add or update content:

1. Edit the relevant `.mdx` file
2. Test locally with `mintlify dev`
3. Commit and push changes
4. Mintlify will auto-deploy (if connected)

## Resources

- [Mintlify Documentation](https://mintlify.com/docs)
- [Spotify Web API Official Docs](https://developer.spotify.com/documentation/web-api)
- [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

## File Count

- **Total MDX files**: 111
  - Homepage: 1
  - Getting Started: 3
  - Concepts: 11
  - Tutorials: 7
  - API Reference: 89 (including overview)

## License

The content in this documentation is based on the official Spotify Web API documentation. Please refer to [Spotify's Developer Terms of Service](https://developer.spotify.com/terms) for usage guidelines.

## Maintainer

Generated using automated documentation tools from the official Spotify Web API documentation.
