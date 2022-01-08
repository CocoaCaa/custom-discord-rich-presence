import readline from 'readline';

export function askQuestion(str: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) =>
    rl.question(str, (ans) => {
      rl.close();
      resolve(ans);
    })
  );
}
