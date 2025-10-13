// packages/test/src/mock.ts
export type MockFunction<T extends (...args: any[]) => any> = T & {
  mock: {
    calls: any[][];
    results: any[];
  };
  mockReturnValue(value: ReturnType<T>): void;
  mockImplementation(fn: T): void;
  mockClear(): void;
};

export function mockFn<T extends (...args: any[]) => any>(
  implementation?: T
): MockFunction<T> {
  const mockData = {
    calls: [] as any[][],
    results: [] as any[],
  };

  let impl: any = implementation;

  const fn: any = (...args: any[]) => {
    mockData.calls.push(args);
    try {
      const result = impl ? impl(...args) : undefined;
      mockData.results.push({ type: "return", value: result });
      return result;
    } catch (err) {
      mockData.results.push({ type: "throw", value: err });
      throw err;
    }
  };

  fn.mock = mockData;

  fn.mockReturnValue = (value: any) => {
    impl = () => value;
  };

  fn.mockImplementation = (newImpl: any) => {
    impl = newImpl;
  };

  fn.mockClear = () => {
    mockData.calls.length = 0;
    mockData.results.length = 0;
  };

  return fn as MockFunction<T>;
}
