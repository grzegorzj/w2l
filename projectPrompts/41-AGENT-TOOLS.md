# Comment

Trivial agentic behaviour is needed.

# Prompt

We want to implement a basic agent using our library to generate SVGs.

In order for our agent to perform well, we need two things created in agent_server (from scratch):

1. A tool caling infrastructure; we will be using Cerebras as hosting provider, and we need to handle tool calls and structured JSON.

The tool call that we specifically want to handle are:

- Get API definition for a given element
- Read guidelines for a certain type of task.

It actually should fall within one two calls;

```json
{
  "guides": [] // guides that the agent thinks it needs - it will be pre-prompted to decide which ones suit most
}
```

```json
{
  "elements": [] // after reading the guides, the agent should be more capable of deciding on the overall flow/needed elements
}
```

The agent will be instructed which elements are overall accessible and recommended for what tasks (in general), and guides will be retrieved depending on agents interpretation of the task.

They will be returned as the tool output.

The elements definitions should be retrieved from our source of the library (`/lib`) automatically on each build.

The guides should be stored in agent_server/guides. Their list alongside with summary of whats inside will also be presented to the agent prior to tool calling

The part of composing a list of available guides and elements to the agent should be programmatic, e.g. we should be able to generate this prompt each time the library/guides folder changes.

2. Implementation of the aforementioned tools. They should simply return the guides/documentation in a sensible format (only for requested elements).

---

For now, build all of this for just one fake guide (feel free to make it). Make sure the programmatic update of available documentation happens on build of the library.

Create easy, one liner run for this to be tested. It should expose OpenAI-like API.
