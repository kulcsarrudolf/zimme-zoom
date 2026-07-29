# Contributing to zimme-zoom

Thanks for your interest in contributing to zimme-zoom!

## Getting Started

1. Fork and clone the repository
2. Enable Corepack so the pinned Yarn 4 version is used: `corepack enable`
3. Install dependencies: `yarn install`
4. Create a branch: `git checkout -b feature/your-feature-name`

## Development

```bash
yarn storybook   # see your changes in action
yarn test        # run the test suite
yarn lint        # lint
yarn format      # format
yarn build       # build the library
yarn size        # check bundle budgets after building
```

Husky runs `lint-staged` and the tests on commit, and lints the message with commitlint.
Commit messages must follow [Conventional Commits](https://www.conventionalcommits.org/), for example `fix(PhotoViewer): restore focus to the opener`.

`yarn size` measures the generated files in `dist/`, so running it before
`yarn build` will fail because the artifacts do not exist yet. The size-limit
packages are intentionally pinned to exact versions so dependency patch releases
do not change byte measurements during unrelated PRs.

### Testing

Run the Jest suite:

```bash
yarn test
```

Component tests use React Testing Library and `@testing-library/user-event`.
Prefer user-visible roles, labels, and interactions over implementation details.

## Making Changes

1. Make your changes in `src/`
2. Add or update tests, and stories in `src/stories/` if needed
3. Ensure everything passes: `yarn lint && yarn test && yarn build`
4. Add a changeset if the published package is affected: `yarn changeset`
   (tooling, CI, and docs-only changes do not need one)

## Submitting Changes

Push to your fork and open a Pull Request describing what changed and why.
Keep it focused on one thing, include tests or a story for new behavior, add a screenshot for visual changes, and make sure CI is green before asking for review.

## Review Process

A maintainer reviews the PR, you address the feedback, and it is merged as a squash merge.

### Keep review fixes as separate commits

**Do not squash, amend, or rebase while addressing review feedback.**
Push each round of fixes as new commits.
Rewriting history breaks the reviewer's "Changes since last review" view and can orphan their inline comments.
Messy commits are fine, since the PR is squash merged and the branch history never reaches `main`.

### Responding to review comments

**Every comment must end up either resolved or answered.
Never leave one silently untouched.**

- **Applied as suggested:** push the fix and resolve the conversation.
- **Solved differently:** reply explaining what you did instead and why, then resolve.
  Never resolve silently, the reviewer needs to know their suggestion is not what landed.
- **Not addressed:** leave it **unresolved** and reply with the reason (out of scope, disagreement, or deferred with a linked issue).
- **Not understood:** ask on the thread and leave it unresolved.

A resolved thread means "settled", so resolving without explanation breaks that for everyone reading later.
When everything is resolved or answered, re-request review with a short summary of what changed.

### For reviewers

Mark optional feedback with `nit:` or `suggestion:` so authors know what is blocking, and do not resolve the author's threads for them.

## Reporting Issues

Open an issue with a clear description, steps to reproduce, expected vs actual behavior, and any relevant code.

Thank you for contributing! 🎉
