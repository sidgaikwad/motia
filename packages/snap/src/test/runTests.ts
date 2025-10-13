import { runCLI } from "jest";

export async function runTests(projectRoot: string) {
  const config = {
    rootDir: projectRoot,
    testEnvironment: "node",
    transform: {
      "^.+\\.(t|j)sx?$": "ts-jest"
    },
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
    moduleDirectories: ["node_modules"],
    setupFilesAfterEnv: ["@motia/test/dist/setup.js"],
  };

  const { results } = await runCLI(
    { config: JSON.stringify(config), _: [], $0: '' },
    [projectRoot]
  );

  process.exit(results.success ? 0 : 1);
}
