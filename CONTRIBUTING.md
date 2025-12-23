# Contributing to Hunspell-TH

First off, thank you for considering contributing to Hunspell-TH! It's people like you that make this tool better for everyone.

## How Can I Contribute?

### Reporting Bugs
This section guides you through submitting a bug report for Hunspell-TH. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

*   **Use a clear and descriptive title** for the issue to identify the problem.
*   **Describe the exact steps which reproduce the problem** in as much detail as possible.
*   **Provide specific examples** to demonstrate the steps.

### Suggesting Enhancements
This section guides you through submitting an enhancement suggestion for Hunspell-TH, including completely new features and minor improvements to existing functionality.

*   **Use a clear and descriptive title** for the issue to identify the suggestion.
*   **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
*   **Explain why this enhancement would be useful** to most Hunspell-TH users.

### Adding Words to the Dictionary
1.  Fork the repository.
2.  Add the new words to `th_TH.dic`.
    *   Ensure strict UTF-8 encoding.
    *   **Do not manual sort**: The CI/CD pipeline or `npm run sort-dict` will handle sorting.
3.  Run `npm run sort-dict` to normalize the file.
4.  Commit your changes: `git commit -m "Add word: สวัสดี"`.
5.  Push to your fork and submit a Pull Request.

### Pull Requests
The process is straightforward:

1.  Fork the repo and create your branch from `master`.
2.  If you've added code that should be tested, add tests.
3.  Ensure the test suite passes (`npm test`).
4.  Make sure your code lints (`npm run lint`).

## Styleguides

### Git Commit Messages
*   Use the present tense ("Add feature" not "Added feature").
*   Use the imperative mood ("Move cursor to..." not "Moves cursor to...").
*   Limit the first line to 72 characters or less.
*   Reference issues and pull requests liberally after the first line.

### Dictionary Format
*   The dictionary uses standard Hunspell format.
*   `th_TH.dic` must be sorted according to Thai locale rules (managed by our scripts).
