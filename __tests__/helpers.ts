import faker from "faker";
import dotenv from "dotenv";
import { seal } from "../src/common/services/jsonwebtoken";

dotenv.config();

/**
 * Is list of value generators(static and dynamic) and their weight.
 * The weight is used to calculate the probabilty of the generator being
 * used.
 */
export type Choices = [() => any | any, number][];

export interface Session {
  user?: string;
  first_name?: string;
  last_name?: string;
  email_address?: string;
  [key: string]: any;
}

/**
 * Run this function after `duration` wrapping the entire delay
 * in a promise. This is useful for testing workers as it would
 * take some time to send and receive messages, as well as an
 * event queue break to handle the message
 * @param fn function to run tests or anything you want...do your
 * worst
 */
export function delayed(fn: () => Promise<void>, duration = 500) {
  return new Promise(resolve => {
    setTimeout(async () => {
      await fn();
      resolve(true);
    }, duration);
  });
}

export function timeout(duration = 500) {
  return delayed(() => Promise.resolve(), duration);
}

/**
 * Generate multiple version using a mock data function.
 * @param n number of values to generate
 * @param fn mock data function
 */
export function multiply<T>(n: number, fn: () => T): T[] {
  const results: T[] = [];

  for (let i = 0; i < n; i++) {
    results.push(fn());
  }

  return results;
}

/**
 * Run async job `fn` `n` times.
 * @param n number of times to run it
 * @param fn job to run
 */
export async function repeat(n: number, fn: () => Promise<any>): Promise<any[]> {
  const jobs = Array.from({ length: n }).map(() => fn());
  return Promise.all(jobs);
}

/**with possible extra properties(e.g. user permissions)
 * @param extras extra permissions an session properties
 */
export function createSession(id: string, extras = {}): Session {
  return {
    id,
    email_address: faker.internet.email(),
    first_name: faker.name.firstName(),
    last_name: faker.name.lastName(),
    ...extras
  };
}

/**
 * Create an `Authorization` header value that bypasses permission check
 * @param session session used to derive a token
 */
export async function createJsonWebToken(session?: Session) {
  const token = await seal(session, process.env.SECRET_KEY, "1h");
  return `Bearer ${token}`;
}
