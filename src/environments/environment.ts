// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: "AIzaSyDfxhEHVwu9U0ckIh9Nr30bZma0W8JKfMQ",
    // apiKey: "AIzaSyDdXZa0cFiEgP0dQPR6EhqGCzK8wJoHycs", //desarrollo
    authDomain: "gdh-masajes.firebaseapp.com",
    databaseURL: "https://gdh-masajes.firebaseio.com",
    // databaseURL: "https://masajes-test.firebaseio.com",
    projectId: "gdh-masajes",
    storageBucket: "gdh-masajes.appspot.com",
    messagingSenderId: "300960399533"
  }
};