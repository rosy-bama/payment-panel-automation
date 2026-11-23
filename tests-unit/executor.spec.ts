/**
 * The executor (spec §6.10.4): steps run on the catalog's page objects, values resolve on this machine, guarded
 * steps never run on a run that doesn't allow them, a failure names its step.
 */
import { expect, test } from '@playwright/test';
import type { Catalog } from '../src/support/catalog';
import { BlockedCase, runCase, type ExecutorDeps, type StepScreen } from '../src/executor/execute';
import type { PlanCase, Step } from '../src/executor/plan';
import { resolveValue, type ValueContext } from '../src/executor/values';

const catalog: Catalog = {
  version: 1,
  app: 'Payment Panel',
  framework: 'playwright',
  screens: [
    {
      id: 'makePaymentWizard',
      name: 'MakePaymentWizard',
      className: 'MakePaymentWizard',
      file: 'src/pages/MakePaymentWizard.ts',
      description: null,
      elements: [
        { id: 'amountInput', kind: 'field', platforms: ['web'] },
        { id: 'makePaymentButton', kind: 'button', platforms: ['web'], guard: 'movesMoney' },
        { id: 'banner', kind: 'text', platforms: ['web'] },
      ],
      actions: [{ id: 'expectReviewStep', params: [], description: null, returns: null }],
    },
  ],
  flows: [],
};

const values: ValueContext = {
  account: (n) => (n === 'ADMIN' ? { fields: { username: 'admin', password: 'pw', otp: '123456' }, secret: ['password', 'otp'] } : undefined),
  data: (n) => ({ customerUsername: 'customer1' })[n],
  run: { env: 'testbox', platform: 'web' },
};

function fakes(withExpectText = true) {
  const calls: string[] = [];
  const screen: StepScreen & { expectReviewStep(): Promise<void> } = {
    stepTap: async (k) => void calls.push(`tap ${k}`),
    stepType: async (k, v, o) => void calls.push(`type ${k}=${o?.secret ? '***' : v}`),
    stepSelect: async (k, v) => void calls.push(`select ${k}=${v}`),
    stepExpectShown: async () => void calls.push('shown'),
    stepExpect: async (k, c) => {
      calls.push(`expect ${k} ${c}`);
      if (c === 'disabled') throw new Error(`expect(locator).toBeDisabled() failed`);
    },
    stepText: async () => 'Fee 100 XAF',
    ...(withExpectText ? { stepExpectText: async (k: string, op: string, v: string) => void calls.push(`text ${k} ${op} ${v}`) } : {}),
    expectReviewStep: async () => void calls.push('expectReviewStep'),
  };
  const deps: ExecutorDeps = {
    catalog,
    screen: async () => screen,
    flow: async () => async () => undefined,
    values,
    allow: { movesMoney: false, changesState: false },
    testContext: {},
    pause: async (ms) => void calls.push(`pause ${ms}`),
    log: () => {},
  };
  return { calls, deps };
}

const kase = (...steps: Step[]): PlanCase => ({ tcId: 'PP-PAY-001', title: 'x', tags: [], testTitle: 'PP-PAY-001 x', steps: steps.map((step, i) => ({ line: i + 1, text: JSON.stringify(step), step })) });

test('runs each kind of step on the page objects', async () => {
  const { calls, deps } = fakes();
  await runCase(
    kase(
      { kind: 'do', target: 'makePaymentWizard.expectReviewStep', args: [] },
      { kind: 'type', target: 'makePaymentWizard.amountInput', value: '500' },
      { kind: 'type', target: 'makePaymentWizard.amountInput', value: '{{account.ADMIN.password}}' },
      { kind: 'select', target: 'makePaymentWizard.amountInput', value: '{{data.customerUsername}}' },
      { kind: 'expect', target: 'makePaymentWizard', condition: 'shown' },
      { kind: 'expect', target: 'makePaymentWizard.banner', condition: 'text', op: 'contains', value: '"fee"' },
      { kind: 'wait', seconds: 1 },
    ),
    deps,
  );
  expect(calls).toEqual(['expectReviewStep', 'type amountInput=500', 'type amountInput=***', 'select amountInput=customer1', 'shown', 'text banner contains fee', 'pause 1000']);
});

test('a failure names the step and the line', async () => {
  await expect(runCase(kase({ kind: 'wait', seconds: 0 }, { kind: 'expect', target: 'makePaymentWizard.amountInput', condition: 'disabled' }), fakes().deps)).rejects.toThrow(/^step 2 \(line 2\): .* — expect\(locator\)\.toBeDisabled\(\) failed$/);
  await expect(runCase(kase({ kind: 'expect', target: 'makePaymentWizard.banner', condition: 'text', op: 'is', value: '"Fee 200 XAF"' }), fakes(false).deps)).rejects.toThrow(/it says "Fee 100 XAF", expected it to be "Fee 200 XAF"/);
});

test('a money step blocks the whole case before anything runs', async () => {
  const { calls, deps } = fakes();
  const err = await runCase(kase({ kind: 'type', target: 'makePaymentWizard.amountInput', value: '500' }, { kind: 'tap', target: 'makePaymentWizard.makePaymentButton' }), deps).catch((e) => e);
  expect(err).toBeInstanceOf(BlockedCase);
  expect(err.message).toContain('PP_ALLOW_PAYMENTS=true');
  expect(calls).toEqual([]);
});

test('values: literals, accounts, data, run, errors', () => {
  expect(resolveValue('"a, b"', values)).toEqual({ value: 'a, b', secret: false });
  expect(resolveValue('{{account.ADMIN.username}}', values)).toEqual({ value: 'admin', secret: false });
  expect(resolveValue('{{account.ADMIN.otp}}', values).secret).toBe(true);
  expect(resolveValue('{{data.customerUsername}}', values).value).toBe('customer1');
  expect(() => resolveValue('{{account.OTHER.username}}', values)).toThrow(/no such account/);
  expect(() => resolveValue('{{data.nope}}', values)).toThrow(/no such test data/);
});
