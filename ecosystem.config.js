module.exports = {
  apps: [
    {
      name: "backend",
      cwd: "./backend",
      script: "yarn",
      args: "run dev",
      watch: false,
    },
    {
      name: "storefront",
      cwd: "./storefront",
      script: "yarn",
      args: "run dev",
      watch: false,
    },
  ],
};
