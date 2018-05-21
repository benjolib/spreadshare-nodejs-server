"use strict";

const assert = require("assert");

describe("AuthPoilcy", () => {
  it("should exist", () => {
    assert(global.app.policies.AuthPoilcy);
  });
});
