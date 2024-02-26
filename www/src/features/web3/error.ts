export class Web3Error extends Error {
  constructor(message: string, stack?: string) {
    super(message);
    this.stack = stack;
  }
}

export function fromError(error: any) {
  if (error instanceof Web3Error) {
    return error;
  }
  return new Web3Error(error.message, error.stack);
}
