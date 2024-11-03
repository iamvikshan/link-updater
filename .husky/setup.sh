#!/bin/sh

# Install required dependencies with bun
bun add -d husky lint-staged

# Initialize husky
bun husky init

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
export PATH="/usr/local/bin:$PATH"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

bun lint-staged
EOF

# Create pre-push hook
cat > .husky/pre-push << 'EOF'
#!/bin/sh
export PATH="/usr/local/bin:$PATH"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

bun run build
EOF

# Create lint-staged configuration
cat > .lintstagedrc.json << 'EOF'
{
  "src/**/*.{js,jsx,ts,tsx}": [
    "bun eslint --fix",
    "bun prettier --write"
  ]
}
EOF


# Make the Husky scripts executable
chmod +x .husky/pre-commit
chmod +x .husky/pre-push
chmod +x .husky/setup.sh

echo "Husky setup completed successfully!"
