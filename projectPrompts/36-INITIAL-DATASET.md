# Comment

We want to create a sample dataset for Fireworks.AI to create a finetuning job.

# Preparation steps

Make sure we don't need to explicitly import elements from w2l anymore in our examples. Hide this out from the code, but essentially just import all of them together for the user. Essentially, add a checkbox marked by default to true to Playground that says "Autoimport". Don't change the examples retrospectively, this shouldn't be an issue for existing examples that have imports already (correct me if I'm wrong here).

# Prompt

We need to create a script that will, for each out examples, prompt a LLM to write a plausible prompt to an assistant that should have written that example. Let's create two prompts per each example.

Requirements for this step:

-The prompts should be accurate about values _if they're known_, count of things ("three trinagles"), layout if desired for one example, and inaccurate ("create a bunch of trinagles with altitudes") in another example.

- The prompt _CANNOT_ involve any library specifics (it can't know of existence of specific elements in the library).

How to achieve this:

- A simple LLM pipeline; we will prompt GPT-5 to create our target prompts (we have OPENAI_API_KEY and an exapmle of OpenAI's usage). Let's use structured output to have the prompts, and save them in /dataset/simple_examples as JSON.
- The pipeline should record its progress - if interrupted, we should be able to resume from the same example
- The final output of the pipeline is basically a dataset in Fireworks.ai compatible format:

```json
[
  {
    "role": "system",
    "content": "You are an assistant that responds with code for drawing whatever user has requested in our library."
  },
  {
    "role": "user",
    "content": "Draw a visual representation of pythagorean theorem. Only the geometry, no text."
  },
  {
    "role": "assistant",
    "content": "
    <the block with relevant javascript example we have; add entire file, SKIP THE IMPORTS STATEMENTS>
    "
  },
  {

  }
]
```

"You are creating a synthetic dataset of prompts that could result with certain code. The code is always using
