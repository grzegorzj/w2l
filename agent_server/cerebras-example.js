/**
 * Example: Using W2L Agent with Cerebras (Simple Client)
 * 
 * This is a simple client example. The server now handles all Cerebras integration.
 * 
 * Setup:
 * 1. Set CEREBRAS_API_KEY in ../.env file
 * 2. Start the agent server: npm run dev
 * 3. Run this example: node cerebras-example.js "Create a circle"
 */

const AGENT_SERVER_URL = 'http://localhost:3100';

/**
 * Call the AI agent (server handles Cerebras integration)
 */
async function callAgent(userQuery) {
  const response = await fetch(`${AGENT_SERVER_URL}/v1/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [
        { role: 'user', content: userQuery }
      ]
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
}

/**
 * Run the agent (simplified - server handles everything)
 */
async function runAgent(userQuery) {
  console.log('🤖 W2L Agent with Cerebras');
  console.log('==========================\n');
  console.log('📝 Query:', userQuery);
  console.log('');

  console.log('🔄 Calling agent (server will handle tool calls)...\n');

  const response = await callAgent(userQuery);
  
  console.log('✨ Agent Response:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(response.choices[0].message.content);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  if (response.usage) {
    console.log('📊 Usage:');
    console.log(`   Tokens: ${response.usage.total_tokens}`);
    console.log(`   Model: ${response.model}\n`);
  }
}

/**
 * Example usage
 */
async function main() {
  const query = process.argv[2] || 
    'Create a simple diagram showing a blue circle and a red rectangle side by side';

  try {
    await runAgent(query);
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('CEREBRAS_API_KEY')) {
      console.log('\n💡 Setup required:');
      console.log('   1. Create ../.env file in project root');
      console.log('   2. Add: CEREBRAS_API_KEY=your-key-here');
      console.log('   3. Restart the server: npm run dev');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 Server not running:');
      console.log('   Start it with: npm run dev');
    }
    
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { runAgent, callAgent };

