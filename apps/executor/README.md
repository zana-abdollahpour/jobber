## Executor

The executor is a NestJS application in the Nx workspace. Its Nx targets use the Nest CLI with the TypeScript compiler (no webpack):

```bash
npx nx build executor
npx nx serve executor
npx nx test executor
```

You can also use the app-local Nest scripts from `apps/executor`.
