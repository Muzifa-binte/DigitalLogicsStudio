# Frontend Data Contracts

The frontend does not own the database, but it depends on stable data contracts from the backend and local static catalogs. This document describes those contracts as consumed by React services and components.

## Auth User Shape

Expected from `POST /auth/login`, `POST /auth/register`, and `GET /auth/me`:

```js
{
  id: String,
  name: String,
  email: String,
  solvedProblems: Number[],
  createdAt: String
}
```

Frontend usage:

- `AuthContext.user`
- `AuthContext.solvedProblems`
- protected profile route
- legacy solved-problem indicators

## Progress Snapshot Shape

Expected from `GET /progress/snapshot`:

```js
{
  success: true,
  state: {
    problems: {
      [problemId]: {
        attempts: Number,
        status: "not_started" | "attempted" | "solved",
        openedAt: String | null,
        lastAttemptAt: String | null,
        solvedAt: String | null,
        title: String,
        tags: String[],
        topicId: String | null
      }
    },
    topics: {
      [topicId]: {
        status: "not_started" | "in_progress" | "completed",
        openedAt: String | null,
        completedAt: String | null,
        completionPercentage: Number,
        completedSubtopics: String[],
        totalSubtopics: Number,
        title: String
      }
    },
    activity: {
      [dateKey]: {
        attempts: Number,
        solved: Number,
        topicsCompleted: Number,
        topicsOpened: Number
      }
    },
    recentEvents: RecentEvent[]
  }
}
```

## RecentEvent Shape

```js
{
  id: String,
  type: "problem_attempted" | "problem_solved" | "topic_opened" | "topic_completed",
  createdAt: String,
  problemId: Number | null,
  topicId: String | null,
  subtopicId: String | null,
  title: String
}
```

## Topic Catalog Shape

Topic data appears in section config files and home data. Progress service expects topic objects like:

```js
{
  id: String,
  title: String,
  links: [
    {
      id: String,
      label: String,
      to: String
    }
  ],
  subtopicAliases: {
    [legacyId]: canonicalId
  }
}
```

## Problem Catalog Shape

Problem progress expects problem objects like:

```js
{
  id: Number,
  title: String,
  tags: String[],
  primaryTopicId: String | null
}
```

## Client-Derived Summary

`progressService` derives:

```js
{
  solvedProblems: Number,
  attemptedProblems: Number,
  completedTopics: Number,
  totalProblems: Number,
  totalTopics: Number,
  completionRate: Number,
  streaks: {
    current: Number,
    longest: Number,
    activeDays: Number
  }
}
```

## Contract Rules

- Problem IDs must remain numeric.
- Topic and subtopic IDs must be stable strings.
- Dates should be ISO strings or `null`.
- New fields may be added, but existing fields should not be renamed without a migration.
- Backend and frontend should evolve snapshot shape together.

