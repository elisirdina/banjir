# Malaysia Flood Evacuation Dashboard

Real-time visualization of flood evacuation centers (PPS) data from JKM Malaysia.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Local Development:
```bash
# Run local server (if needed)
npx http-server docs
```

3. GitHub Actions Setup:
- Enable GitHub Actions in your repository settings
- Ensure the repository has proper permissions for Actions
- The workflow will automatically update data every 30 minutes

## Project Structure

```
banjir/
├── docs/                 # GitHub Pages directory
│   ├── data/            # Data files
│   ├── js/              # JavaScript files
│   └── styles/          # CSS files
├── .github/
│   ├── workflows/       # GitHub Actions workflows
│   └── scripts/         # Data fetching scripts
└── package.json         # Project dependencies
```

## Development

1. Data Updates:
- Automatic updates every 30 minutes via GitHub Actions
- Manual trigger available in Actions tab

2. Local Testing:
- Modify `docs/data/flood_data.json` for testing
- Use a local server to avoid CORS issues

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - See LICENSE file for details
