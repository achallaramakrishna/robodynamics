import type { VidyaLessonPayload } from "./vidyaLessonTypes";

export const PY_L2_05_DATA_LESSON: VidyaLessonPayload = {
  product: { id: "vidya", name: "Vidya Python AI Tutor" },
  course: { id: "py_specialist", levelId: "L2", levelSlug: "fullstack", title: "Vidya Specialist: Full-Stack Architect" },
  lesson: {
    id: "PY_L2_05_DATA",
    order: 1,
    title: "REST APIs & JSON Engineering",
    sutra: "Defensive Integrations",
    objective: "Build a resilient data-ingestion client that can authenticate, fetch, validate, and normalize API payloads.",
    durationMin: 60,
    difficulty: 3,
    xpReward: 150,
  },
  progress: { currentStepIndex: 0, totalSteps: 6 },
  steps: [
    {
      id: "intro",
      label: "Global Market Pulse",
      tutorText: "Your startup's dashboard needs to show live stock prices, but the data lives on a remote server. We need to build a resilient integration. Professional backends do not just fetch JSON—they defend against latency, auth drift, and upstream rate limits.",
      board: {
        type: "intro_card",
        data: {
          headline: "Building a Defensive API Client",
          emoji: "🌐",
          example: "Requests → Auth Headers → Timeout → JSON Parse",
          goal: "Write a function that securely fetches and validates external data.",
        },
      },
      actions: [{ id: "next", label: "Show me the syntax", primary: true }],
    },
    {
      id: "concept",
      label: "Contract First",
      tutorText: "Before writing the request, define the endpoint, headers, and the expected JSON shape. Never trust remote data without validating it.",
      board: {
        type: "concept_card",
        data: {
          title: "The Defensive Fetch",
          emoji: "🛡️",
          points: [
            "Headers: Pass your API key via 'Authorization: Bearer <key>'",
            "Timeouts: Always use timeout=10. Never let your server hang forever.",
            "Status checks: Check if response.status_code == 200 before parsing.",
            "Normalization: Convert raw JSON into a typed model or clean dictionary.",
          ],
        },
      },
      explanation: {
        title: "Why it matters",
        body: "Every serious product depends on external data contracts. This module teaches you to engineer those integrations safely so they don't crash your entire server if an external API goes down.",
      },
      actions: [{ id: "next", label: "See the code", primary: true }],
    },
    {
      id: "worked_example",
      label: "The Requests Pipeline",
      tutorText: "Let's look at how to structure a robust API call using the `requests` library.",
      board: {
        type: "code_walkthrough",
        data: {
          expression: "Fetching User Profiles safely",
          steps: [
            "import requests",
            "headers = {'Authorization': 'Bearer test_key'}",
            "response = requests.get('https://api.example.com/users', headers=headers, timeout=5.0)",
            "if response.status_code == 200:\n    data = response.json()",
          ],
          result: "We explicitly guard against hangs (timeout) and errors (status_code).",
        },
      },
      actions: [{ id: "next", label: "Test my knowledge", primary: true }],
    },
    {
      id: "practice_concept",
      label: "Concept Check",
      tutorText: "Let's make sure you understand the core concepts of defensive fetching before we build the client.",
      board: {
        type: "practice_board",
        data: {
          headline: "API Safeguards",
          prompt: "What is the single most critical parameter to include in requests.get() to prevent your backend from hanging indefinitely if the external server is down?",
        },
      },
      practice: {
        mode: "multiple_choice",
        prompt: "Select the required parameter:",
        answer: "timeout",
        hints: ["It defines how long to wait before giving up.", "It starts with 'time'."],
      },
      actions: [{ id: "next", label: "Enter the Sandbox", primary: true }],
    },
    {
      id: "challenge",
      label: "Market Snapshot Client",
      tutorText: "Now, write the function `fetch_market_snapshot(url, api_key)` from scratch. It must send authenticated requests, reject non-200 responses, and return a normalized dict.",
      board: {
        type: "python_repl_simulator",
        data: {
          title: "Global Market Pulse Challenge",
        },
      },
      practice: {
        mode: "code_snippet",
        prompt: "Write a Python function fetch_market_snapshot(session, url, api_key) that sends authenticated requests, rejects non-200 responses, and returns a normalized dict with symbol, price, and volume.",
        starterCode: "import requests\n\ndef fetch_market_snapshot(session: requests.Session, url: str, api_key: str) -> dict:\n    headers = {\n        \"Authorization\": f\"Bearer {api_key}\",\n        \"Accept\": \"application/json\",\n    }\n    # TODO: perform request, validate response, normalize payload\n    raise NotImplementedError\n",
        answer: "import requests\n\ndef fetch_market_snapshot(session, url, api_key):\n    headers = {'Authorization': f'Bearer {api_key}', 'Accept': 'application/json'}\n    res = session.get(url, headers=headers, timeout=10)\n    if res.status_code == 200:\n        return res.json()\n    return {}",
        hints: ["Use session.get(url, headers=headers, timeout=10)", "Check res.status_code"],
      },
      actions: [{ id: "next", label: "Complete Lesson", primary: true }],
    },
    {
      id: "recap",
      label: "Architect Certified",
      tutorText: "Excellent execution. You now have a reusable integration layer with clean error handling and a predictable return shape.",
      board: {
        type: "recap_summary",
        data: {
          title: "Integration Engineered 🚀",
          keyPoints: [
            "Defensive fetching protects your server from upstream failures.",
            "Always include strict timeouts.",
            "Explicitly check status codes before parsing JSON.",
            "Next Move: Move into persistent storage so fetched records can be queried."
          ],
        },
      },
      actions: [{ id: "finish", label: "Return to Path", primary: true }],
    },
  ],
  helpActions: [
    { id: "stuck_syntax", label: "I forgot the syntax" },
    { id: "explain_headers", label: "How do headers work again?" },
  ],
};
