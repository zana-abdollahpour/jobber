import { Job } from '../decorators/job.decorator';
import { AbstractJob } from '../interfaces/job.abstract';

@Job({
  name: 'Fibonacci',
  description: 'Generates a Fibonacci sequence and stores it in the database',
})
export class FibonacciJob extends AbstractJob {
  public async execute() {
    console.log("I'm running Fibonacci and happy for it");
  }
}
