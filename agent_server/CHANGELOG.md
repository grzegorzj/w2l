# Changelog

## [2.0.0] - Cerebras Integration - 2025-11-29

### Added
- ✨ **Full Cerebras Integration** - Server now handles all AI interactions
- 🔧 Automatic tool calling loop built into server
- 🎯 System prompt builder with context
- 🔄 Streaming support via `/v1/chat/completions/stream`
- 📝 `test-ai.sh` - AI testing script
- 📚 `CEREBRAS_INTEGRATION.md` - Integration documentation
- 🔌 `.env` support for API key management

### Changed
- 🔄 **BREAKING**: Server now requires `CEREBRAS_API_KEY` in `../.env` for AI features
- 📝 Simplified `cerebras-example.js` - now just calls server instead of managing loop
- 📖 Updated all documentation (README, QUICKSTART, INTEGRATION)
- 🏗️ Server architecture completely rewritten

### Technical
- Added dependencies: `@cerebras/cerebras_cloud_sdk`, `dotenv`
- Server loads `.env` from project root
- Graceful degradation: works without API key for testing endpoints
- Tool execution integrated into server
- Max 10 iterations to prevent infinite loops

### Migration
**Before:** Client managed tool calling loop  
**After:** Just POST to `/v1/chat/completions` and get result

No client changes needed if using the API endpoint!

## [1.0.0] - Initial Release - 2025-11-29

### Added
- 🎯 Tool calling infrastructure
- 📚 Automatic documentation generation from TypeScript
- 🔧 Two tools: `get_guides`, `get_elements`
- 📝 Two guides: `basic-shapes`, `layouts`
- 🚀 Express server with OpenAI-compatible API
- 🧪 Test scripts and examples
- 📖 Comprehensive documentation

### Features
- Programmatic element extraction from `/lib`
- Guide system with metadata
- Tool schemas in OpenAI format
- Mock Cerebras integration (replaced in 2.0.0)

