export interface VidyaLessonBlueprint {
  mission: string;
  mentorLine: string;
  whyItMatters: string;
  architectureFocus: string[];
  walkthrough: Array<{ title: string; detail: string }>;
  challenge: {
    title: string;
    prompt: string;
    starter: string;
    successSignal: string;
  };
  deliverable: string;
  nextMove: string;
}

export const VIDYA_LESSON_BLUEPRINTS: Record<string, VidyaLessonBlueprint> = {
  PY_L2_05_DATA: {
    mission: "Build a resilient data-ingestion client that can authenticate, fetch, validate, and normalize API payloads.",
    mentorLine: "Professional backends do not just fetch JSON. They defend against latency, auth drift, and upstream rate limits.",
    whyItMatters: "Every serious product depends on external data contracts. This module teaches you to engineer those integrations safely.",
    architectureFocus: ["API request lifecycle", "auth headers", "response validation", "retry and rate-limit strategy"],
    walkthrough: [
      { title: "Contract first", detail: "Define the endpoint, headers, timeout, and the normalized response shape before writing request logic." },
      { title: "Defensive fetch", detail: "Use explicit timeouts, inspect status codes, and separate transport errors from business errors." },
      { title: "Normalization layer", detail: "Convert raw JSON into stable Python dictionaries or typed models that the rest of your service can trust." },
    ],
    challenge: {
      title: "Global Market Pulse Client",
      prompt: "Write a Python function fetch_market_snapshot(session, url, api_key) that sends authenticated requests, rejects non-200 responses, and returns a normalized dict with symbol, price, and volume.",
      starter: "import requests\n\n\ndef fetch_market_snapshot(session: requests.Session, url: str, api_key: str) -> dict:\n    headers = {\n        \"Authorization\": f\"Bearer {api_key}\",\n        \"Accept\": \"application/json\",\n    }\n    # TODO: perform request, validate response, normalize payload\n    raise NotImplementedError\n",
      successSignal: "A reusable integration layer with clean error handling and a predictable return shape.",
    },
    deliverable: "A production-ready API adapter for a dashboard or analytics service.",
    nextMove: "Move into persistent storage so fetched records can be audited and queried later.",
  },
  PY_L2_09_SQL: {
    mission: "Design a safe persistence layer that turns service events into queryable relational records.",
    mentorLine: "A database is an architectural boundary. The code around it determines whether your system is trustworthy or fragile.",
    whyItMatters: "Backend systems must store data safely, query it efficiently, and prevent injection or malformed writes under pressure.",
    architectureFocus: ["schema thinking", "CRUD boundaries", "parameterized SQL", "query performance"],
    walkthrough: [
      { title: "Model the entity", detail: "Start with the table shape, primary key, uniqueness constraints, and the fields your service truly needs." },
      { title: "Separate read and write paths", detail: "Keep inserts, updates, and reporting queries clear so later optimizations stay simple." },
      { title: "Secure every query", detail: "Never interpolate user input into SQL strings. Use placeholders and parameter tuples every time." },
    ],
    challenge: {
      title: "Learner Progress Repository",
      prompt: "Implement create_progress_record(conn, learner_id, module_code, accuracy) and list_progress_for_learner(conn, learner_id) using parameterized PostgreSQL queries.",
      starter: "def create_progress_record(conn, learner_id: int, module_code: str, accuracy: float) -> None:\n    sql = \"INSERT INTO learner_progress (learner_id, module_code, accuracy) VALUES (%s, %s, %s)\"\n    # TODO: execute safely and commit\n\n\ndef list_progress_for_learner(conn, learner_id: int) -> list[tuple]:\n    sql = \"SELECT module_code, accuracy FROM learner_progress WHERE learner_id = %s ORDER BY created_at DESC\"\n    # TODO: execute safely and return rows\n",
      successSignal: "Queries are parameterized, commits are explicit, and result access is clean and testable.",
    },
    deliverable: "A secure repository layer for student progress or transaction records.",
    nextMove: "Expose this persistence layer behind a Flask or FastAPI endpoint.",
  },
  PY_L2_10_FLASK: {
    mission: "Ship a small web microservice with predictable routes, sessions, and production-style response contracts.",
    mentorLine: "Routing is only the surface. The real skill is shaping request flow, state boundaries, and clean handler responsibilities.",
    whyItMatters: "Microservices let teams deploy independently. This module trains you to carve off a stable backend boundary that can scale.",
    architectureFocus: ["Flask routing", "request/response shape", "session boundaries", "deployment readiness"],
    walkthrough: [
      { title: "Define core endpoints", detail: "Choose the minimal set of routes needed for health, data retrieval, and secure state changes." },
      { title: "Validate inputs", detail: "Request parsing and error responses should be explicit so clients can recover gracefully." },
      { title: "Harden for deployment", detail: "Add environment-aware config, health checks, and predictable JSON responses for monitoring." },
    ],
    challenge: {
      title: "Vidya Session Service",
      prompt: "Create Flask routes for GET /health, POST /session/start, and GET /session/<learner_id> with JSON responses and basic session validation.",
      starter: "from flask import Flask, jsonify, request\n\napp = Flask(__name__)\n\n\n@app.get('/health')\ndef health():\n    return jsonify({\"status\": \"ok\"})\n\n\n# TODO: add session routes\n",
      successSignal: "A small but deployable Flask service with stable endpoints and understandable control flow.",
    },
    deliverable: "A microservice shell ready to connect to persistence and authentication.",
    nextMove: "Use the same service boundary patterns in analytics and AI inference endpoints.",
  },
  PY_L2_08_NUMPY: {
    mission: "Use vectorized thinking to replace slow Python loops with array-native computation.",
    mentorLine: "NumPy is not just faster syntax. It changes how you think about data movement, shape alignment, and large-scale math.",
    whyItMatters: "Most serious analytics and ML pipelines depend on array transformations that must remain fast and mathematically clear.",
    architectureFocus: ["array shape reasoning", "vectorization", "broadcasting", "numerical modeling"],
    walkthrough: [
      { title: "Think in columns", detail: "Shift from item-by-item iteration to full-array operations that transform entire signals at once." },
      { title: "Use broadcasting deliberately", detail: "Shape-compatible arithmetic lets you apply rules across datasets without manual loops." },
      { title: "Measure model outputs", detail: "Summaries like mean, std, and normalized scores make raw arrays decision-ready." },
    ],
    challenge: {
      title: "Revenue Growth Simulator",
      prompt: "Given monthly revenue and a projected growth factor, compute forecasted revenue, profit margin array, and a normalized score vector using NumPy.",
      starter: "import numpy as np\n\n\ndef build_growth_report(revenue: np.ndarray, growth_rate: float, cost_ratio: float) -> dict:\n    # TODO: vectorize forecast, profit, and normalized score calculations\n    raise NotImplementedError\n",
      successSignal: "The full report is vectorized and uses array operations rather than manual loops.",
    },
    deliverable: "A compact analytics engine suitable for dashboards or model features.",
    nextMove: "Move from arrays to labeled business datasets with Pandas.",
  },
  PY_L2_02_PANDAS: {
    mission: "Turn raw operational records into structured insight with repeatable cleaning and aggregation pipelines.",
    mentorLine: "Analysts become valuable when they can trust their data transformations. Pandas gives you that leverage if you stay disciplined.",
    whyItMatters: "Data products live or die on clean joins, missing-value strategy, and the ability to summarize records quickly.",
    architectureFocus: ["DataFrame cleaning", "groupby analytics", "time-aware transformations", "missing-data recovery"],
    walkthrough: [
      { title: "Audit the frame", detail: "Inspect schema, nulls, duplicates, and category spread before making analytical claims." },
      { title: "Clean with intent", detail: "Each fill, drop, or cast should reflect a clear business rule rather than a cosmetic fix." },
      { title: "Aggregate to decisions", detail: "Summaries should answer operational questions such as region performance, cohort quality, or trend movement." },
    ],
    challenge: {
      title: "Cohort Performance Analyzer",
      prompt: "Load a DataFrame of learner records, clean missing scores, create a pass/fail signal, and return grouped average accuracy by cohort.",
      starter: "import pandas as pd\n\n\ndef summarize_cohorts(df: pd.DataFrame) -> pd.DataFrame:\n    # TODO: clean data, derive pass/fail, aggregate by cohort\n    raise NotImplementedError\n",
      successSignal: "A clean, reproducible aggregation that another analyst could inspect and extend.",
    },
    deliverable: "A notebook-ready analysis pipeline for real student or business data.",
    nextMove: "Feed cleaned datasets into model training or dashboard reporting layers.",
  },
  PY_L3_01_DL: {
    mission: "Understand the training loop that turns raw tensors into a learning system.",
    mentorLine: "Deep learning mastery starts when you can explain every stage of the forward pass, loss calculation, and weight update pipeline.",
    whyItMatters: "Modern AI engineers need more than library usage. They need mental models for optimization, instability, and model debugging.",
    architectureFocus: ["forward pass", "loss functions", "backpropagation", "optimizer steps"],
    walkthrough: [
      { title: "Model the flow", detail: "Inputs move through layers, produce predictions, and are measured against a loss objective." },
      { title: "Backpropagate signal", detail: "Gradients tell the optimizer how each weight contributed to error." },
      { title: "Stabilize training", detail: "Batching, normalization, and learning-rate choice determine whether the model learns or diverges." },
    ],
    challenge: {
      title: "Mini Classifier Training Loop",
      prompt: "Sketch a training loop for a small PyTorch classifier, including forward pass, loss computation, backward pass, and optimizer step.",
      starter: "for epoch in range(epochs):\n    for batch_x, batch_y in loader:\n        # TODO: forward, loss, backward, step\n        pass\n",
      successSignal: "You can explain the role of each stage instead of copying the pattern blindly.",
    },
    deliverable: "A blueprint-level deep learning lesson ready to expand into framework-specific labs.",
    nextMove: "Apply the same systems thinking to transformer pipelines and retrieval-augmented generation.",
  },
  PY_L3_02_NLP: {
    mission: "Break an LLM system into the components that make retrieval, context, and generation reliable.",
    mentorLine: "The strongest AI engineers think in pipelines: documents, chunks, embeddings, retrieval, prompting, and evaluation.",
    whyItMatters: "Real LLM products depend on architecture choices around context windows, grounding, latency, and memory.",
    architectureFocus: ["transformers", "tokenization", "vector stores", "retrieval architecture"],
    walkthrough: [
      { title: "Represent language", detail: "Tokenization turns raw text into structured input that transformer models can process." },
      { title: "Ground with retrieval", detail: "Embeddings and vector search let the system pull relevant context before generation." },
      { title: "Evaluate outputs", detail: "Prompt quality, retrieval quality, and citation fidelity all affect trustworthiness." },
    ],
    challenge: {
      title: "Retrieval-Augmented Tutor Blueprint",
      prompt: "Outline a pipeline that ingests lesson notes, stores embeddings, retrieves top-k chunks, and injects them into a tutoring prompt.",
      starter: "docs = load_documents()\nchunks = split_documents(docs)\n# TODO: embed, store, retrieve, prompt\n",
      successSignal: "The architecture clearly separates ingestion, retrieval, and generation concerns.",
    },
    deliverable: "A system design blueprint for a grounded AI tutor or enterprise assistant.",
    nextMove: "Connect the LLM pipeline to product APIs, telemetry, and evaluation loops.",
  },
};
