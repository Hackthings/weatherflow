const User = require("../models/user");

// test users
const hedberg = { uuid: "mitch-hedberg", city: "Saint Paul, Minnesota" };
const hendrix = { uuid: "jimi-hendrix" };
const farley = {
  uuid: "chris-farley",
  city: "Madison, Wisconsin",
  low: -10,
  high: -7,
  pop: 0
};
// hedberg has 3 forecasts, hendrix and farley don't have any

it("Creates new user and returns user info", () => {
  expect.assertions(1);
  return expect(new User().save()).resolves.toEqual(
    expect.objectContaining({
      id: expect.any(Number),
      uuid: expect.any(String)
    })
  );
});

it("Throws error when you try to save a user that already exists", () => {
  expect.assertions(1);
  return expect(new User(hedberg.uuid).save()).rejects.toThrow(
    /user already exists/
  );
});

it("Fetches the users forecasts", () => {
  expect.assertions(1);
  let user = new User(hedberg.uuid);
  return expect(user.initialize().then(_ => user.forecasts())).resolves.toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        city: hedberg.city
      })
    ])
  );
});

it("Only fetches forecasts that belong to the user", () => {
  expect.assertions(1);
  let user = new User(hedberg.uuid);
  return expect(
    user.initialize().then(_ => user.forecasts())
  ).resolves.toHaveLength(3);
});

it("Returns empty array if user has no forecasts", () => {
  expect.assertions(1);
  let user = new User(hendrix.uuid);
  return expect(
    user.initialize().then(_ => user.forecasts())
  ).resolves.toHaveLength(0);
});

it("Returns empty array if user does not exist", () => {
  expect.assertions(1);
  let user = new User("ryan-villopoto");
  return expect(user.initialize().then(_ => user.forecasts())).rejects.toThrow(
    /user ryan-villopoto does not exist/
  );
});

it("Sets the id as an instance variable", () => {
  expect.assertions(1);
  let user = new User(farley.uuid);
  return expect(user.initialize().then(_ => user.id)).resolves.toBe(3);
  // farley's id is 3
});

it("Creates a forecast for a user", () => {
  expect.assertions(1);
  let user = new User(farley.uuid);
  return expect(
    user.initialize().then(_ =>
      user.addForecast({
        city: farley.city,
        low: farley.low,
        high: farley.high,
        pop: farley.pop,
        created_at: new Date(),
        user_id: user.id
      })
    )
  ).resolves.toEqual(expect.any(Number));
  // the id of the added forecast
});
