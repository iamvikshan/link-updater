#!/bin/sh

# Install required dependencies with bun
bun add -d husky

# Initialize husky
bun husky init

# Create pre-commit hook
cat > .husky/pre-commit << 'EOF'
#!/bin/sh
export PATH="/usr/local/bin:$PATH"
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

bun run build
bun run package
EOF



# Make the Husky scripts executable
chmod +x .husky/pre-commit
chmod +x .husky/setup.sh

echo "Husky setup completed successfully!"
