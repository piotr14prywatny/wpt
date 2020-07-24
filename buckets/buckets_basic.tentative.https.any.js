// META: title=Buckets API: Basic tests for openOrCreate(), keys(), delete().
// META: global=window,worker

'use strict';

// This test is for initial IDL version optimized for debugging.
// Split and add extensive testing once implementation for the endpoints are
// added and method definitions are more defined.
promise_test(async testCase => {
  await navigator.storage.buckets.openOrCreate('test');
  testCase.add_cleanup(async () => {
    await navigator.storage.buckets.delete('test');
  });

  const buckets = await navigator.storage.buckets.keys();
  assert_equals(buckets.length, 1);
  assert_equals(buckets[0], 'test');
}, 'openOrCreate() stores bucket name');

promise_test(async testCase => {
  await navigator.storage.buckets.openOrCreate('test');
  await navigator.storage.buckets.openOrCreate('test');
  testCase.add_cleanup(async () => {
    await navigator.storage.buckets.delete('test');
  });

  const buckets = await navigator.storage.buckets.keys();
  assert_equals(buckets.length, 1);
  assert_equals(buckets[0], 'test');
}, 'openOrCreate() does not store duplicate bucket name');

promise_test(async testCase => {
  await navigator.storage.buckets.openOrCreate('test1');
  await navigator.storage.buckets.openOrCreate('test2');
  await navigator.storage.buckets.openOrCreate('test3');
  testCase.add_cleanup(async () => {
    await navigator.storage.buckets.delete('test1');
    await navigator.storage.buckets.delete('test2');
    await navigator.storage.buckets.delete('test3');
  });

  const buckets = await navigator.storage.buckets.keys();
  assert_equals(buckets.length, 3);
  assert_equals(buckets[0], 'test1');
  assert_equals(buckets[1], 'test2');
  assert_equals(buckets[2], 'test3');
}, 'keys() lists all stored bucket names');

promise_test(async testCase => {
  await navigator.storage.buckets.openOrCreate('test1');
  await navigator.storage.buckets.openOrCreate('test2');
  testCase.add_cleanup(async () => {
    await navigator.storage.buckets.delete('test1');
    await navigator.storage.buckets.delete('test2');
  });

  let buckets = await navigator.storage.buckets.keys();
  assert_equals(buckets.length, 2);
  assert_equals(buckets[0], 'test1');
  assert_equals(buckets[1], 'test2');

  await navigator.storage.buckets.delete('test1');

  buckets = await navigator.storage.buckets.keys();
  assert_equals(buckets.length, 1);
  assert_equals(buckets[0], 'test2');
}, 'delete() removes stored bucket name');

promise_test(async testCase => {
  await navigator.storage.buckets.openOrCreate('test');
  testCase.add_cleanup(async () => {
    await navigator.storage.buckets.delete('test');
  });

  let buckets = await navigator.storage.buckets.keys();
  assert_equals(buckets.length, 1);
  assert_equals(buckets[0], 'test');

  await navigator.storage.buckets.delete('does-not-exist');

  buckets = await navigator.storage.buckets.keys();
  assert_equals(buckets.length, 1);
  assert_equals(buckets[0], 'test');
}, 'delete() does nothing if bucket name does not exist');
