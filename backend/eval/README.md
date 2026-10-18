# AegisPath Attack Evaluation Suite

Empirical evaluation harness for LLM safety and prompt injection defense.

## Purpose
Executes 12 attack families across 10 variants each (120 test cases + benign twins) to evaluate outer, middle, and inner defense rings. Generates ablation tables with observed counts and Wilson 95% confidence intervals at `eval/reports/latest.json`.
