/**
 * Vidya Python Project Bank
 *
 * Real-world multi-file Python projects that take students from
 * in-browser Pyodide practice into professional IDE development.
 * Covers pip/venv, Poetry, pytest, Git, and GitHub Actions CI/CD.
 */

import type { DevProject } from "./devProjectTypes";

export const VIDYA_PROJECTS: DevProject[] = [

  // ── 1. Hello Python Package (Starter) ─────────────────────────────────────
  {
    id: "python-hello-package",
    platform: "python",
    tier: "starter",
    title: "Hello Python — pip + venv",
    emoji: "🐍",
    tagline: "Your first Python project with a virtual environment and pytest",
    description:
      "Set up a proper Python project using pip and venv (virtual environment). " +
      "Write a reusable greet() function in a package, run it from the terminal, " +
      "and add your first pytest tests.",
    estimatedHours: 2,
    prereqLevel: "level-1",
    prereqTopics: ["Variables", "Functions", "Input/Output", "Strings"],
    buildTool: "pip",
    versionMeta: { pythonVersion: "3.11", dependencies: { pytest: "7.4.3" } },
    primaryIde: "vscode",
    ideSetups: [
      {
        ide: "vscode",
        label: "VS Code",
        logoEmoji: "🔷",
        downloadUrl: "https://code.visualstudio.com/",
        extensions: [
          { id: "ms-python.python", name: "Python", required: true },
          { id: "ms-python.vscode-pylance", name: "Pylance", required: false },
        ],
        steps: [
          "Open the hello-python folder in VS Code: File → Open Folder",
          "Open terminal: Ctrl+` (backtick)",
          "Create a virtual environment: python -m venv .venv",
          "Activate it: source .venv/bin/activate  (Windows: .venv\\Scripts\\activate)",
          "Install dependencies: pip install -r requirements.txt",
          "Run the app: python -m hello_app",
          "Run tests: pytest",
        ],
        terminalCommands: [
          "python -m venv .venv",
          "source .venv/bin/activate",
          "pip install -r requirements.txt",
          "python -m hello_app",
          "pytest",
        ],
      },
      {
        ide: "any",
        label: "PyCharm",
        logoEmoji: "🐍",
        downloadUrl: "https://www.jetbrains.com/pycharm/download/",
        steps: [
          "Open PyCharm → Open → select hello-python/",
          "PyCharm detects requirements.txt and offers to install a venv — click Yes",
          "Run main.py with the ▶ button",
          "Run tests: right-click tests/ → Run pytest in tests/",
        ],
        terminalCommands: ["pip install -r requirements.txt", "pytest"],
      },
    ],
    files: [
      {
        path: "requirements.txt",
        language: "text",
        isKey: true,
        description: "Project dependencies — install with pip install -r requirements.txt",
        content: `# Testing
pytest==7.4.3
pytest-cov==4.1.0
`,
      },
      {
        path: "hello_app/__init__.py",
        language: "python",
        isKey: true,
        description: "Python package init — makes hello_app importable",
        content: `"""Hello App — a minimal Python package demo."""

from .greeter import greet

__all__ = ["greet"]
`,
      },
      {
        path: "hello_app/greeter.py",
        language: "python",
        isKey: true,
        description: "Core greeting logic",
        content: `"""
Greeter module.

Challenge: Add a formal_greet(name, title) function
that returns "Good day, Dr. Smith!" given ("Smith", "Dr.").
"""


def greet(name: str) -> str:
    """Return a personalised greeting.

    Args:
        name: The person to greet.

    Returns:
        A greeting string like "Hello, Alice!"

    Raises:
        ValueError: If name is empty or whitespace.
    """
    if not name or not name.strip():
        raise ValueError("Name cannot be empty")
    return f"Hello, {name.strip()}!"


def greet_many(names: list[str]) -> list[str]:
    """Return greetings for a list of names."""
    return [greet(name) for name in names]
`,
      },
      {
        path: "hello_app/__main__.py",
        language: "python",
        description: "Entry point when run as python -m hello_app",
        content: `"""Run with: python -m hello_app"""
from . import greet

if __name__ == "__main__":
    print(greet("Vidya Student"))
    print(greet("World"))
`,
      },
      {
        path: "tests/__init__.py",
        language: "python",
        isGenerated: true,
        description: "Makes tests/ a package",
        content: ``,
      },
      {
        path: "tests/test_greeter.py",
        language: "python",
        isKey: true,
        description: "pytest tests for greeter.py",
        content: `"""Tests for hello_app.greeter."""

import pytest
from hello_app.greeter import greet, greet_many


def test_greet_returns_hello():
    assert greet("Alice") == "Hello, Alice!"


def test_greet_strips_whitespace():
    assert greet("  Bob  ") == "Hello, Bob!"


def test_greet_raises_on_empty():
    with pytest.raises(ValueError):
        greet("")


def test_greet_raises_on_whitespace_only():
    with pytest.raises(ValueError):
        greet("   ")


def test_greet_many_returns_list():
    result = greet_many(["Alice", "Bob"])
    assert result == ["Hello, Alice!", "Hello, Bob!"]


def test_greet_many_empty_list():
    assert greet_many([]) == []
`,
      },
      {
        path: ".github/workflows/ci.yml",
        language: "yaml",
        description: "GitHub Actions — install + lint + test on every push",
        content: `name: Python CI

on:
  push:
    branches: [ "main" ]
  pull_request:
    branches: [ "main" ]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip

      - name: Install dependencies
        run: pip install -r requirements.txt

      - name: Run tests with coverage
        run: pytest --cov=hello_app --cov-report=term-missing
`,
      },
      {
        path: ".gitignore",
        language: "text",
        isGenerated: true,
        description: "Standard Python .gitignore",
        content: `# Virtual environments
.venv/
env/
venv/

# Python cache
__pycache__/
*.pyc
*.pyo

# pytest
.pytest_cache/
.coverage
htmlcov/

# IDE
.vscode/
.idea/
*.iml

# System
.DS_Store
Thumbs.db
`,
      },
    ],
    gitWorkflow: {
      gitignore: `.venv/\n__pycache__/\n*.pyc\n.pytest_cache/\n.coverage\n.DS_Store`,
      ciWorkflow: `name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: '3.11', cache: pip}\n      - run: pip install -r requirements.txt && pytest`,
      branchStrategy: "main (protected) + feature/* branches. PR required to merge.",
      commitConvention: "Conventional Commits — feat:, fix:, test:, docs:, chore:",
      commitExamples: [
        "feat: add greet_many() function for batch greetings",
        "test: add pytest cases for empty and whitespace-only names",
        "ci: add coverage report to GitHub Actions test step",
      ],
    },
    concepts: ["pip", "venv", "Python packages", "pytest", "GitHub Actions"],
    learningObjectives: [
      "Create and activate a Python virtual environment",
      "Structure code as a proper Python package (__init__.py, modules)",
      "Write pytest tests using assert, pytest.raises",
      "Use type hints (str, list[str]) for better IDE support",
      "Set up a GitHub Actions workflow that runs tests on every push",
    ],
    portfolioLine: "Python package with virtual environment, pytest tests, and GitHub Actions CI",
    githubTemplateUrl: "https://github.com/robodynamics/vidya-starter-pip",
    gitpodUrl: "https://gitpod.io/#https://github.com/robodynamics/vidya-starter-pip",
    tags: ["pip", "venv", "pytest", "beginner", "python3.11"],
  },

  // ── 2. Grade Calculator — OOP + pytest (Intermediate) ────────────────────
  {
    id: "python-grade-calculator",
    platform: "python",
    tier: "intermediate",
    title: "Grade Calculator — OOP + pytest",
    emoji: "📊",
    tagline: "Multi-class OOP project with pip, dataclasses, and pytest fixtures",
    description:
      "Build a grade calculator with Python dataclasses (Student, Subject, GradeBook). " +
      "Use pytest fixtures for shared test data, type hints throughout, and a requirements.txt " +
      "that covers both runtime and development dependencies.",
    estimatedHours: 4,
    prereqLevel: "level-2",
    prereqTopics: ["Classes", "Dataclasses", "Lists", "Dicts", "Type Hints"],
    buildTool: "pip",
    versionMeta: { pythonVersion: "3.11", dependencies: { pytest: "7.4.3" } },
    primaryIde: "vscode",
    ideSetups: [
      {
        ide: "vscode",
        label: "VS Code",
        logoEmoji: "🔷",
        downloadUrl: "https://code.visualstudio.com/",
        extensions: [
          { id: "ms-python.python", name: "Python", required: true },
        ],
        steps: [
          "Open the grade-calculator folder in VS Code",
          "Create venv: python -m venv .venv",
          "Activate: source .venv/bin/activate (Windows: .venv\\Scripts\\activate)",
          "Install: pip install -r requirements.txt",
          "Run: python -m gradebook",
          "Test: pytest -v",
        ],
        terminalCommands: ["python -m venv .venv", "pip install -r requirements.txt", "pytest -v"],
      },
    ],
    files: [
      {
        path: "requirements.txt",
        language: "text",
        isKey: true,
        description: "Dependencies",
        content: `pytest==7.4.3\npytest-cov==4.1.0\n`,
      },
      {
        path: "gradebook/models.py",
        language: "python",
        isKey: true,
        description: "Student and Subject dataclasses",
        content: `"""
Data models for the Grade Book application.
Uses Python dataclasses for clean, boilerplate-free class definitions.
"""

from dataclasses import dataclass, field
from typing import Optional


@dataclass
class Subject:
    """A subject with a name and marks obtained (0-100)."""
    name: str
    marks: float

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise ValueError("Subject name cannot be empty")
        if not (0 <= self.marks <= 100):
            raise ValueError(f"Marks must be 0-100, got {self.marks}")


@dataclass
class Student:
    """A student with a name, roll number, and list of subjects."""
    name: str
    roll_number: str
    subjects: list[Subject] = field(default_factory=list)

    def __post_init__(self) -> None:
        if not self.name.strip():
            raise ValueError("Student name cannot be empty")

    def add_subject(self, subject: Subject) -> None:
        """Add a subject to this student's record."""
        self.subjects.append(subject)

    @property
    def average(self) -> float:
        """Average marks across all subjects (0.0 if no subjects)."""
        if not self.subjects:
            return 0.0
        return sum(s.marks for s in self.subjects) / len(self.subjects)

    @property
    def letter_grade(self) -> str:
        """Letter grade based on average marks."""
        avg = self.average
        if avg >= 90: return "A+"
        if avg >= 80: return "A"
        if avg >= 70: return "B"
        if avg >= 60: return "C"
        if avg >= 50: return "D"
        return "F"

    def report(self) -> str:
        """One-line summary for the grade book report."""
        return f"{self.roll_number:<8} {self.name:<20} Avg: {self.average:5.1f}  Grade: {self.letter_grade}"
`,
      },
      {
        path: "gradebook/__init__.py",
        language: "python",
        isKey: true,
        description: "Package init",
        content: `"""Gradebook — OOP grade tracking package."""
from .models import Student, Subject

__all__ = ["Student", "Subject"]
`,
      },
      {
        path: "gradebook/__main__.py",
        language: "python",
        description: "Demo: python -m gradebook",
        content: `"""Demo application — run with: python -m gradebook"""
from gradebook import Student, Subject

students = [
    Student("Alice", "S001", [Subject("Maths", 92), Subject("Science", 88), Subject("English", 75)]),
    Student("Bob",   "S002", [Subject("Maths", 55), Subject("Science", 62), Subject("English", 48)]),
    Student("Carol", "S003", [Subject("Maths", 78), Subject("Science", 81), Subject("English", 90)]),
]

print("=" * 50)
print(f"{'Roll':<8} {'Name':<20} {'Avg':>7}  {'Grade':>7}")
print("=" * 50)
for s in students:
    print(s.report())
`,
      },
      {
        path: "tests/conftest.py",
        language: "python",
        isKey: true,
        description: "pytest fixtures shared across test files",
        content: `"""Shared pytest fixtures."""
import pytest
from gradebook import Student, Subject


@pytest.fixture
def alice() -> Student:
    """A student with three subjects averaging 85."""
    s = Student("Alice", "S001")
    s.add_subject(Subject("Maths", 92))
    s.add_subject(Subject("Science", 88))
    s.add_subject(Subject("English", 75))
    return s


@pytest.fixture
def empty_student() -> Student:
    return Student("Empty", "S000")
`,
      },
      {
        path: "tests/test_student.py",
        language: "python",
        isKey: true,
        description: "pytest tests using fixtures and parametrize",
        content: `"""Tests for Student model."""
import pytest
from gradebook import Student, Subject


def test_average_three_subjects(alice):
    assert alice.average == pytest.approx(85.0, abs=0.01)


def test_letter_grade_alice(alice):
    assert alice.letter_grade == "A"


def test_average_zero_no_subjects(empty_student):
    assert empty_student.average == 0.0


@pytest.mark.parametrize("avg, expected_grade", [
    (95, "A+"), (85, "A"), (75, "B"), (65, "C"), (52, "D"), (30, "F"),
])
def test_grade_thresholds(avg, expected_grade):
    s = Student("Test", "T01")
    s.add_subject(Subject("X", avg))
    assert s.letter_grade == expected_grade


def test_marks_out_of_range_raises():
    with pytest.raises(ValueError):
        Subject("Maths", 101)


def test_empty_name_raises():
    with pytest.raises(ValueError):
        Student("", "S99")


def test_report_contains_name(alice):
    assert "Alice" in alice.report()
    assert "A" in alice.report()
`,
      },
      {
        path: ".github/workflows/ci.yml",
        language: "yaml",
        description: "GitHub Actions CI with coverage",
        content: `name: Grade Calculator CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
          cache: pip
      - run: pip install -r requirements.txt
      - run: pytest -v --cov=gradebook --cov-report=term-missing
`,
      },
      {
        path: ".gitignore",
        language: "text",
        isGenerated: true,
        description: "Python .gitignore",
        content: `.venv/\n__pycache__/\n*.pyc\n.pytest_cache/\n.coverage\nhtmlcov/\n.DS_Store\n.idea/\n.vscode/\n`,
      },
    ],
    gitWorkflow: {
      gitignore: `.venv/\n__pycache__/\n*.pyc\n.pytest_cache/\n.coverage\n.DS_Store`,
      ciWorkflow: `name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: '3.11', cache: pip}\n      - run: pip install -r requirements.txt && pytest -v`,
      branchStrategy: "main (protected) + feature/* branches",
      commitConvention: "Conventional Commits",
      commitExamples: [
        "feat: add letter_grade property with A+/A/B/C/D/F bands",
        "test: add parametrize fixture for all grade threshold boundaries",
        "refactor: use @dataclass instead of manual __init__ for Student",
      ],
    },
    concepts: ["Python dataclasses", "pytest fixtures", "parametrize", "type hints", "properties"],
    learningObjectives: [
      "Use @dataclass to reduce class boilerplate",
      "Add @property for computed attributes (average, letter_grade)",
      "Write pytest fixtures in conftest.py for shared test data",
      "Use @pytest.mark.parametrize for data-driven tests",
      "Structure a multi-module Python package (gradebook/models.py, __init__.py)",
    ],
    portfolioLine: "Multi-class OOP grade book in Python with dataclasses, pytest fixtures, and GitHub Actions CI",
    tags: ["pip", "dataclasses", "pytest", "oop", "intermediate"],
  },

  // ── 3. Todo CLI — Poetry + Rich (Advanced) ────────────────────────────────
  {
    id: "python-todo-cli-poetry",
    platform: "python",
    tier: "advanced",
    title: "Todo CLI — Poetry + Rich Terminal UI",
    emoji: "✅",
    tagline: "Command-line app with Poetry, argparse, Rich, JSON persistence, and full CI",
    description:
      "Build a feature-complete command-line todo manager using Poetry for dependency " +
      "management, Rich for beautiful terminal output, argparse for CLI argument parsing, " +
      "and JSON file persistence. Includes 20+ pytest tests and a full CI pipeline.",
    estimatedHours: 6,
    prereqLevel: "level-3",
    prereqTopics: ["Classes", "File I/O", "JSON", "Exceptions", "Type Hints", "Enums"],
    buildTool: "poetry",
    versionMeta: {
      pythonVersion: "3.11",
      dependencies: { rich: "13.7.0", pytest: "7.4.3" },
    },
    primaryIde: "vscode",
    ideSetups: [
      {
        ide: "vscode",
        label: "VS Code",
        logoEmoji: "🔷",
        downloadUrl: "https://code.visualstudio.com/",
        extensions: [
          { id: "ms-python.python", name: "Python", required: true },
        ],
        steps: [
          "Install Poetry: pip install poetry (or follow poetry.eustace.io)",
          "Open the todo-cli folder in VS Code",
          "Install dependencies: poetry install",
          "Run the app: poetry run python -m todo add 'Buy groceries'",
          "Run tests: poetry run pytest -v",
          "Build a distributable: poetry build",
        ],
        terminalCommands: [
          "poetry install",
          "poetry run python -m todo add 'Buy groceries'",
          "poetry run python -m todo list",
          "poetry run pytest -v",
          "poetry build",
        ],
      },
    ],
    files: [
      {
        path: "pyproject.toml",
        language: "toml",
        isKey: true,
        description: "Poetry project file — replaces setup.py + requirements.txt",
        content: `[tool.poetry]
name = "todo-cli"
version = "1.0.0"
description = "A beautiful command-line todo manager"
authors = ["Your Name <you@example.com>"]
readme = "README.md"

[tool.poetry.dependencies]
python = "^3.11"
rich = "^13.7.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.3"
pytest-cov = "^4.1.0"

[tool.poetry.scripts]
todo = "todo.__main__:main"

[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"

[tool.pytest.ini_options]
testpaths = ["tests"]
`,
      },
      {
        path: "todo/models.py",
        language: "python",
        isKey: true,
        description: "Todo item model with priority and status",
        content: `"""Data models for the Todo application."""

from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Optional
import uuid


class Priority(Enum):
    LOW    = "low"
    MEDIUM = "medium"
    HIGH   = "high"


class Status(Enum):
    PENDING   = "pending"
    DONE      = "done"


@dataclass
class TodoItem:
    """A single todo item."""
    title: str
    priority: Priority = Priority.MEDIUM
    status: Status = Status.PENDING
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])

    def complete(self) -> None:
        """Mark this item as done."""
        self.status = Status.DONE

    def is_done(self) -> bool:
        return self.status == Status.DONE

    def to_dict(self) -> dict:
        return {
            "id":         self.id,
            "title":      self.title,
            "priority":   self.priority.value,
            "status":     self.status.value,
            "created_at": self.created_at,
        }

    @classmethod
    def from_dict(cls, data: dict) -> "TodoItem":
        return cls(
            id         = data["id"],
            title      = data["title"],
            priority   = Priority(data["priority"]),
            status     = Status(data["status"]),
            created_at = data["created_at"],
        )
`,
      },
      {
        path: "todo/storage.py",
        language: "python",
        description: "JSON file persistence layer",
        content: `"""JSON file storage for todo items."""

import json
from pathlib import Path
from typing import List
from .models import TodoItem


class TodoStorage:
    """Loads and saves todo items to a JSON file."""

    def __init__(self, path: str = "todos.json") -> None:
        self.path = Path(path)

    def load(self) -> List[TodoItem]:
        """Load all items from the JSON file. Returns [] if file doesn't exist."""
        if not self.path.exists():
            return []
        try:
            data = json.loads(self.path.read_text(encoding="utf-8"))
            return [TodoItem.from_dict(item) for item in data]
        except (json.JSONDecodeError, KeyError, ValueError):
            return []

    def save(self, items: List[TodoItem]) -> None:
        """Save all items to the JSON file."""
        self.path.write_text(
            json.dumps([item.to_dict() for item in items], indent=2, ensure_ascii=False),
            encoding="utf-8",
        )
`,
      },
      {
        path: "todo/__main__.py",
        language: "python",
        isKey: true,
        description: "CLI entry point with argparse + Rich output",
        content: `"""Todo CLI entry point. Run with: python -m todo <command>"""

import argparse
import sys
from rich.console import Console
from rich.table import Table
from rich import print as rprint

from .models import TodoItem, Priority, Status
from .storage import TodoStorage

console = Console()


def cmd_add(args, storage: TodoStorage) -> None:
    items = storage.load()
    priority = Priority(args.priority)
    item = TodoItem(title=" ".join(args.title), priority=priority)
    items.append(item)
    storage.save(items)
    rprint(f"[green]✓[/green] Added: [bold]{item.title}[/bold] [{priority.value}]")


def cmd_list(args, storage: TodoStorage) -> None:
    items = storage.load()
    if not items:
        rprint("[dim]No todos yet. Add one with: todo add 'My task'[/dim]")
        return

    table = Table(show_header=True, header_style="bold cyan")
    table.add_column("ID",       style="dim",    width=10)
    table.add_column("Title",                    min_width=30)
    table.add_column("Priority", style="yellow", width=10)
    table.add_column("Status",                   width=10)

    for item in items:
        status_str = "[green]✓ Done[/green]" if item.is_done() else "[yellow]Pending[/yellow]"
        table.add_row(item.id, item.title, item.priority.value, status_str)

    console.print(table)


def cmd_done(args, storage: TodoStorage) -> None:
    items = storage.load()
    found = [i for i in items if i.id == args.id]
    if not found:
        rprint(f"[red]No item found with ID {args.id}[/red]")
        sys.exit(1)
    found[0].complete()
    storage.save(items)
    rprint(f"[green]✓[/green] Marked as done: [bold]{found[0].title}[/bold]")


def main() -> None:
    parser = argparse.ArgumentParser(prog="todo", description="A beautiful todo manager")
    sub = parser.add_subparsers(dest="command", required=True)

    p_add = sub.add_parser("add", help="Add a new todo item")
    p_add.add_argument("title", nargs="+", help="Todo title")
    p_add.add_argument("--priority", choices=["low", "medium", "high"], default="medium")

    sub.add_parser("list", help="List all todos")

    p_done = sub.add_parser("done", help="Mark a todo as done")
    p_done.add_argument("id", help="Todo item ID")

    args = parser.parse_args()
    storage = TodoStorage()

    if args.command == "add":   cmd_add(args, storage)
    elif args.command == "list": cmd_list(args, storage)
    elif args.command == "done": cmd_done(args, storage)


if __name__ == "__main__":
    main()
`,
      },
      {
        path: "tests/test_models.py",
        language: "python",
        isKey: true,
        description: "pytest tests for TodoItem model",
        content: `"""Tests for TodoItem model."""

import pytest
from todo.models import TodoItem, Priority, Status


def test_new_item_is_pending():
    item = TodoItem("Buy milk")
    assert item.status == Status.PENDING
    assert not item.is_done()


def test_complete_marks_as_done():
    item = TodoItem("Buy milk")
    item.complete()
    assert item.is_done()
    assert item.status == Status.DONE


def test_default_priority_is_medium():
    item = TodoItem("Task")
    assert item.priority == Priority.MEDIUM


def test_to_dict_roundtrip():
    original = TodoItem("Do homework", priority=Priority.HIGH)
    restored = TodoItem.from_dict(original.to_dict())
    assert restored.title    == original.title
    assert restored.priority == original.priority
    assert restored.status   == original.status
    assert restored.id       == original.id


def test_id_is_unique():
    a = TodoItem("A")
    b = TodoItem("B")
    assert a.id != b.id


@pytest.mark.parametrize("priority", [Priority.LOW, Priority.MEDIUM, Priority.HIGH])
def test_all_priorities_roundtrip(priority):
    item = TodoItem("Test", priority=priority)
    restored = TodoItem.from_dict(item.to_dict())
    assert restored.priority == priority
`,
      },
      {
        path: ".github/workflows/ci.yml",
        language: "yaml",
        description: "GitHub Actions CI with Poetry",
        content: `name: Todo CLI CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - name: Install Poetry
        run: pip install poetry
      - name: Install dependencies
        run: poetry install
      - name: Run tests
        run: poetry run pytest -v --cov=todo --cov-report=term-missing
      - name: Build distribution
        run: poetry build
`,
      },
      {
        path: ".gitignore",
        language: "text",
        isGenerated: true,
        description: "Python + Poetry .gitignore",
        content: `.venv/\n__pycache__/\n*.pyc\n.pytest_cache/\n.coverage\nhtmlcov/\ndist/\n*.egg-info/\ntodos.json\n.DS_Store\n.idea/\n.vscode/\n`,
      },
    ],
    gitWorkflow: {
      gitignore: `.venv/\n__pycache__/\n*.pyc\n.pytest_cache/\n.coverage\ndist/\ntodos.json\n.DS_Store`,
      ciWorkflow: `name: CI\non: [push]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - uses: actions/setup-python@v5\n        with: {python-version: '3.11'}\n      - run: pip install poetry && poetry install && poetry run pytest`,
      branchStrategy: "main (protected) + feature/* + fix/* branches",
      commitConvention: "Conventional Commits",
      commitExamples: [
        "feat: add Priority enum with LOW/MEDIUM/HIGH values",
        "feat: implement JSON persistence in TodoStorage",
        "test: add parametrize test for all priority roundtrip scenarios",
        "ci: build Poetry distribution package in GitHub Actions",
      ],
    },
    concepts: ["Poetry", "argparse", "Rich terminal UI", "Enums", "JSON persistence", "GitHub Actions"],
    learningObjectives: [
      "Set up a Python project with Poetry (pyproject.toml replaces setup.py + requirements.txt)",
      "Use Python Enum for type-safe status and priority values",
      "Build a CLI with argparse sub-commands (add, list, done)",
      "Persist data to a JSON file using pathlib and json",
      "Add beautiful terminal output using the Rich library",
      "Package and distribute a CLI tool with poetry build",
    ],
    portfolioLine: "Full-featured Python CLI todo app with Poetry, Rich UI, JSON persistence, and GitHub Actions CI/CD",
    tags: ["poetry", "cli", "rich", "argparse", "advanced", "packaging"],
  },
];
