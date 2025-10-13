#!/usr/bin/env node
import { runTests } from "./runTests";

const projectRoot = process.cwd();

runTests(projectRoot);
