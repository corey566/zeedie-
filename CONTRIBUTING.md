
# Contributing to ZEEDIE Portfolio

First off, thank you for considering contributing to this project! 🎉

## Code of Conduct

This project adheres to a code of conduct. By participating, you are expected to uphold this code. Please be respectful and constructive in all interactions.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues. When creating a bug report, include:

- **Clear title and description**
- **Steps to reproduce** the problem
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment details** (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, include:

- **Clear use case** for the feature
- **Detailed description** of the proposed functionality
- **Why this would be useful** to users
- **Possible implementation approach**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. Make your changes following the code style
3. Add tests if applicable
4. Update documentation
5. Ensure the test suite passes
6. Create a pull request!

## Development Process

### Setup Development Environment

```bash
# Clone your fork
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

### Code Style

- Use TypeScript for all new code
- Follow existing formatting (2 spaces, semicolons)
- Use meaningful variable and function names
- Add comments for complex logic
- Keep components small and focused

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit first line to 72 characters
- Reference issues and pull requests

Example:
```
Add GitHub contribution graph component

- Fetch data from GitHub API
- Display contribution calendar
- Add responsive grid layout

Closes #123
```

### Testing

- Test your changes locally before submitting
- Verify responsive design on multiple devices
- Check browser compatibility
- Test admin panel functionality

## Project Structure

```
client/    - Frontend React application
server/    - Backend Express API
shared/    - Shared types and schemas
db/        - Database connection
script/    - Build and utility scripts
```

## Need Help?

Don't hesitate to ask questions! You can:
- Open an issue for discussion
- Reach out via email
- Join community discussions

Thank you for contributing! 🙏
